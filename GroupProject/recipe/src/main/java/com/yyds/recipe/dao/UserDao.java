package com.yyds.recipe.dao;

import com.yyds.recipe.controller.LoginController;
import com.yyds.recipe.controller.RegisterController;
import com.yyds.recipe.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int registerUser(User user) {
        // String sql = "insert into user(userId, userName, userPassword) values (?, ?, ?)";
        // List<Object> args = new ArrayList<>();
        // args.add(user.getUserId());
        // args.add(user.getUserName());
        // args.add(user.getUserPassword());
        // return jdbcTemplate.update(sql, args);
        String sql = "insert into user(userId, userName, userPassword) values(?,?,?)";
        return jdbcTemplate.update(sql, user.getUserId(), user.getUserName(), user.getUserPassword());
    }

}
