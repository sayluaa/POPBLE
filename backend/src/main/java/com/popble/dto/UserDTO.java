package com.popble.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserDTO extends User {

    private Long id;

    @NotEmpty
    private String loginId;

    @NotEmpty
    private String password;

    @NotEmpty
    private String name;

    private boolean social;

    private String phonenumber;

    @NotEmpty
    @Pattern(regexp = "^(?:\\w+\\.?)*\\w+@(?:\\w+\\.)+\\w+$")
    private String email;

    private List<String> roleNames = new ArrayList<>();

    public UserDTO() {
        super("anonymos", "anoymous", new ArrayList<>());
    }

    public UserDTO(String loginId, String password, String name,
                   boolean social, String email, String phonenumber, List<String> rolenames) {
        super(
            loginId, password,
            rolenames.stream()
                .map(str -> new SimpleGrantedAuthority("ROLE_" + str))
                .collect(Collectors.toList())
        );
        this.loginId = loginId;
        this.password = password;
        this.name = name;
        this.social = social;
        this.roleNames = rolenames;
        this.email = email;
        this.phonenumber = phonenumber;
    }

    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("id", id);
        dataMap.put("loginId", loginId);
        dataMap.put("name", name);
        dataMap.put("social", social);
        dataMap.put("email", email);
        dataMap.put("roleNames", roleNames);
        dataMap.put("phonenumber", phonenumber);
        return dataMap;
    }
}
