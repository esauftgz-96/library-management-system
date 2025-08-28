package com.fsd.users;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
	@Autowired
	private UserRepo userRepo;
	
	//Create new user
	public UserModel createUser (UserModel user) {
		return userRepo.save(user);
	}
	
	//Find all user
	public List<UserModel> getAllUsers () {
		return userRepo.findAll();
	}
	
	//Find user by name (partial match cap insensitive)
	public List<UserModel> getAllUsersByName (String partialString) {
		return userRepo.findByNameContainingIgnoreCase(partialString);
	}
	
	//Find user by id
	public Optional<UserModel> getUserById (Long uid) {
		return userRepo.findById(uid);
	}
	
	//Find user by exact email
	public Optional<UserModel> getUserByEmail (String email) {
		return userRepo.findByEmail(email.toLowerCase());
	}
	
	//Update user
	//Front end will need to retrieve with getUser, then amend
	public UserModel updateUser (UserModel user) {
		return userRepo.save(user);
	}
	
	//Delete user
	public void deleteUser (Long uid) {
		userRepo.deleteById(uid);
	}

	//find user by filters
	public List<UserModel> getFilteredUsers(int uid, String name, String email, int overdueCount, int maxLoanPeriod) {
		return userRepo.getFilteredUsers(uid,name,email,overdueCount,maxLoanPeriod);
	}
}
