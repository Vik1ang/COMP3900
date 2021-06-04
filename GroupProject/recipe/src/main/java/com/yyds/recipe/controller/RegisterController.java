package com.yyds.recipe.controller;

import com.yyds.recipe.dao.UserDao;
import com.yyds.recipe.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;

@Controller
public class RegisterController {

    @Autowired
    private UserDao userDao;


    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public void userRegister(@RequestBody User registerReq, HttpSession httpSession) {
        userDao.registerUser(registerReq);
    }

}
