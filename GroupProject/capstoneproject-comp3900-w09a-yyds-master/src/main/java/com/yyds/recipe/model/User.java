package com.yyds.recipe.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class User implements Serializable {
    private String userId;
    private String firstName;
    private String lastName;
    private Integer gender;
    private String email;
    private String nickName;
    private String password;
    private String birthdate;
    private String createTime;
    private String profilePhoto;
    private String salt;

}
