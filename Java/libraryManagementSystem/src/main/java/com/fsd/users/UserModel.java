package com.fsd.users;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
//import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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
@Table(name="users")
public class UserModel {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="uid")
	private Long uid;
	
	@Column(name="name")
	@NotNull
	private String name;
	
	@Column(name="birthday")
	@NotNull
	private LocalDate birthday;
	
	@Column(name="address")
	@NotNull
	private String address;
	
	@Column(name="email", unique=true)
	@NotNull
	private String email;
	
	@Column(name="contact_number")
	@NotNull
	private String contactNumber;
	
	@Column(name="password_hashed")
	@NotNull
	private String passwordHashed;
	
	@Column(name="is_admin")
	@NotNull
	@JsonProperty("isAdmin")
	private boolean isAdmin;
	
	@Column(name="books_lent")
	@NotNull
	private int booksLent;
	
	@Column(name="last_registered",nullable=true)
	private LocalDate lastRegistered;

	public UserModel(@NotNull String name, @NotNull LocalDate birthday, @NotNull String address,
			@NotNull String email, @NotNull String contactNumber, @NotNull String passwordHashed,
			@NotNull int booksLent) {
		super();
		this.name = name;
		this.birthday = birthday;
		this.address = address;
		this.email = email;
		this.contactNumber = contactNumber;
		this.passwordHashed = passwordHashed;
		this.isAdmin = false;
		this.booksLent = booksLent;
		this.lastRegistered = null;
	}

	public UserModel() {
		super();
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public LocalDate getBirthday() {
		return birthday;
	}

	public void setBirthday(LocalDate birthday) {
		this.birthday = birthday;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getPasswordHashed() {
		return passwordHashed;
	}

	public void setPasswordHashed(String passwordHashed) {
		this.passwordHashed = passwordHashed;
	}

	public boolean isAdmin() {
		return isAdmin;
	}

	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public int getBooksLent() {
		return booksLent;
	}

	public void setBooksLent(int booksLent) {
		this.booksLent = booksLent;
	}

	public LocalDate getLastRegistered() {
		return lastRegistered;
	}

	public void setLastRegistered(LocalDate lastRegistered) {
		this.lastRegistered = lastRegistered;
	}
	
	@OneToMany (mappedBy="user",cascade=CascadeType.ALL)
//	@JsonManagedReference(value="user-lend")
	@JsonIgnore
	private List<LendingModel> lends = new ArrayList<>();

	public List<LendingModel> getLends() {
		return lends;
	}

	public void setLends(List<LendingModel> lends) {
		this.lends = lends;
	}
}
