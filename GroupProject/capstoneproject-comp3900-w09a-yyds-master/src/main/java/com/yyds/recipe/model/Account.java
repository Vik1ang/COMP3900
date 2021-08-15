package com.yyds.recipe.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Accessors(chain = true)
public class Account {
    private String email;
    private String password;
    private String userId;
    private String captcha;
    private String salt;
}
