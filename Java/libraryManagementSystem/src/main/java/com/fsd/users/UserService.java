package com.fsd.users;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class UserService {
	@Autowired
	private UserRepo userRepo;
	
	//Create new user
	public UserModel createUser (UserModel user) {
		//changes the raw password passed in to a bcrypted password
		//no changes needed for controller
		String hashedPassword = BCrypt.hashpw(user.getPasswordHashed(), BCrypt.gensalt());
		user.setPasswordHashed(hashedPassword);
		return userRepo.save(user);
	}
	
	//check email only
	public boolean checkEmail (String email) {
		Optional<UserModel> user = userRepo.findByEmail(email);
		if (user.isPresent()) {
			return true;
		} else {
			return false;
		}
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
		String pw = user.getPasswordHashed();
		if (pw.isEmpty()) {
			String hashedPassword = BCrypt.hashpw("", BCrypt.gensalt());
			user.setPasswordHashed(hashedPassword);
		} else if (!(pw.startsWith("$2a$") || pw.startsWith("$2b$") || pw.startsWith("$2y$")) || pw.length() != 60) {
			//check if password is already hashed
			String hashedPassword = BCrypt.hashpw(pw, BCrypt.gensalt());
			user.setPasswordHashed(hashedPassword);
		}
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
	
	//login user
	//Optional<?> only exists in Java Spring, when sent out via controller it becomes a JSON for axios to receive
	//Optiona.empty() is needed because it's being opened up, above doesnt need it because Optional is being passed along
	public Optional<UserModel> authenticateUser (String email, String password) {
		Optional<UserModel> user = userRepo.findByEmail(email);
		if (user.isPresent()) {
			//use .get() to retrieve data from Optional object
			UserModel foundUser = user.get();
			boolean passwordMatches = BCrypt.checkpw(password, foundUser.getPasswordHashed());
			if (passwordMatches) {
				return Optional.of(foundUser);
			} else {
				return Optional.empty();
			}
		}
		return Optional.empty();
	}
}
