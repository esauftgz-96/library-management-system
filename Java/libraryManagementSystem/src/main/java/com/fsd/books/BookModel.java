package com.fsd.books;

import java.util.ArrayList;
import java.util.List;

import com.fsd.lending.LendingModel;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="books")
public class BookModel {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="uid")
	private Long uid;
	
	@Column(name="isbn", unique=true)
	@NotNull
	private String isbn;
	
	@Column(name="title")
	@NotNull
	private String title;
	
	@Column(name="publication_year")
	@NotNull
	private int publicationYear;
	
	@Column(name="author")
	@NotNull
	private String author;
	
	@Column(name="category")
	@NotNull
	private String category; 
	
	@Column(name="physical_section")
	@NotNull
	private String physicalSection;
	
	@Column(name="copies_available")
	@NotNull
	private int copiesAvailable;
	
	@Column(name="copies_reserved")
	@NotNull
	private int copiesReserved;
	
	@Column(name="copies_lent")
	@NotNull
	private int copiesLent;

	public BookModel(@NotNull String isbn, @NotNull String title, @NotNull int publicationYear,
			@NotNull String author, @NotNull String category, @NotNull String physicalSection,
			@NotNull int copiesAvailable, @NotNull int copiesReserved) {
		super();
		this.isbn = isbn;
		this.title = title;
		this.publicationYear = publicationYear;
		this.author = author;
		this.category = category;
		this.physicalSection = physicalSection;
		this.copiesAvailable = copiesAvailable;
		this.copiesReserved = copiesReserved;
		this.copiesLent = 0;
	}

	public BookModel() {
		super();
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public int getPublicationYear() {
		return publicationYear;
	}

	public void setPublicationYear(int publicationYear) {
		this.publicationYear = publicationYear;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getPhysicalSection() {
		return physicalSection;
	}

	public void setPhysicalSection(String physicalSection) {
		this.physicalSection = physicalSection;
	}

	public int getCopiesAvailable() {
		return copiesAvailable;
	}

	public void setCopiesAvailable(int copiesAvailable) {
		this.copiesAvailable = copiesAvailable;
	}

	public int getCopiesReserved() {
		return copiesReserved;
	}

	public void setCopiesReserved(int copiesReserved) {
		this.copiesReserved = copiesReserved;
	}

	public int getCopiesLent() {
		return copiesLent;
	}

	public void setCopiesLent(int copiesLent) {
		this.copiesLent = copiesLent;
	}
	
	@OneToMany (mappedBy="book",cascade=CascadeType.ALL)
	private List<LendingModel> lends = new ArrayList<>();

	public List<LendingModel> getLends() {
		return lends;
	}

	public void setLends(List<LendingModel> lends) {
		this.lends = lends;
	}
}
