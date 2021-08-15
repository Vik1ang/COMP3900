package com.yyds.recipe.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptPasswordUtil {
    private static final BCryptPasswordEncoder B_CRYPT_PASSWORD_ENCODER = new BCryptPasswordEncoder();

    public static String encodePassword(String password) {
        return B_CRYPT_PASSWORD_ENCODER.encode(password);
    }

    public static boolean passwordMatch(String rawPassword, String userPassword) {
        return B_CRYPT_PASSWORD_ENCODER.matches(rawPassword, userPassword);
    }
}
