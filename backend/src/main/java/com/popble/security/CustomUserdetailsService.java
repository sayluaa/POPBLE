package com.popble.security;

import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.popble.domain.Users;
import com.popble.dto.UserDTO;
import com.popble.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserdetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("--------------------------------------------------------------");

        Users users = userRepository.getwithRoles(username);

        if (users == null) {
            throw new UsernameNotFoundException("NOT FOUND");
        }

        UserDTO userDTO = new UserDTO(
            users.getLoginId(),
            users.getPassword(),
            users.getName(),
            users.isSocial(),
            users.getEmail(),
            users.getPhonenumber(),
            users.getUserRoleList()
                .stream()
                .map(usersRole -> usersRole.name())
                .collect(Collectors.toList())
        );

        // ✅ UserDTO에 id 세팅 (main에서만 있었던 부분)
        userDTO.setId(users.getId());

        log.info(userDTO);

        return userDTO;
    }
}
