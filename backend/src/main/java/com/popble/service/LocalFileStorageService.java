package com.popble.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    // ✅ 업로드 경로 (application.yml 없으면 기본값 사용)
    // 절대경로 권장: 예) D:/popble-uploads
    @Value("${com.popble.upload.path:C:/popble-uploads}")
    private String uploadRoot;

    private Path rootPath;

    @PostConstruct
    void ensureRoot() {
        rootPath = Paths.get(uploadRoot).toAbsolutePath().normalize();
        try {
            Files.createDirectories(rootPath);
            System.out.println("[uploadRoot] " + rootPath);
        } catch (IOException e) {
            throw new IllegalStateException("업로드 루트 생성 실패: " + rootPath, e);
        }
    }

    @Override
    public StoredFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("빈 파일은 저장할 수 없습니다.");
        }
        try {
            String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String uuid = UUID.randomUUID().toString().replace("-", "");
            String storedName = (ext == null || ext.isBlank()) ? uuid : uuid + "." + ext;

            LocalDate today = LocalDate.now();
            String folder = today.getYear() + "/"
                    + String.format("%02d", today.getMonthValue()) + "/"
                    + String.format("%02d", today.getDayOfMonth());

            Path dir = rootPath.resolve(folder).normalize();
            Files.createDirectories(dir);

            Path target = dir.resolve(storedName).normalize();

            try (var in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }

            // ✅ 이 URL은 프론트엔드에서 접근 가능한 경로(/uploads/**)와 일치해야 함
            String url = "/uploads/" + folder + "/" + storedName;

            return new StoredFile(
                    folder,
                    storedName,
                    url,
                    file.getSize(),
                    file.getContentType(),
                    file.getOriginalFilename()
            );
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    @Override
    public void delete(String folder, String storedName) {
        if (folder == null || storedName == null) return;
        try {
            Path p = rootPath.resolve(folder).resolve(storedName).normalize();
            Files.deleteIfExists(p);
        } catch (IOException ignored) {}
    }
}
