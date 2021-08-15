package com.yyds.recipe.service;

import com.yyds.recipe.model.Comment;
import com.yyds.recipe.model.Recipe;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

public interface RecipeService {
    ResponseEntity<?> postRecipe(HttpServletRequest request, MultipartFile[] uploadPhotos, Recipe recipe,
                                 MultipartFile[] uploadVideos);

    ResponseEntity<?> updateRecipe(MultipartFile[] uploadPhotos, Recipe recipe, MultipartFile[] uploadVideos, HttpServletRequest request);

    ResponseEntity<?> deleteRecipe(Recipe recipe, HttpServletRequest request);

    ResponseEntity<?> likeRecipe(HttpServletRequest request, Recipe recipe);

    ResponseEntity<?> unlikeRecipe(HttpServletRequest request, Recipe recipe);

    ResponseEntity<?> getAllPublicRecipes(String recipeId, String creatorId, String search, String tags, Integer isLiked, Integer pageNum, Integer pageSize, HttpServletRequest request);

    ResponseEntity<?> commentRecipe(Comment comment, HttpServletRequest request);

    ResponseEntity<?> deleteComment(Comment comment, HttpServletRequest request);

    ResponseEntity<?> setPrivacyRecipe(HttpServletRequest request, Recipe recipe);

    ResponseEntity<?> getMyRecipes(int pageNum, int pageSize, HttpServletRequest request);

    ResponseEntity<?> rateRecipe(Recipe recipe, HttpServletRequest request);

    ResponseEntity<?> visitorGetRecipeList(String recipeId, String userId, String search, String tags, Integer pageNum, Integer pageSize);
}
