package com.popble.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    StoredFile store(MultipartFile file);
    void delete(String folder, String storedName);

    record StoredFile(String folder, String storedName, String url,
                      long size, String contentType, String originalName) {}
}
