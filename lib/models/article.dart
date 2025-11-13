class Article {
  final String id;
  final String title;
  final String content;
  final String? name;
  final List<String>? fileUrls;
  final DateTime createdAt;
  final DateTime updatedAt;

  Article({
    required this.id,
    required this.title,
    required this.content,
    this.name,
    this.fileUrls,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Article.fromJson(Map<String, dynamic> json) {
    List<String>? fileUrls;
    if (json['files'] != null) {
      fileUrls = List<String>.from(json['files'].map((file) => file['url']));
    }

    return Article(
      id: json['id'],
      title: json['title'],
      content: json['content'],
      name: json['name'],
      fileUrls: fileUrls,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'name': name,
      'files': fileUrls,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
