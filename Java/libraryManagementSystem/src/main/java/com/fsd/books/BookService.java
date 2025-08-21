package com.fsd.books;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookService {
	@Autowired
	private BookRepo bookRepo;
	
	//Create new book
	public BookModel createBook (BookModel book) {
		return bookRepo.save(book);
	}
	
	//Find all books
	public List<BookModel> getAllBooks () {
		return bookRepo.findAll();
	}
	
	//Find books by title, category, and author
	public List<BookModel> getFilteredBooks(String title, String author, String category) {
		return bookRepo.getFilteredBooks(title,author,category);
	}
	
	//Find book by id
	public Optional<BookModel> getBookById (Long uid) {
		return bookRepo.findById(uid);
	}
	
	//Update Book
	//Front End will need to retrieve with getBook, then amend it
	public BookModel updateBook (BookModel book) {
		return bookRepo.save(book);
	}
	
	//Delete Book
	public void deleteBook (Long uid) {
		bookRepo.deleteById(uid);
	}
}
