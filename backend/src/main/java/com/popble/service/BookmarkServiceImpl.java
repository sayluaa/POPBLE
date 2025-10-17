package com.popble.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.popble.domain.Bookmark;
import com.popble.domain.Image;
import com.popble.domain.PopupStore;
import com.popble.domain.UserProfile;
import com.popble.dto.BookmarkDTO;
import com.popble.repository.BookmarkRepository;
import com.popble.repository.PopupStoreRepository;
import com.popble.repository.UserProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class BookmarkServiceImpl implements BookmarkService {


	private final BookmarkRepository bookmarkRepository;
	private final UserProfileRepository userProfileRepository;
	private final PopupStoreRepository popupStoreRepository;

	
	//북마크 추가
	public boolean addBookmark(Long userId, Long popupId) {
		
		UserProfile user = userProfileRepository.findById(userId)
												.orElseThrow(()-> new IllegalArgumentException("해당 userId의 유저가 존재하지 않습니다. userId:" + userId));
		
		PopupStore popup = popupStoreRepository.findById(popupId)
												.orElseThrow(()-> new IllegalArgumentException("해당 popupId의 팝업이 존재하지 않습니다. popupId:" + popupId));
		
		if(bookmarkRepository.findByUserProfileAndPopupStore(user,popup).isEmpty()) {
			Bookmark bookmark = new Bookmark();
			bookmark.setUserProfile(user);
			bookmark.setPopupStore(popup);
			bookmark.setCreateDate(LocalDateTime.now());
			bookmarkRepository.save(bookmark);
			
			//클릭하면 북마크 수 증가
			popup.setBookmarkCount(popup.getBookmarkCount() + 1);
			popupStoreRepository.save(popup);
			
			return true;
		}
		
		return false;
	}
	
	//북마크 삭제
	public boolean deleteBookmark(Long userId, Long popupId) {
		UserProfile user = userProfileRepository.findById(userId)
							.orElseThrow(()-> new IllegalArgumentException("해당 userId의 유저가 존재하지 않습니다. userId:" + userId));
		
		PopupStore popup = popupStoreRepository.findById(popupId)
							.orElseThrow(()-> new IllegalArgumentException("해당 popupId의 팝업이 존재하지 않습니다. popupId:" + popupId));
		
		Optional<Bookmark> bm = bookmarkRepository.findByUserProfileAndPopupStore(user, popup);
		
		if(bm.isPresent()) {
			Bookmark bookmark = bm.get();
			bookmarkRepository.delete(bookmark);
			//북마크 수 감소
			popup.setBookmarkCount(popup.getBookmarkCount()-1);
			
			return true;
		}
		
		return false;
	}
	
	@Transactional(readOnly = true)
	public Page<BookmarkDTO> bookmarkList(Long userId, Pageable pageable){
		UserProfile user = userProfileRepository.findById(userId).orElseThrow();
		
		Page<Bookmark> bookmarks = bookmarkRepository.findByUserProfileOrderByCreateDateDesc(user, pageable);
		
		return bookmarks.map(bookmark -> {
			PopupStore popupStore = bookmark.getPopupStore();

			BookmarkDTO dto =  BookmarkDTO.builder()
								.popupId(popupStore.getId())
								.storeName(popupStore.getStoreName())
								.address(popupStore.getAddress())
								.startDate(popupStore.getStartDate())
								.endDate(popupStore.getEndDate())
								.bookmarkCount(popupStore.getBookmarkCount())
								.status(popupStore.getStatus())
								.build();

			
			List<String> fileUrls = popupStore.getImageList().stream()
                    .map(image -> {
                        if (image.getUrl() != null && !image.getUrl().isBlank()) {
                            return image.getUrl(); // DB에 직접 저장된 URL
                        }
                        String folder = (image.getFolder() == null) ? "" : image.getFolder().replace("\\", "/");
                        if (!folder.isEmpty() && !folder.endsWith("/")) {
                            folder += "/";
                        }
                        return "/files/" + folder + image.getStoredName();
                    }).toList();
			
			 List<String> nasUrls = popupStore.getImages().stream()
				        .sorted(Comparator.comparingInt(img -> img.getImageTypeCode()))
				        .map(Image::getFileName) // NAS 이미지용 전체 URL
				        .toList();

				    if (!nasUrls.isEmpty()) {
				        dto.setUploadFileNames(nasUrls);  // BookmarkDTO에 세팅
				    }
			
			return dto;
		});
	}

	//북마크 여부
	public boolean isBookmark(Long userId, Long popupId) {

		UserProfile user = userProfileRepository.findById(userId)
							.orElseThrow(()-> new IllegalArgumentException("해당 userId의 유저가 존재하지 않습니다. userId:" + userId));

		PopupStore popupStore = popupStoreRepository.findById(popupId)
								.orElseThrow(()-> new IllegalArgumentException("해당 popupId의 팝업이 존재하지 않습니다. popupId:" + popupId));

		return bookmarkRepository.existsByUserProfileAndPopupStore(user, popupStore);
	}
 
}
