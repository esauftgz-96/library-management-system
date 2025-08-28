package com.fsd.lending;

import java.time.LocalDate;

//import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fsd.books.BookModel;
import com.fsd.users.UserModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="lending")
public class LendingModel {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="uid")
	private Long uid;
	
	@ManyToOne
	@JoinColumn(name="book_uid")
//	@JsonBackReference(value="book-lend")
	private BookModel book;
	
	@ManyToOne
	@JoinColumn(name="user_uid")
//	@JsonBackReference(value="user-lend")
	private UserModel user;
	
	@Column(name="borrow_date")
	@NotNull
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate borrowDate;
	
	@Column(name="return_date", nullable=true)
	private LocalDate returnDate;
	
	@Column(name="renewal_count")
	@NotNull
	private int renewalCount;

	public LendingModel(BookModel book, UserModel user, @NotNull LocalDate borrowDate, @NotNull LocalDate returnDate) {
		super();
		this.book = book;
		this.user = user;
		this.borrowDate = borrowDate;
		this.returnDate = returnDate;
		this.renewalCount = 0;
	}

	public LendingModel() {
		super();
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public BookModel getBook() {
		return book;
	}

	public void setBook(BookModel book) {
		this.book = book;
	}

	public UserModel getUser() {
		return user;
	}

	public void setUser(UserModel user) {
		this.user = user;
	}

	public LocalDate getBorrowDate() {
		return borrowDate;
	}

	public void setBorrowDate(LocalDate borrowDate) {
		this.borrowDate = borrowDate;
	}

	public LocalDate getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(LocalDate returnDate) {
		this.returnDate = returnDate;
	}

	public int getRenewalCount() {
		return renewalCount;
	}

	public void setRenewalCount(int renewalCount) {
		this.renewalCount = renewalCount;
	}
	
	
}
