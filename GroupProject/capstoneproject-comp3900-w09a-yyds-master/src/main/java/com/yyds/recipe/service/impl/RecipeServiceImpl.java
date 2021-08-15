package com.yyds.recipe.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yyds.recipe.exception.AuthorizationException;
import com.yyds.recipe.exception.MySqlErrorException;
import com.yyds.recipe.exception.response.ResponseCode;
import com.yyds.recipe.mapper.RecipeMapper;
import com.yyds.recipe.mapper.TagMapper;
import com.yyds.recipe.mapper.UserMapper;
import com.yyds.recipe.model.Comment;
import com.yyds.recipe.model.Recipe;
import com.yyds.recipe.model.User;
import com.yyds.recipe.service.RecipeService;
import com.yyds.recipe.utils.AliyunOSSUtil;
import com.yyds.recipe.utils.JwtUtil;
import com.yyds.recipe.utils.ResponseUtil;
import com.yyds.recipe.utils.UUIDGenerator;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

@EnableTransactionManagement
@Service
public class RecipeServiceImpl implements RecipeService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RecipeMapper recipeMapper;

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private AliyunOSSUtil aliyunOSSUtil;

    @Autowired
    private RedisTemplate<String, Serializable> redisTemplate;

    @Value("${aliyun.oss.bucketName}")
    private String bucketName;

    private final static String RECIPE_PHOTO_FOLDER = "recipe-photos/";

    private final static String RECIPE_VIDEO_FOLDER = "recipe-videos/";

    private final static String PROFILE_PHOTO_FOLDER = "profile-photos/";


    @Override
    @Transactional(value = "transactionManager", rollbackFor = Exception.class)
    public ResponseEntity<?> postRecipe(HttpServletRequest request, MultipartFile[] uploadPhotos, Recipe recipe,
                                        MultipartFile[] uploadVideos) {
        User user = checkedUser(request);
        String recipeId = UUIDGenerator.createRecipeId();
        recipe.setRecipeId(recipeId);
        recipe.setCreateTime(String.valueOf(System.currentTimeMillis()));
        recipe.setUserId(user.getUserId());

        recipe.setRecipePhotos(new ArrayList<>());
        for (MultipartFile uploadPhoto : uploadPhotos) {
            // String originalFilename = uploadPhoto.getOriginalFilename();
            // if (originalFilename == null) {
            //     continue;
            // }
            // String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
            // String contentType = uploadPhoto.getContentType();
            // InputStream inputStream = null;
            // try {
            //     inputStream = uploadPhoto.getInputStream();
            // } catch (IOException e) {
            //     e.printStackTrace();
            // }
            // String photoName = UUIDGenerator.generateUUID() + suffix;
            // minioUtil.putObject(recipePhotoBucketName, photoName, contentType, inputStream);
            String photoName = aliyunOSSUtil.uploadObject(uploadPhoto, bucketName, RECIPE_PHOTO_FOLDER);
            recipe.getRecipePhotos().add(photoName);
        }

        if (uploadVideos != null) {
            recipe.setRecipeVideos(new ArrayList<>());
            for (MultipartFile uploadVideo : uploadVideos) {
                // String originalFilename = uploadVideo.getOriginalFilename();
                // if (originalFilename == null) {
                //     continue;
                // }
                // String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
                // String contentType = uploadVideo.getContentType();
                // InputStream inputStream = null;
                // try {
                //     inputStream = uploadVideo.getInputStream();
                // } catch (IOException e) {
                //     e.printStackTrace();
                // }
                // String videoName = UUIDGenerator.generateUUID() + suffix;
                // minioUtil.putObject(recipeVideoBucketName, videoName, contentType, inputStream);
                String videoName = aliyunOSSUtil.uploadObject(uploadVideo, bucketName, RECIPE_VIDEO_FOLDER);
                recipe.getRecipeVideos().add(videoName);
            }
        }

        // insert into recipe table
        List<String> tagList = recipe.getTags();
        try {
            List<String> databaseTagsList = tagMapper.getTagsList();
            List<String> newTagsList = new ArrayList<>();
            for (String tag : tagList) {
                if (!databaseTagsList.contains(tag)) {
                    newTagsList.add(tag);
                }
            }
            if (newTagsList.size() != 0) {
                tagMapper.addTagsList(newTagsList);
            }

            recipeMapper.saveRecipe(recipe);
            recipeMapper.saveTagRecipe(recipeId, tagList);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }

        // insert into photo table
        try {
            recipeMapper.savePhotos(recipeId, recipe.getRecipePhotos());
        } catch (Exception e) {
            throw new MySqlErrorException();
        }

        if (!(recipe.getRecipeVideos() == null || recipe.getRecipeVideos().size() == 0)) {

            try {
                recipeMapper.saveVideos(recipeId, recipe.getRecipeVideos());
            } catch (Exception e) {
                throw new MySqlErrorException();
            }
        }

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    @Transactional(value = "transactionManager", rollbackFor = Exception.class)
    public ResponseEntity<?> updateRecipe(MultipartFile[] uploadPhotos, Recipe recipe, MultipartFile[] uploadVideos, HttpServletRequest request) {
        if (recipe == null || recipe.getRecipeId() == null) {
            return ResponseUtil.getResponse(ResponseCode.PARAMETER_ERROR, null, null);
        }
        Recipe checkedRecipe = recipeMapper.getRecipeById(recipe.getRecipeId());
        String token = request.getHeader("token");
        if (StringUtils.isEmpty(token)) {
            throw new AuthorizationException();
        }
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        if (!StringUtils.equals(userId, checkedRecipe.getUserId())) {
            return ResponseUtil.getResponse(ResponseCode.BUSINESS_LOGIC_ERROR, null, null);
        }
        try {
            if (uploadPhotos != null) {
                recipeMapper.deletePhotoByRecipeId(recipe);
                recipe.setRecipePhotos(new ArrayList<>());
                for (MultipartFile uploadPhoto : uploadPhotos) {
                    // String originalFilename = uploadPhoto.getOriginalFilename();
                    // if (originalFilename == null) {
                    //     continue;
                    // }
                    // String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
                    // String contentType = uploadPhoto.getContentType();
                    // InputStream inputStream = null;
                    // try {
                    //     inputStream = uploadPhoto.getInputStream();
                    // } catch (IOException e) {
                    //     e.printStackTrace();
                    // }
                    // String photoName = UUIDGenerator.generateUUID() + suffix;
                    // minioUtil.putObject(recipePhotoBucketName, photoName, contentType, inputStream);
                    String photoName = aliyunOSSUtil.uploadObject(uploadPhoto, bucketName, RECIPE_PHOTO_FOLDER);
                    recipe.getRecipePhotos().add(photoName);
                }
                recipeMapper.savePhotos(recipe.getRecipeId(), recipe.getRecipePhotos());
            }

            if (uploadVideos != null) {
                recipeMapper.deleteVideoByRecipeId(recipe);
                recipe.setRecipeVideos(new ArrayList<>());
                for (MultipartFile uploadVideo : uploadVideos) {
                    // String originalFilename = uploadVideo.getOriginalFilename();
                    // if (originalFilename == null) {
                    //     continue;
                    // }
                    // String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
                    // String contentType = uploadVideo.getContentType();
                    // InputStream inputStream = null;
                    // try {
                    //     inputStream = uploadVideo.getInputStream();
                    // } catch (IOException e) {
                    //     e.printStackTrace();
                    // }
                    // String videoName = UUIDGenerator.generateUUID() + suffix;
                    // minioUtil.putObject(recipeVideoBucketName, videoName, contentType, inputStream);
                    // recipe.getRecipeVideos().add(videoName);
                    String videoName = aliyunOSSUtil.uploadObject(uploadVideo, bucketName, RECIPE_VIDEO_FOLDER);
                    recipe.getRecipeVideos().add(videoName);
                }
                recipeMapper.saveVideos(recipe.getRecipeId(), recipe.getRecipeVideos());
            }
            List<String> tags = recipe.getTags();
            if (tags != null && tags.size() > 0) {
                recipeMapper.deleteTagsByRecipe(recipe);
                recipeMapper.saveTagRecipe(recipe.getRecipeId(), tags);
            }

            recipeMapper.updateRecipe(recipe);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);

    }

    @Override
    @Transactional(value = "transactionManager", rollbackFor = Exception.class)
    public ResponseEntity<?> deleteRecipe(Recipe recipe, HttpServletRequest request) {
        if (recipe == null || recipe.getRecipeId() == null) {
            return ResponseUtil.getResponse(ResponseCode.PARAMETER_ERROR, null, null);
        }
        Recipe checkedRecipe = recipeMapper.getRecipeById(recipe.getRecipeId());
        String token = request.getHeader("token");
        if (StringUtils.isEmpty(token)) {
            throw new AuthorizationException();
        }
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        if (!StringUtils.equals(userId, checkedRecipe.getUserId())) {
            return ResponseUtil.getResponse(ResponseCode.BUSINESS_LOGIC_ERROR, null, null);
        }
        try {
            recipeMapper.deleteRecipe(recipe);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);

    }

    @Override
    public ResponseEntity<?> likeRecipe(HttpServletRequest request, Recipe recipe) {

        User user = checkedUser(request);

        String recipeId = recipe.getRecipeId();

        Recipe checkRecipe = recipeMapper.getRecipeById(recipeId);
        if (checkRecipe == null) {
            return ResponseUtil.getResponse(ResponseCode.RECIPE_ID_NOT_FOUND, null, null);
        }

        try {
            recipeMapper.likeRecipe(user.getUserId(), recipeId);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    public ResponseEntity<?> unlikeRecipe(HttpServletRequest request, Recipe recipe) {

        User user = checkedUser(request);

        String recipeId = recipe.getRecipeId();

        Recipe checkRecipe = recipeMapper.getRecipeById(recipeId);
        if (checkRecipe == null) {
            return ResponseUtil.getResponse(ResponseCode.RECIPE_ID_NOT_FOUND, null, null);
        }

        try {
            recipeMapper.unlikeRecipe(user.getUserId(), recipeId);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    public ResponseEntity<?> getAllPublicRecipes(String recipeId,
                                                 String creatorId,
                                                 String searchContent,
                                                 String searchTags,
                                                 Integer isLiked,
                                                 Integer pageNum,
                                                 Integer pageSize,
                                                 HttpServletRequest request) {
        if (pageNum == null || pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize >= 9) {
            pageSize = 9;
        }
        PageHelper.startPage(pageNum, pageSize, true);
        List<String> searchTagList = null;
        if (searchTags != null) {
            searchTagList = Arrays.asList(searchTags.split(","));
        }
        String userId = JwtUtil.decodeToken(request.getHeader("token")).getClaim("userId").asString();
        List<Recipe> recipeList = recipeMapper.getRecipeList(searchTagList, searchContent, creatorId, recipeId, userId, isLiked);
        for (Recipe recipe : recipeList) {
            List<String> recipePhotos = new ArrayList<>();
            List<String> fileNameList = recipeMapper.getFileNameListByRecipeId(recipe.getRecipeId());
            for (String fileName : fileNameList) {
                // String fileUrl = minioUtil.presignedGetObject(recipePhotoBucketName, fileName, 7);
                String fileUrl = aliyunOSSUtil.getUrl(bucketName, RECIPE_PHOTO_FOLDER, fileName);
                recipePhotos.add(fileUrl);
            }
            recipe.setRecipePhotos(recipePhotos);
            List<String> videoList = recipeMapper.getVideoFileList(recipe.getRecipeId());
            List<String> recipeVideoList = new ArrayList<>();
            for (String videoName : videoList) {
                String videoUrl = aliyunOSSUtil.getUrl(bucketName, RECIPE_VIDEO_FOLDER, videoName);
                recipeVideoList.add(videoUrl);
            }
            recipe.setRecipeVideos(recipeVideoList);
            List<String> tags = recipeMapper.getTagListByRecipeId(recipe.getRecipeId());
            recipe.setTags(tags);

            List<Comment> comments = recipe.getComments();
            for (Comment comment : comments) {
                if (comment.getProfilePhoto() == null) {
                    continue;
                }
                String photoName = aliyunOSSUtil.getUrl(bucketName, PROFILE_PHOTO_FOLDER, comment.getProfilePhoto());
                // String photoName = minioUtil.presignedGetObject(profilePhotoBucketName, comment.getProfilePhoto(), 7);
                comment.setProfilePhoto(photoName);
            }
        }

        PageInfo<Recipe> recipePageInfo = new PageInfo<>(recipeList);
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("recipe_lists", recipeList);
        resultMap.put("total", recipePageInfo.getTotal());
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, resultMap);
    }

    @Override
    public ResponseEntity<?> getMyRecipes(int pageNum, int pageSize, HttpServletRequest request) {
        User user = checkedUser(request);
        if (pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize >= 9) {
            pageSize = 9;
        }
        PageHelper.startPage(pageNum, pageSize, true);
        List<Recipe> myRecipeList = recipeMapper.getMyRecipeList(user.getUserId());
        for (Recipe recipe : myRecipeList) {
            List<String> recipePhotos = new ArrayList<>();
            List<String> fileNameList = recipeMapper.getFileNameListByRecipeId(recipe.getRecipeId());
            for (String fileName : fileNameList) {
                String fileUrl = aliyunOSSUtil.getUrl(bucketName, RECIPE_PHOTO_FOLDER, fileName);
                recipePhotos.add(fileUrl);
            }
            recipe.setRecipePhotos(recipePhotos);
            List<String> tags = recipeMapper.getTagListByRecipeId(recipe.getRecipeId());
            recipe.setTags(tags);
        }
        PageInfo<Recipe> recipePageInfo = new PageInfo<>(myRecipeList);
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("recipe_lists", myRecipeList);
        resultMap.put("total", recipePageInfo.getTotal());
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, resultMap);
    }

    @Override
    public ResponseEntity<?> commentRecipe(Comment comment, HttpServletRequest request) {
        String token = request.getHeader("token");
        if (StringUtils.isEmpty(token)) {
            throw new AuthorizationException();
        }
        comment.setCommentId(UUIDGenerator.generateUUID());
        comment.setCreatorId(JwtUtil.decodeToken(token).getClaim("userId").asString());
        String currentTimeString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        comment.setCreateTime(currentTimeString);
        comment.setUpdateTime(currentTimeString);
        try {
            recipeMapper.postComment(comment);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    public ResponseEntity<?> deleteComment(Comment comment, HttpServletRequest request) {
        String token = request.getHeader("token");
        if (StringUtils.isEmpty(token)) {
            throw new AuthorizationException();
        }
        String commentId = comment.getCommentId();
        if (commentId == null) {
            throw new AuthorizationException();
        }
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        List<Comment> CommentList = recipeMapper.getComments(commentId);
        if (CommentList == null || CommentList.size() == 0) {
            return ResponseUtil.getResponse(ResponseCode.BUSINESS_LOGIC_ERROR, null, null);
        }
        Comment checkedComment = CommentList.get(0);
        if (!StringUtils.equals(userId, checkedComment.getCreatorId())) {
            return ResponseUtil.getResponse(ResponseCode.BUSINESS_LOGIC_ERROR, null, null);
        }
        try {
            recipeMapper.deleteComment(comment);
        } catch (Exception e) {
            throw new MySqlErrorException();
        }
        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }


    @Override
    public ResponseEntity<?> setPrivacyRecipe(HttpServletRequest request, Recipe recipe) {
        User user = checkedUser(request);
        String recipeId = recipe.getRecipeId();

        Recipe checkedRecipe = recipeMapper.getRecipeById(recipeId);
        if (checkedRecipe == null) {
            return ResponseUtil.getResponse(ResponseCode.RECIPE_ID_NOT_FOUND, null, null);
        }

        if (!StringUtils.equals(user.getUserId(), checkedRecipe.getUserId())) {
            throw new AuthorizationException();
        }

        try {
            recipeMapper.updatePrivacy(recipeId, recipe.getIsPrivacy());
        } catch (Exception e) {
            throw new MySqlErrorException();
        }

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }


    private User checkedUser(HttpServletRequest request) {
        String token = request.getHeader("token");
        if (StringUtils.isEmpty(token)) {
            throw new AuthorizationException();
        }
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        User checkedUser = userMapper.getUserByUserId(userId);
        if (checkedUser == null) {
            throw new AuthorizationException();
        }
        return checkedUser;
    }


    @Override
    public ResponseEntity<?> rateRecipe(Recipe recipe, HttpServletRequest request) {
        String token = request.getHeader("token");
        if (StringUtils.isEmpty(token)) {
            throw new AuthorizationException();
        }
        String userId = JwtUtil.decodeToken(token).getClaim("userId").asString();
        String recipeId = recipe.getRecipeId();
        if (recipeMapper.getRecipeById(recipeId) == null) {
            return ResponseUtil.getResponse(ResponseCode.RECIPE_ID_NOT_FOUND, null, null);
        }
        try {
            int count = recipeMapper.getCountBySpecificRate(recipeId, userId);
            if (count > 0) {
                recipeMapper.updateRate(recipeId, userId, recipe.getRateScore());
            } else {
                recipeMapper.rateRecipe(recipeId, userId, recipe.getRateScore());
            }
        } catch (Exception e) {
            throw new MySqlErrorException();
        }

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, null);
    }

    @Override
    public ResponseEntity<?> visitorGetRecipeList(String recipeId,
                                                  String creatorId,
                                                  String searchContent,
                                                  String searchTags,
                                                  Integer pageNum,
                                                  Integer pageSize) {

        try {
            List<Recipe> topLikesList = (List<Recipe>) redisTemplate.opsForValue().get("topLikesList");
            List<Recipe> topRateList = (List<Recipe>) redisTemplate.opsForValue().get("topRateList");
            List<Recipe> randomRecipeList = (List<Recipe>) redisTemplate.opsForValue().get("randomRecipeList");
            List<Recipe> easyRecipeList = (List<Recipe>) redisTemplate.opsForValue().get("easyRecipeList");
            LinkedHashMap<String, Object> resultMap = new LinkedHashMap<>();
            if (topLikesList != null && topRateList != null && randomRecipeList != null && easyRecipeList != null) {
                resultMap.put("top_likes_list", topLikesList);
                resultMap.put("top_rates_list", topRateList);
                resultMap.put("random_recipe_list", randomRecipeList);
                resultMap.put("easy_recipe_list", easyRecipeList);

                LinkedHashMap<String, Object> topLikes = new LinkedHashMap<>();
                topLikes.put("list", topLikesList);
                topLikes.put("name", "like");
                resultMap.put("top_likes_list", topLikes);

                LinkedHashMap<String, Object> topRate = new LinkedHashMap<>();
                topRate.put("list", topRateList);
                topRate.put("name", "rate");
                resultMap.put("top_rates_list", topRate);

                LinkedHashMap<String, Object> randomRecipe = new LinkedHashMap<>();
                randomRecipe.put("list", randomRecipeList);
                randomRecipe.put("name", "random");
                resultMap.put("random_recipe_list", randomRecipe);

                LinkedHashMap<String, Object> easyRecipe = new LinkedHashMap<>();
                easyRecipe.put("list", easyRecipeList);
                easyRecipe.put("name", "easy");
                resultMap.put("easy_recipe_list", easyRecipe);
                return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, resultMap);
            }
        } catch (Exception ignored) {

        }

        List<Recipe> recipeList = recipeMapper.getVisitorRecipeList(recipeId, creatorId);
        for (Recipe recipe : recipeList) {
            List<String> recipePhotos = new ArrayList<>();
            List<String> fileNameList = recipeMapper.getFileNameListByRecipeId(recipe.getRecipeId());
            for (String fileName : fileNameList) {
                String fileUrl = aliyunOSSUtil.getUrl(bucketName, RECIPE_PHOTO_FOLDER, fileName);
                recipePhotos.add(fileUrl);
            }
            recipe.setRecipePhotos(recipePhotos);
            List<String> tags = recipeMapper.getTagListByRecipeId(recipe.getRecipeId());
            recipe.setTags(tags);
        }

        int size = 3;
        int recipeListSize = recipeList.size();
        if (size > recipeListSize) {
            size = recipeListSize;
        }

        recipeList.sort((o1, o2) -> o2.getLikes() - o1.getLikes());
        List<Recipe> topLikesList = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            topLikesList.add(recipeList.get(i));
        }
        recipeList.sort((o1, o2) -> o2.getRateScore().compareTo(o1.getRateScore()));
        List<Recipe> topRateList = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            topRateList.add(recipeList.get(i));
        }
        recipeList.sort((o1, o2) -> o1.getTimeDuration() - o2.getTimeDuration());
        List<Recipe> easyRecipeList = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            easyRecipeList.add(recipeList.get(i));
        }

        recipeList.removeAll(topLikesList);
        recipeList.removeAll(topRateList);
        recipeList.removeAll(easyRecipeList);

        List<Recipe> randomRecipeList = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < size; i++) {
            int index = random.nextInt(recipeList.size());
            Recipe temp = recipeList.get(index);
            randomRecipeList.add(temp);
            recipeList.remove(temp);
        }
        ValueOperations<String, Serializable> opsForValue = redisTemplate.opsForValue();
        try {
            opsForValue.set("topLikesList", (Serializable) topLikesList, 10, TimeUnit.MINUTES);
            opsForValue.set("topRatesList", (Serializable) topRateList, 10, TimeUnit.MINUTES);
            opsForValue.set("randomRecipeList", (Serializable) randomRecipeList, 10, TimeUnit.MINUTES);
            opsForValue.set("easyRecipeList", (Serializable) easyRecipeList, 10, TimeUnit.MINUTES);
        } catch (Exception e) {
            return ResponseUtil.getResponse(ResponseCode.REDIS_ERROR, null, null);
        }
        LinkedHashMap<String, Object> resultMap = new LinkedHashMap<>();

        LinkedHashMap<String, Object> topLikes = new LinkedHashMap<>();
        topLikes.put("list", topLikesList);
        topLikes.put("name", "like");
        resultMap.put("top_likes_list", topLikes);

        LinkedHashMap<String, Object> topRate = new LinkedHashMap<>();
        topRate.put("list", topRateList);
        topRate.put("name", "rate");
        resultMap.put("top_rates_list", topRate);

        LinkedHashMap<String, Object> randomRecipe = new LinkedHashMap<>();
        randomRecipe.put("list", randomRecipeList);
        randomRecipe.put("name", "random");
        resultMap.put("random_recipe_list", randomRecipe);

        LinkedHashMap<String, Object> easyRecipe = new LinkedHashMap<>();
        easyRecipe.put("list", easyRecipeList);
        easyRecipe.put("name", "easy");
        resultMap.put("easy_recipe_list", easyRecipe);

        return ResponseUtil.getResponse(ResponseCode.SUCCESS, null, resultMap);
    }
}
