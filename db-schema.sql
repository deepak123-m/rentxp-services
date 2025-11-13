-- Create a table for product images
create table gc_product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references gc_products(id) on delete cascade not null,
  image_url text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default now() not null
);

-- Create a secure RLS policy for product images
alter table gc_product_images enable row level security;

create policy "Product images are viewable by everyone"
  on gc_product_images for select
  to authenticated, anon
  using (true);

create policy "Vendors can insert images for their own products"
  on gc_product_images for insert
  using (
    exists (
      select 1 from gc_products
      where gc_products.id = gc_product_images.product_id
      and gc_products.vendor_id = auth.uid()
    )
  );

create policy "Vendors can update images for their own products"
  on gc_product_images for update
  using (
    exists (
      select 1 from gc_products
      where gc_products.id = gc_product_images.product_id
      and gc_products.vendor_id = auth.uid()
    )
  );

create policy "Vendors can delete images for their own products"
  on gc_product_images for delete
  using (
    exists (
      select 1 from gc_products
      where gc_products.id = gc_product_images.product_id
      and gc_products.vendor_id = auth.uid()
    )
  );

create policy "Admins can manage all product images"
  on gc_product_images for all
  using (
    exists (
      select 1 from gc_profiles
      where id = auth.uid() and role = 'admin'
    )
  );
