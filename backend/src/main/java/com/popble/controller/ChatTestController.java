package com.popble.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class ChatTestController {

	@GetMapping("/test-room")
	public Map<String, Object> testRoom() {
		Map<String, Object> map = new HashMap<>();
	    map.put("roomId", 1);
	    map.put("userId", 999);
	    map.put("username", "Tester");
	    return map;
	}
}
