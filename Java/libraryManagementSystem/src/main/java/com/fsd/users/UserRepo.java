package com.fsd.users;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<UserModel, Long>{

	List<UserModel> findByNameContainingIgnoreCase(String partialString);

	Optional<UserModel> findByEmail(String lowerCase);

}
