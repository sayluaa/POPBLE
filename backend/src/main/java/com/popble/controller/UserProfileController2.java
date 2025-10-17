package com.popble.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.popble.domain.Users;
import com.popble.dto.ReservationReactDTO;
import com.popble.dto.UserProfileDTO;
import com.popble.repository.UserProfileRepository;
import com.popble.repository.UserRepository;
import com.popble.service.ReservationService;
import com.popble.service.UserProfileService;
//import com.popble.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/userProfile")
public class UserProfileController2 {
	
	private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository; 
    private final ReservationService reservationService; 
    private final UserProfileService userProfileService; 

	//유저프로필조회
	@GetMapping("/{id}")

    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable("id") Long id) {
        return userProfileRepository.findById(id)
                .map(user -> UserProfileDTO.builder()
                        .id(user.getId())
                        .nickname(user.getNickname())
                        .profileImg(user.getProfileImg())
                        .build())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
   
   
   //프로필로 예약내역조회
   @GetMapping("/{id}/reservations")
   public List<ReservationReactDTO> getReservationsByUserProfile(@PathVariable("id") Long id){
      return reservationService.getByUserProfile(id);
   }
   
   
   
   //유저프로필 만들기(+이미지사진)
   @PostMapping(value="/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<UserProfileDTO> createUserProfile(
         @RequestParam("userId")Long userId,
         @RequestParam("nickname")String nickname,
         @RequestParam(value="profileImg", required = false)MultipartFile profileImg) 
               throws IOException{

      Users user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid userId"));
      
      UserProfileDTO response = userProfileService.createUserProfile(user ,nickname, profileImg);
      
      return ResponseEntity.ok(response);
   }            
   
   //프로필 수정
   @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<UserProfileDTO> updateUserProfile(
         @PathVariable("id") Long userId,
         @RequestParam(name = "nickname") String nickname,
         @RequestParam(value = "profileImg", required = false)MultipartFile profileImg){
      UserProfileDTO updatedProfile = userProfileService.updateUserProfile(userId,nickname,profileImg);
      
      return ResponseEntity.ok(updatedProfile);
   }
   
   //UserRepository로 아이디 조회해서 profile가져오기
   @Transactional(readOnly = true)
   @GetMapping("edit/{userId}")
   public ResponseEntity<UserProfileDTO> getUserProfileByUserId(@PathVariable(name = "userId") Long userId){
      return userRepository.findById(userId)
            .map(user -> user.getUserProfile())
            .map(userProfile -> UserProfileDTO.builder().id(userProfile.getId()).nickname(userProfile.getNickname()).profileImg(userProfile.getProfileImg()).build())
            .map(userProfileDTO -> ResponseEntity.ok(userProfileDTO))
            .orElse(ResponseEntity.notFound().build());
   }
   
   //예약시 프로필 수정
   @PatchMapping("/reservation/{id}")
   public ResponseEntity<UserProfileDTO> updateReservationUserProfile(
           @PathVariable("id") Long userProfileId, 
           @RequestParam(name = "name", required = false) String name,
           @RequestParam(name = "phonenumber", required = false) String phonenumber) {


       UserProfileDTO requestDto = UserProfileDTO.builder()
               .name(name)
               .phonenumber(phonenumber)
               .build();

       UserProfileDTO updatedProfile = userProfileService.updateUserProfile(
           userProfileId, requestDto
       );
       
       return ResponseEntity.ok(updatedProfile);
   }

}

