package com.fsd.lending;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fsd.users.UserModel;

@Service
public class LendingService {
	@Autowired
	private LendingRepo lendingRepo;
	
	//Create new lending
	public LendingModel createLending (LendingModel lending) {
		return lendingRepo.save(lending);
	}
	
	//Find all lending
	public List<LendingModel> getAllLendings () {
		return lendingRepo.findAll();
	}
	
	//Find lending by User
	public List<LendingModel> getAllLendingsByUser (UserModel user) {
		return lendingRepo.findByUser(user);
	}
	
	//Find lending by id
	public Optional<LendingModel> getLendingById (Long uid) {
		return lendingRepo.findById(uid);
	}
	
	//Update lending
	//Front end will handle retrieve, amend fields, then update
	public LendingModel updateLending (LendingModel lending) {
		return lendingRepo.save(lending);
	}
	
	//Delete lending
	//for future use, not planned for current feature suite
	public void deleteLending (Long uid) {
		lendingRepo.deleteById(uid);
	}
}
