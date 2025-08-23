package com.fsd.lending;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsd.users.UserModel;

public interface LendingRepo extends JpaRepository<LendingModel, Long>{

	List<LendingModel> findByUser(UserModel user);

	List<LendingModel> findByUser_Id(Long userId);

}
