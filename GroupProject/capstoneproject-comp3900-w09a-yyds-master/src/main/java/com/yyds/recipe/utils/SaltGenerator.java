package com.yyds.recipe.utils;

import org.apache.tomcat.util.codec.binary.Base64;

import java.security.SecureRandom;


public class SaltGenerator {
    public static String getSalt() {
        SecureRandom secureRandom = new SecureRandom();
        int length = 0;
        do {
            length = secureRandom.nextInt(20);
        } while (length < 10);
        System.out.println(length);
        byte[] bytes = new byte[length];
        secureRandom.nextBytes(bytes);
        return Base64.encodeBase64String(bytes);
    }
}
