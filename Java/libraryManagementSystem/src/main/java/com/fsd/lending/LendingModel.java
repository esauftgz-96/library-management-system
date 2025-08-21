package com.fsd.lending;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
	@JsonIgnoreProperties("lends")
	private BookModel book;
	
	@ManyToOne
	@JoinColumn(name="user_uid")
	@JsonIgnoreProperties("lends")
	private UserModel user;
	
	@Column(name="borrow_date")
	@NotNull
	private LocalDate borrowDate;
	
	@Column(name="return_date")
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
}
