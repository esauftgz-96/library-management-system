package com.fsd.users;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepo extends JpaRepository<UserModel, Long>{

	List<UserModel> findByNameContainingIgnoreCase(String partialString);

	Optional<UserModel> findByEmail(String lowerCase);

	@Query(value = """
		    SELECT u.* FROM users u
		    WHERE (:uid = -1 OR u.uid = :uid)
		      AND (:name = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')))
		      AND (:email = '' OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))
		      AND (
		          :overdueCount = -1
		          OR (
		              SELECT COUNT(*) FROM lending l
		              WHERE l.user_uid = u.uid
		                AND l.return_date IS NULL
		                AND DATEDIFF(CURRENT_DATE, l.borrow_date) > :maxLoanPeriod
		          ) = :overdueCount
		      )
		""", nativeQuery = true)
	//	nativeQuery allows for native mySQL language
	public List<UserModel> getFilteredUsers (@Param("uid")int uid, @Param("name")String name, @Param("email")String email, @Param("overdueCount")int overdueCount, @Param("maxLoanPeriod")int maxLoanPeriod);

}
