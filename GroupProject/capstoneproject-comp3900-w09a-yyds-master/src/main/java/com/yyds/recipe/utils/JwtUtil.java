package com.yyds.recipe.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

public class JwtUtil {

    private static final String SECRET = "kBG9xx7w6#A@6QmMbRq2%XdKC&s^";

    public static String createToken(Map<String, String> payload) {
        JWTCreator.Builder builder = JWT.create();
        LinkedHashMap<String, Object> headerMap = new LinkedHashMap<>();
        headerMap.put("alg", "HS256");
        headerMap.put("type", "JWT");

        long currentTimeMillis = System.currentTimeMillis();
        builder.withHeader(headerMap)
                .withIssuedAt(new Date(currentTimeMillis))
                .withExpiresAt(new Date(currentTimeMillis + 12 * 60 * 1000 * 60));

        payload.forEach(builder::withClaim);

        return builder.sign(Algorithm.HMAC256(SECRET));
    }

    public static DecodedJWT verifyToken(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET)).build().verify(token);
    }

    public static DecodedJWT decodeToken(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET)).build().verify(token);
    }
}
