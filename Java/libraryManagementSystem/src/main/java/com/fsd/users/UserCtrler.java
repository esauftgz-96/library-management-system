package com.fsd.users;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserCtrler {
	@Autowired
	private UserService userService;
	
	// remember, you can and should use
	// public ResponseEntity<UserModel>
	// ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized") if fail
	// ResponseEntity.ok(UserModel)

	@PostMapping("/new")
	public UserModel createUser (@RequestBody UserModel user) {
		return userService.createUser(user);
	}
	
	@GetMapping("/all")
	public List<UserModel> getAllUsers () {
		return userService.getAllUsers();
	}
	
	@GetMapping("/name/{partialString}")
	public List<UserModel> getAllUsersByName (@PathVariable String partialString) {
		return userService.getAllUsersByName(partialString);
	}
	
	@GetMapping("/id/{uid}")
	public Optional<UserModel> getUserById (@PathVariable Long uid) {
		return userService.getUserById(uid);
	}
	
	@GetMapping("/email/{email}")
	public Optional<UserModel> getUserByEmail (@PathVariable String email) {
		return userService.getUserByEmail(email.toLowerCase());
	}
	
	@PutMapping("/update")
	public UserModel updateUser (@RequestBody UserModel user) {
		return userService.updateUser(user);
	}
	
	@DeleteMapping("/delete/{uid}")
	public void deleteUser (@PathVariable Long uid) {
		userService.deleteUser(uid);
	}
}
