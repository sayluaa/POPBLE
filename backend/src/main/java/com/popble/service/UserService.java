package com.popble.service;

import java.util.List;

import com.popble.dto.UserDTO;

public interface UserService {

	UserDTO create(UserDTO userDTO);
	
	UserDTO getUserById(Long id);
	
	List<UserDTO> getAllUsers();
	
	UserDTO updateUser(Long id, UserDTO userDTO);
	
	void deleteUser(Long id);

}
