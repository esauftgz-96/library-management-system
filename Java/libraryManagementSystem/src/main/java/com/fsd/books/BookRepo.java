package com.fsd.books;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepo extends JpaRepository<BookModel, Long>{

	@Query("""
		SELECT b from BookModel b
		WHERE (:title = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')))
		AND (:author = '' OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%')))
		AND (:category = '' OR LOWER(b.category) LIKE LOWER(CONCAT('%', :category, '%')))
			""")
	public List<BookModel> getFilteredBooks (@Param("title") String title, @Param("author") String author, @Param("category") String category);
//	@Param ties "title" to :title in query
}
