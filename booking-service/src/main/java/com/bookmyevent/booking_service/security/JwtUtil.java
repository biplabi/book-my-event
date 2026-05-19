package com.bookmyevent.booking_service.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class JwtUtil {
    private final String SECRET = "xjhdwacuvercyebwvcywebvewiveqbvyqivuyfkgvewrkuvbuyewvrbvie";

    public String generateToken(UserDetails userDetails) {

        Map<String, Object> claim = new HashMap<>();

        claim.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList());

        return Jwts.builder()
                .setClaims(claim)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public List<String> extractRoles(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .get("roles", List.class);
    }

    public boolean validateToken(String username, String token) {
        return username.equals(extractUsername(token));
    }
}
