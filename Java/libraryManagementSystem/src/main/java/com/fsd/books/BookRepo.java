package com.fsd.books;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepo extends JpaRepository<BookModel, Long>{

	List<BookModel> findByTitleContainingIgnoreCase(String partialString);

	List<BookModel> findByCategoryContainingIgnoreCase(String partialString);

}
