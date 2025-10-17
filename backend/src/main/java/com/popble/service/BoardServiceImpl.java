package com.popble.service;

import com.popble.domain.*;
import com.popble.dto.*;
import com.popble.repository.BoardImageRepository;
import com.popble.repository.BoardRepository;
import com.popble.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final UserProfileRepository userProfileRepository;
    private final BoardImageRepository boardImageRepository;
    private final FileStorageService fileStorageService;

    // ==========================
    // 정렬 유틸
    // ==========================
    private Sort resolveSort(String order) {
        if (order == null) order = "date";
        String key = order.trim().toLowerCase();

        return switch (key) {
            case "oldest", "asc", "과거순" ->
                    Sort.by(Sort.Order.asc("createTime"), Sort.Order.asc("id"));
            case "view", "views", "조회수" ->
                    Sort.by(Sort.Order.desc("view"), Sort.Order.desc("id"));
            case "rec", "recommend", "추천" ->
                    Sort.by(Sort.Order.desc("recommend"), Sort.Order.desc("id"));
            case "latest", "date", "time", "일자", "날짜", "created" ->
                    Sort.by(Sort.Order.desc("createTime"), Sort.Order.desc("id"));
            default ->
                    Sort.by(Sort.Order.desc("createTime"), Sort.Order.desc("id"));
        };
    }

    // ==========================
    // 생성
    // ==========================
    @Override
    public Long create(BoardCreateRequest req) {
        if (req.getType() == null) throw new IllegalArgumentException("type is required");
        if (req.getTitle() == null || req.getTitle().isBlank())
            throw new IllegalArgumentException("title is required");
        if (req.getContent() == null || req.getContent().isBlank())
            throw new IllegalArgumentException("content is required");

        Board entity = switch (req.getType()) {
            case GENERAL -> new GeneralBoard();
            case QNA -> new QnaBoard();
            case NOTICE -> new NoticeBoard();
            case AD -> new AdBoard();
        };

        UserProfile profile = null;
        if (req.getWriterId() != null) {
            profile = userProfileRepository.findById(req.getWriterId()).orElse(null);
        }
        entity.setUserProfile(profile);

        entity.setType(req.getType());
        entity.setTitle(req.getTitle());
        entity.setContent(req.getContent());
        entity.setWriter(req.getWriterId() != null ? String.valueOf(req.getWriterId()) : "anonymous");

        return boardRepository.save(entity).getId();
    }

    @Override
    public Long create(BoardCreateRequest req, List<MultipartFile> images) {
        Long id = create(req);
        if (images == null || images.isEmpty()) return id;
        Board board = boardRepository.getReferenceById(id);
        saveImages(board, images);
        return id;
    }

    // ==========================
    // 조회 / 목록
    // ==========================
    @Override
    @Transactional(readOnly = true)
    public BoardResponse get(Long id) {
        Board e = boardRepository.findWithImagesById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + id));
        return toResponse(e);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<BoardResponse> listByType(Board.Type type, PageRequestDTO pageRequestDTO, String order) {
        Sort sort = resolveSort(order);
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(), sort);

        Page<Board> result = boardRepository.findByType(type, pageable);

        List<BoardResponse> dtoList = result.getContent()
                .stream()
                .map(this::toResponse)
                .toList();

        return PageResponseDTO.<BoardResponse>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(result.getTotalElements())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<BoardResponse> listAll(PageRequestDTO pageRequestDTO, String order) {
        Sort sort = resolveSort(order);
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(), sort);

        var now = java.time.LocalDateTime.now();

        // 📌 고정 공지글
        Sort pinnedSort = Sort.by(Sort.Order.desc("pinnedAt"), Sort.Order.desc("createTime"), Sort.Order.desc("id"));
        var pinned = boardRepository.findPinnedNotices(now, pinnedSort)
                .stream().map(this::toResponse).toList();

        // 📌 AD 제외 일반글 (페이징)
        Page<Board> restPage = boardRepository.findByTypeNot(Board.Type.AD, pageable);
        Page<BoardResponse> mappedPage = restPage.map(this::toResponse);

        var dtoList = new ArrayList<BoardResponse>();
        if (pageRequestDTO.getPage() == 1) {
            dtoList.addAll(pinned);
        }
        dtoList.addAll(mappedPage.getContent());

        long totalCount = mappedPage.getTotalElements();

        return PageResponseDTO.<BoardResponse>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    // ==========================
    // 수정
    // ==========================
    @Override
    public void update(Long id, BoardUpdateRequest req) {
        Board e = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + id));

        if (req.getTitle() != null) e.setTitle(req.getTitle());
        if (req.getContent() != null) e.setContent(req.getContent());
        if (req.getType() != null) e.setType(req.getType());
    }

    @Override
    public void updateImages(Long id, List<Long> keepIds, List<MultipartFile> newImages) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + id));

        if (board.getImages() != null) {
            var snapshot = new ArrayList<>(board.getImages());
            for (BoardImage img : snapshot) {
                boolean keep = (keepIds != null && keepIds.contains(img.getId()));
                if (!keep) {
                    fileStorageService.delete(img.getFolder(), img.getStoredName());
                    board.removeImage(img);
                    boardImageRepository.delete(img);
                }
            }
        }

        if (newImages != null && !newImages.isEmpty()) {
            saveImages(board, newImages);
        }
    }

    // ==========================
    // 공지 고정
    // ==========================
    @Override
    public void setPinned(Long id, boolean pinned, java.time.LocalDateTime pinUntil) {
        Board e = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + id));

        if (e.getType() != Board.Type.NOTICE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only NOTICE can be pinned globally");
        }

        if (e instanceof NoticeBoard nb) {
            nb.setPin(pinned);
        }

        e.setPinnedGlobal(pinned);
        if (pinned) {
            e.setPinnedAt(java.time.LocalDateTime.now());
            e.setPinUntil(pinUntil);
        } else {
            e.setPinUntil(null);
            e.setPinnedAt(null);
        }
    }

    // ==========================
    // 삭제
    // ==========================
    @Override
    public void delete(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + id));

        if (board.getImages() != null) {
            for (BoardImage img : new ArrayList<>(board.getImages())) {
                fileStorageService.delete(img.getFolder(), img.getStoredName());
                board.removeImage(img);
                boardImageRepository.delete(img);
            }
        }
        boardRepository.delete(board);
    }

    // ==========================
    // 매핑
    // ==========================
    private BoardResponse toResponse(Board e) {
        Long writerId = null;
        if (e.getUserProfile() != null) {
            writerId = e.getUserProfile().getId();
        } else if (e.getWriter() != null) {
            try {
                writerId = Long.valueOf(e.getWriter());
            } catch (NumberFormatException ignore) {}
        }

        List<BoardResponse.ImageDto> imageDtos =
                (e.getImages() == null) ? List.of()
                        : e.getImages().stream()
                        .sorted(java.util.Comparator.comparing(
                                BoardImage::getSortOrder,
                                java.util.Comparator.nullsLast(Integer::compareTo)))
                        .map(img -> new BoardResponse.ImageDto(
                                img.getId(),
                                publicUrl(img),
                                img.getSortOrder()))
                        .toList();

        return BoardResponse.builder()
                .id(e.getId())
                .type(e.getType())
                .title(e.getTitle())
                .content(e.getContent())
                .writerId(writerId)
                .createTime(e.getCreateTime())
                .modifyTime(e.getModifyTime())
                .pinnedGlobal(e.isPinnedGlobal())
                .pinUntil(e.getPinUntil())
                .pinnedAt(e.getPinnedAt())
                .images(imageDtos)
                .build();
    }

    private String publicUrl(BoardImage img) {
        if (img.getUrl() != null && !img.getUrl().isBlank()) {
            return img.getUrl();
        }
        String folder = (img.getFolder() == null) ? "" : img.getFolder().replace("\\", "/");
        if (!folder.isEmpty() && !folder.endsWith("/")) {
            folder = folder + "/";
        }
        return "/files/" + folder + img.getStoredName();
    }

    private void saveImages(Board board, List<MultipartFile> images) {
        int order = (board.getImages() == null) ? 0 : board.getImages().size();

        for (MultipartFile file : images) {
            if (file == null || file.isEmpty()) continue;

            var sf = fileStorageService.store(file);
            BoardImage img = BoardImage.builder()
                    .originalName(sf.originalName())
                    .storedName(sf.storedName())
                    .folder(sf.folder())
                    .url(sf.url())
                    .contentType(sf.contentType())
                    .size(sf.size())
                    .sortOrder(order++)
                    .build();

            board.addImage(img);
            boardImageRepository.save(img);
        }
    }
}