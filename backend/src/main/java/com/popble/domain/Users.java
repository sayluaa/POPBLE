package com.popble.domain;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class Users{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "login_id", nullable = false)
    private String loginId;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "social", nullable = false)
    private boolean social;

    @Column(name = "phonenumber", nullable = false)
    private String phonenumber;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<Role> userRoleList = new ArrayList<>();
    
    
    public void addRole (Role role) {
    	userRoleList.add(role);
    }
    
    public void clearRole() {
    	userRoleList.clear();
    }
    
    public void changeName(String name) {
    	this.name = name;
    }
    
    public void changePw(String password) {
    	this.password = password;
    }
    
    public void changeSocial(Boolean social) {
    	this.social = social;
    }
    //UserProfile과 관계 mapping
    @OneToOne(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private UserProfile userProfile;
    
}
