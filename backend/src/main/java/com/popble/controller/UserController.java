package com.popble.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popble.dto.UserDTO;
import com.popble.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Log4j2
public class UserController {

private final UserService userService;
		
	
	@PostMapping("/signup")
	public UserDTO userCreate(@RequestBody UserDTO userDTO) {
		  log.info("회원가입 요청 DTO: {}", userDTO);
		log.info("-----------Service creaete-------------------------");
		return userService.create(userDTO);
	}
	
	//회원정보조회(id)
	@GetMapping("/{id}")
	public ResponseEntity<UserDTO> getUser(@PathVariable(name = "id") Long id){
		return ResponseEntity.ok(userService.getUserById(id));
	}
	
	//전체회원조회
	@GetMapping("/list")
	public ResponseEntity<List<UserDTO>> getAllUsers(){
		return ResponseEntity.ok(userService.getAllUsers());
	}
	
	//회원정보수정
	@PutMapping("/{id}")
	public ResponseEntity<UserDTO> updateUser(@PathVariable(name = "id") Long id, @RequestBody UserDTO userDTO){
		return ResponseEntity.ok(userService.updateUser(id, userDTO));
	}
	
	//회원탈퇴
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable(name = "id") Long id){
		userService.deleteUser(id);
		return ResponseEntity.ok("회원탈퇴 완료");
	}
}
