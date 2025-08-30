package com.fsd.books;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/book")
public class BookCtrler {
	@Autowired
	private BookService bookService;
	
	@PostMapping("/new")
	public BookModel createBook (@RequestBody BookModel book) {
		return bookService.createBook(book);
	}
	
	@GetMapping("/all")
	public List<BookModel> getAllBooks () {
		return bookService.getAllBooks();
	}
	
	@GetMapping("/filter")
	public List<BookModel> getFilteredBooks (
			@RequestParam(defaultValue="") String title,
			@RequestParam(defaultValue="") String author,
			@RequestParam(defaultValue="") String category) {
		return bookService.getFilteredBooks(title,author,category);
	}
	
	@GetMapping("/id/{uid}")
	public Optional<BookModel> getBookById (@PathVariable Long uid) {
		return bookService.getBookById(uid);
	}
	
	@PutMapping("/update")
	public BookModel updateBook (@RequestBody BookModel book) {
		return bookService.updateBook(book);
	}
	
	@DeleteMapping("/delete/{uid}")
	public void deleteBook (@PathVariable Long uid) {
		bookService.deleteBook(uid);
	}
}
