package com.fsd.lending;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsd.users.UserModel;

@RestController
@RequestMapping("/api/lending")
@CrossOrigin(origins = "http://localhost:5173")
public class LendingCtrler {
	@Autowired
	private LendingService lendingService;
	
	@PostMapping("/new")
	public LendingModel createLending (@RequestBody LendingModel lending) {
		return lendingService.createLending(lending);
	}
	
	@GetMapping("/all")
	public List<LendingModel> getAllLendings () {
		return lendingService.getAllLendings();
	}
	
	@GetMapping("/user")
	public List<LendingModel> getAllLendingsByUser (@RequestBody UserModel user) {
		return lendingService.getAllLendingsByUser(user);
	}
	
	@GetMapping("/id/{uid}")
	public Optional<LendingModel> getLendingById (@PathVariable Long uid) {
		return lendingService.getLendingById(uid);
	}
	
	@GetMapping("/userid/{userId}")
	public List<LendingModel> getAllLendingsByUserId (@PathVariable Long userId) {
		return lendingService.getAllLendingsByUserId(userId);
	}
	
	@PutMapping("/update")
	public LendingModel updateLending (@RequestBody LendingModel lending) {
		return lendingService.updateLending(lending);
	}
	
	@DeleteMapping("/delete/{uid}")
	public void deleteLending (@PathVariable Long uid) {
		lendingService.deleteLending(uid);
	}
}
