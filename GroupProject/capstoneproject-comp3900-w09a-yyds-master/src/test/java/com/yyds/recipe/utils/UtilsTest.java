package com.yyds.recipe.utils;

import org.apache.tomcat.util.codec.binary.Base64;
import org.junit.jupiter.api.Test;

import java.security.SecureRandom;
import java.util.Arrays;

public class UtilsTest {

    @Test
    public void testSalt() {
        SecureRandom secureRandom = new SecureRandom();
        int length = 0;
        do {
            length = secureRandom.nextInt(20);
        } while (length < 10);
        System.out.println(length);
        byte[] bytes = new byte[length];
        secureRandom.nextBytes(bytes);
        String salt = Base64.encodeBase64String(bytes);
        System.out.println(salt);
        System.out.println(salt.length());
        System.out.println(Arrays.toString(bytes));
    }

    @Test
    public void test1() {

    }
}

// 10 -> 16
// 15 -> 20
