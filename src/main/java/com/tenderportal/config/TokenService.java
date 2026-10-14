package com.tenderportal.config;

import com.tenderportal.model.User;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {
    private final Map<String, User> activeTokens = new ConcurrentHashMap<>();

    public String generateToken(User user) {
        String token = UUID.randomUUID().toString();
        activeTokens.put(token, user);
        return token;
    }

    public User getUserByToken(String token) {
        if (token == null) return null;
        return activeTokens.get(token);
    }

    public void registerStaticToken(String token, User user) {
        activeTokens.put(token, user);
    }

    public void removeToken(String token) {
        if (token != null) activeTokens.remove(token);
    }
}
