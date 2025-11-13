import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';
import 'package:path/path.dart' as path;

class ArticleService {
  final String baseUrl;
  final String accessToken;

  ArticleService({
    required this.baseUrl,
    required this.accessToken,
  });

  Future<Map<String, dynamic>> createArticle({
    required String title,
    required String content,
    String? name,
    List<File>? files,
  }) async {
    try {
      // Create multipart request
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/articles'),
      );

      // Add authorization header
      request.headers.addAll({
        'Authorization': 'Bearer $accessToken',
      });

      // Add text fields
      request.fields['title'] = title;
      request.fields['content'] = content;
      
      // Add optional name field if provided
      if (name != null && name.isNotEmpty) {
        request.fields['name'] = name;
      }

      // Add files if provided
      if (files != null && files.isNotEmpty) {
        for (var i = 0; i < files.length; i++) {
          File file = files[i];
          String fileName = path.basename(file.path);
          
          // Determine MIME type
          String? mimeType = lookupMimeType(file.path);
          String contentType = 'application/octet-stream'; // Default
          String subtype = 'octet-stream';
          
          if (mimeType != null) {
            final parts = mimeType.split('/');
            contentType = mimeType;
            subtype = parts.length > 1 ? parts[1] : 'octet-stream';
          }

          // Create multipart file
          var multipartFile = await http.MultipartFile.fromPath(
            'files', // Field name for the file
            file.path,
            contentType: MediaType(
              contentType.split('/')[0],
              subtype,
            ),
            filename: fileName,
          );
          
          request.files.add(multipartFile);
        }
      }

      // Send the request
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      // Handle the response
      if (response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to create article: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error creating article: $e');
    }
  }
}
