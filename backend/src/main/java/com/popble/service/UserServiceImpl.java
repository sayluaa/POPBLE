package com.popble.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.popble.domain.Role;
import com.popble.domain.UserProfile;
import com.popble.domain.Users;
import com.popble.dto.UserDTO;
import com.popble.repository.BookmarkRepository;
import com.popble.repository.ReservationRepository;
import com.popble.repository.UserProfileRepository;
import com.popble.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {

	private final UserProfileRepository userProfileRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder encoder;
	private final ReservationRepository reservationRepository;
	private final BookmarkRepository bookmarkRepository;


    @Override
    @Transactional
	public UserDTO create(UserDTO userDTO) {

		log.info("------백앤드 객채 생성----------------------------");
		Users users = Users.builder().name(userDTO.getName()).loginId(userDTO.getLoginId())
				.password(encoder.encode(userDTO.getPassword())).email(userDTO.getEmail())
				.phonenumber(userDTO.getPhonenumber()).role(Role.MEMBER)

				.build();

		Users savedUser = userRepository.save(users);
		
		//UserProfile 닉네임은 랜덤으로
		UserProfile userProfile = new UserProfile();
		userProfile.setNickname("user_"+ UUID.randomUUID().toString().substring(0,6));
		userProfile.setUsers(savedUser);
		savedUser.setUserProfile(userProfile);
		userRepository.save(savedUser);
		

		return userDTO;

	}

	// 회원 삭제
	// 각각 연결때문에 안지워짐
	@Transactional
	public void deleteUser(Long id) {

		Users user = userRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("해당 userId의 유저가 존재하지 않습니다. userId:" + id));
		UserProfile profile = user.getUserProfile();
		if (user.getUserProfile() != null) {
			bookmarkRepository.deleteByUserProfile(profile);
			userProfileRepository.delete(profile);
			user.setUserProfile(null);
		}

		userRepository.delete(user);

	}


    // 모든 유저목록 불러오기
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }

    // id로 유저 조회
    public UserDTO getUserById(Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("해당 userId의 유저가 존재하지 않습니다. userId:" + id));
        return entityToDTO(user);
    }

    // 유저 정보 수정
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        Users user = userRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("해당 userId의 유저가 존재하지 않습니다. userId:" + id));

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPhonenumber(userDTO.getPhonenumber());
        user.setSocial(userDTO.isSocial());

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(userDTO.getPassword()));
        }

        Users updateUser = userRepository.save(user);
        return entityToDTO(updateUser);
    }


    // 엔티티 -> DTO 변환
    private UserDTO entityToDTO(Users user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setLoginId(user.getLoginId());
        dto.setPassword(user.getPassword());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhonenumber(formatPhoneNumber(user.getPhonenumber()));
        dto.setSocial(user.isSocial());
        dto.setRoleNames(List.of(user.getRole().name()));
        return dto;
    }

    // 핸드폰번호 자동 포맷팅
    private String formatPhoneNumber(String number) {
        if (number == null) return null;
        number = number.replaceAll("\\D", "");
        if (number.length() == 11) {
            return number.substring(0, 3) + "-"
                    + number.substring(3, 7) + "-"
                    + number.substring(7);
        } else if (number.length() == 10) {
            return number.substring(0, 3) + "-"
                    + number.substring(3, 6) + "-"
                    + number.substring(6);
        }
        return number;
    }

}
