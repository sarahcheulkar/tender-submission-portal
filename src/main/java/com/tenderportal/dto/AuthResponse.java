package com.tenderportal.dto;

import com.tenderportal.model.User.Role;

public class AuthResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String organization;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String name, String email, Role role, String organization) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.organization = organization;
    }

    public String getToken() { return token; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public String getOrganization() { return organization; }
}
