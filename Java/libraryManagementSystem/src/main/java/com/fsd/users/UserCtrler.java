package com.fsd.users;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fsd.components.CheckEmailDTO;
import com.fsd.components.JwtUtil;
import com.fsd.components.LoginDTO;

@RestController
@RequestMapping("/api/user")
public class UserCtrler {
	@Autowired
	private UserService userService;
	
	//jwtUtil injection
	@Autowired
    private JwtUtil jwtUtil;
	
	// remember, you can and should use
	// public ResponseEntity<UserModel>
	// ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized") if fail
	// ResponseEntity.ok(UserModel)
	
	//use post mapping to pass in requestBody
	@PostMapping("/login")
	public ResponseEntity<?>  loginUser (@RequestBody LoginDTO loginDTO) {
		Optional<UserModel> userOpt = userService.authenticateUser(loginDTO.getEmail(), loginDTO.getPassword());
		if (userOpt.isPresent()) {
			String token = jwtUtil.generateToken(loginDTO.getEmail());
			return ResponseEntity.ok().body(Map.of("token",token,"user",userOpt.get()));
		} else {
			return ResponseEntity.status(401).body(null);
		}
	}

	@PostMapping("/new")
	public UserModel createUser (@RequestBody UserModel user) {
		return userService.createUser(user);
	}
	
	@PostMapping("/checkemail")
	public boolean checkEmail (@RequestBody CheckEmailDTO emailDTO) {
		return userService.checkEmail(emailDTO.getEmail());
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
	
	@GetMapping("/filter")
	public List<UserModel> getFilteredUsers (
			@RequestParam(required=false, defaultValue="-1") int uid,
			@RequestParam(required=false, defaultValue="") String name,
			@RequestParam(required=false, defaultValue="") String email,
			@RequestParam(required=false, defaultValue="-1") int overdueCount,
			@RequestParam(required=false, defaultValue="-1") int maxLoanPeriod) {
		return userService.getFilteredUsers(uid,name,email,overdueCount,maxLoanPeriod);
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
