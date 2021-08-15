package com.yyds.recipe.service.impl;

import com.yyds.recipe.exception.AuthorizationException;
import com.yyds.recipe.exception.MySqlErrorException;
import com.yyds.recipe.exception.response.ResponseCode;
import com.yyds.recipe.mapper.UserMapper;
import com.yyds.recipe.model.Follow;
import com.yyds.recipe.model.User;
import com.yyds.recipe.service.UserService;
import com.yyds.recipe.utils.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.Serializable;
import java.time.Duration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;


@Service
@EnableTransactionManagement
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RedisTemplate<String, Serializable> redisTemplate;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AliyunOSSUtil aliyunOSSUtil;

    @Value("${spring.mail.username}")
    private String mailSenderAddress;

    @Value("${aliyun.oss.bucketName}")
    private String bucketName;

    private final static String PROFILE_PHOTO_FOLDER = "profile-photos/";

    private static final String PASSWORD_REGEX_PATTERN = "^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$";
    private static final int PASSWORD_LENGTH = 6;
    private static final String EMAIL_REGEX_PATTEN = "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$";
    private static final String EMAIL_VERIFY_TOKEN_PREFIX = "email verify: ";

    @Override
    public ResponseEntity<?> register(User user, HttpServletRequest request, HttpServletResponse response) {

        // check email if exist
        if (userMapper.getUserByEmail(user.getEmail()) != null) {
            return ResponseUtil.getResponse(ResponseCode.EMAIL_ALREADY_EXISTS_ERROR, null, null);
        }

        if (user.getFirstName() == null || user.getLastName() == null || user.getGender() == null
                || user.getEmail() == null || user.getPassword() == null || user.getBirthdate() == null) {
            return ResponseUtil.getResponse(ResponseCode.PARAMETER_ERROR, null, null);
        }

        // check email
        if (!user.getEmail().matches(EMAIL_REGEX_PATTEN)) {
            return ResponseUtil.getResponse(ResponseCode.EMAIL_REGEX_ERROR, null, null);
        }

        // check password
        if (!user.getPassword().matches(PASSWORD_REGEX_PATTERN)) {
            return ResponseUtil.getResponse(ResponseCode.PASSWORD_REGEX_ERROR, null, null);
        }

        if (user.getNickName() == null) {
            user.setNickName(user.getFirstName() + " " + user.getLastName());
        }

        String userId = UUIDGenerator.createUserId();
        user.setUserId(userId);
        user.setPassword(BcryptPasswordUtil.encodePassword(user.getPassword()));
        user.setCreateTime(String.valueOf(System.currentTimeMillis()));

        // JWT
        HashMap<String, String> payload = new HashMap<>();
        payload.put("userId", user.getUserId());
        payload.put("email", user.getEmail());
        String registerToken = EMAIL_VERIFY_TOKEN_PREFIX + JwtUtil.createToken(payload);

        Boolean isRegistered = redisTemplate.hasKey(registerToken);
        if (isRegistered == null) {
            return ResponseUtil.getResponse(ResponseCode.REDIS_ERROR, null, null);
        }
        if (isRegistered) {
            return ResponseUtil.getResponse(ResponseCode.EMAIL_VERIFY_ERROR, null, null);
        }

        // set in redis
        ValueOperations<String, Serializable> opsForValue = redisTemplate.opsForValue();
        opsForValue.set(registerToken, user, 30, TimeUnit.MINUTES);

        // send email
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessageHelper.setSubject("[YYDS] Please Verify Your Email!");
            mimeMessageHelper.setFrom(mailSenderAddress);
            mimeMessageHelper.setTo(user.getEmail());
            mimeMessageHelper.setText("<b>Dear <code>" + user.getNickName() + "</code></b>,<br><p>Welcome to </p><b>YYDS</b>! Please verify" +
                    " your account within <b>30 minutes</b> following this link: localhost:8080/emailVerify/" +
                    registerToken + "</code></p>", true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            redisTemplate.delete(registerToken);
            return ResponseUtil.getResponse(ResponseCode.MAIL_SERVER_ERROR, null, null);
        }

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    public ResponseEntity<?> loginUser(User loginUser, HttpServletRequest request, HttpServletResponse response) {

        User user = userMapper.getUserByEmail(loginUser.getEmail());
        if (user == null) {
            return ResponseUtil.getResponse(ResponseCode.EMAIL_OR_PASSWORD_ERROR, null, null);
        }
        if (!BcryptPasswordUtil.passwordMatch(loginUser.getPassword(), user.getPassword())) {
            return ResponseUtil.getResponse(ResponseCode.EMAIL_OR_PASSWORD_ERROR, null, null);
        }

        String email = loginUser.getEmail();
        String userId = userMapper.getUserIdByEmail(email);
        HashMap<String, String> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("userId", userId);
        String token = JwtUtil.createToken(payload);

        try {
            ValueOperations<String, Serializable> opsForValue = redisTemplate.opsForValue();
            opsForValue.set(token, user, Duration.ofHours(12));
        } catch (Exception e) {
            return ResponseUtil.getResponse(ResponseCode.REDIS_ERROR, null, null);
        }

        LinkedHashMap<String, Object> body = new LinkedHashMap<>();
        body.put("userId", user.getUserId());
        body.put("token", token);
        String profilePhoto = user.getProfilePhoto();
        if (profilePhoto == null) {
            profilePhoto = "";
        } else {
            profilePhoto = aliyunOSSUtil.getUrl(bucketName, PROFILE_PHOTO_FOLDER, profilePhoto);
        }
        body.put("profilePhoto", profilePhoto);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("token", token);
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, httpHeaders, body);

    }

    @Override
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("token");
        redisTemplate.delete(token);
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    @Transactional
    public ResponseEntity<?> editUser(MultipartFile profilePhoto, User user, HttpServletRequest request, HttpServletResponse response) {

        String token = request.getHeader("token");

        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        user.setUserId(userId);

        if (userMapper.getUserByUserId(user.getUserId()) == null) {
            throw new AuthorizationException();
        }

        if (user.getUserId() == null || (user.getGender() != null && (user.getGender() > 2 || user.getGender() < 0))) {
            return ResponseUtil.getResponse(ResponseCode.PARAMETER_ERROR, null, null);
        }

        if (profilePhoto != null) {
            // String originalFilename = profilePhoto.getOriginalFilename();
            // String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
            // String contentType = profilePhoto.getContentType();
            // InputStream inputStream = null;
            // try {
            //     inputStream = profilePhoto.getInputStream();
            // } catch (IOException e) {
            //     e.printStackTrace();
            // }
            // String photoName = UUIDGenerator.generateUUID() + suffix;
            // minioUtil.putObject(profilePhotoBucketName, photoName, contentType, inputStream);
            String photoName = aliyunOSSUtil.uploadObject(profilePhoto, bucketName, PROFILE_PHOTO_FOLDER);
            user.setProfilePhoto(photoName);
        }

        try {
            userMapper.editUser(user);
        } catch (Exception e) {
            return ResponseUtil.getResponse(ResponseCode.DATABASE_GENERAL_ERROR, null, null);
        }
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }


    @Override
    public ResponseEntity<?> editPassword(String oldPassword, String newPassword, HttpServletRequest request, HttpServletResponse response) {

        String token = request.getHeader("token");

        if (StringUtils.isEmpty(token)) {
            throw new AuthorizationException();
        }

        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        if (userMapper.getUserByUserId(userId) == null) {
            throw new AuthorizationException();
        }

        if (newPassword.length() < PASSWORD_LENGTH || !newPassword.matches(PASSWORD_REGEX_PATTERN)) {
            return ResponseUtil.getResponse(ResponseCode.PASSWORD_REGEX_ERROR, null, null);
        }

        String encodePassword = BcryptPasswordUtil.encodePassword(newPassword);

        try {
            userMapper.changePassword(userId, encodePassword);
        } catch (Exception e) {
            return ResponseUtil.getResponse(ResponseCode.DATABASE_GENERAL_ERROR, null, null);
        }

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    @Transactional(value = "transactionManager", rollbackFor = Exception.class)
    public String emailVerify(String token) {
        if (Boolean.FALSE.equals(redisTemplate.hasKey(token))) {
            return "Fail";
        }

        User user;
        try {
            user = (User) redisTemplate.opsForValue().get(token);
        } catch (Exception e) {
            return "Fail";
        }


        if (user == null) {
            return "Fail";
        }

        User checkedUser = userMapper.getUserByUserId(user.getUserId());
        if (checkedUser != null) {
            redisTemplate.delete(token);
            return "Fail";
        }

        try {
            userMapper.saveUser(user);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }


        try {
            userMapper.saveUserAccount(user);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }

        redisTemplate.delete(token);

        return "Success";

    }

    @Override
    public ResponseEntity<?> followUser(Follow follow, HttpServletRequest request) {
        String token = request.getHeader("token");
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        User checkedUser = userMapper.getUserByUserId(userId);
        if (checkedUser == null) {
            throw new AuthorizationException();
        }

        String followId = follow.getFollowId();
        User checkedFollow = userMapper.getUserByUserId(followId);
        if (checkedFollow == null) {
            return ResponseUtil.getResponse(ResponseCode.FOLLOW_USER_NOT_EXIST, null, null);
        }

        try {
            userMapper.followUser(userId, followId);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    public ResponseEntity<?> unfollowUser(Follow unfollow, HttpServletRequest request) {
        String token = request.getHeader("token");
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        User checkedUser = userMapper.getUserByUserId(userId);
        if (checkedUser == null) {
            throw new AuthorizationException();
        }

        String followId = unfollow.getFollowId();
        User checkedFollow = userMapper.getUserByUserId(followId);
        if (checkedFollow == null) {
            return ResponseUtil.getResponse(ResponseCode.FOLLOW_USER_NOT_EXIST, null, null);
        }

        try {
            userMapper.unfollowUser(userId, followId);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    public ResponseEntity<?> devRegister(User user) {

        String userId = UUIDGenerator.createUserId();
        user.setUserId(userId);
        user.setCreateTime(String.valueOf(System.currentTimeMillis()));
        user.setPassword(BcryptPasswordUtil.encodePassword(user.getPassword()));
        try {
            userMapper.saveUser(user);
            userMapper.saveUserAccount(user);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    public ResponseEntity<?> getMyPersonalProfile(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("token");
        if (StringUtils.isEmpty(token)) {
            throw new AuthorizationException();
        }

        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        User user = userMapper.getUserByUserId(userId);
        if (user == null) {
            return ResponseUtil.getResponse(ResponseCode.USERID_NOT_FOUND_ERROR, null, null);
        }

        String profilePhoto = user.getProfilePhoto();
        if (profilePhoto != null) {
            String photoUrl = aliyunOSSUtil.getUrl(bucketName, PROFILE_PHOTO_FOLDER, profilePhoto);
            user.setProfilePhoto(photoUrl);
        } else {
            user.setProfilePhoto("");
        }

        LinkedHashMap<String, Object> body = new LinkedHashMap<>();
        body.put("userInfo", user);
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, body);
    }

    @Override
    public ResponseEntity<?> getFollowingList(String search, HttpServletRequest request) {
        String token = request.getHeader("token");
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        List<User> followingList = userMapper.getFollowing(userId, search);
        for (User user : followingList) {
            String photoName = user.getProfilePhoto();
            String profilePhoto = "";
            try {
                profilePhoto = aliyunOSSUtil.getUrl(bucketName, PROFILE_PHOTO_FOLDER, photoName);
            } catch (Exception ignored) {
            }
            user.setProfilePhoto(profilePhoto);
        }
        LinkedHashMap<String, Object> body = new LinkedHashMap<>();
        body.put("following_list", followingList);
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, body);
    }

    @Override
    public ResponseEntity<?> getFollowerList(String search, HttpServletRequest request) {
        String token = request.getHeader("token");
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        List<User> followingList = userMapper.getFollower(userId, search);
        for (User user : followingList) {
            String photoName = user.getProfilePhoto();
            String profilePhoto = "";
            try {
                profilePhoto = aliyunOSSUtil.getUrl(bucketName, PROFILE_PHOTO_FOLDER, photoName);
            } catch (Exception ignored) {
            }
            user.setProfilePhoto(profilePhoto);
        }
        LinkedHashMap<String, Object> body = new LinkedHashMap<>();
        body.put("following_list", followingList);
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, body);
    }

    @Override
    public ResponseEntity<?> decodeToken(HttpServletRequest request) {
        String token = request.getHeader("token");
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        String email = JwtUtil.decodeToken(token).getClaim("email").asString();
        LinkedHashMap<String, Object> body = new LinkedHashMap<>();
        body.put("userId", userId);
        body.put("email", email);
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, body);
    }

}
