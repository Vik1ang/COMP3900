package com.yyds.recipe.mapper;

import com.yyds.recipe.model.Comment;
import com.yyds.recipe.model.Recipe;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RecipeMapper {

    void saveRecipe(Recipe recipe);

    void savePhotos(String recipeId, List<String> uploadPhotos);

    void likeRecipe(String userId, String recipeId);

    void unlikeRecipe(String userId, String recipeId);

    Recipe getRecipeById(String recipeId);

    List<Recipe> getRecipeList(List<String> tagList, String searchContent, String creatorId, String recipeId, String userId, Integer isLiked);

    List<Recipe> getMyRecipeList(String userId);

    List<String> getFileNameListByRecipeId(String recipeId);

    void saveTagRecipe(String recipeId, List<String> tags);

    int getCountBySpecificRate(String recipeId, String userId);

    void updatePrivacy(String recipeId, int isPrivacy);

    List<String> getTagListByRecipeId(String recipeId);

    void rateRecipe(String recipeId, String userId, Double rate);

    void updateRate(String recipeId, String userId, Double rate);

    void postComment(Comment comment);

    List<Comment> getComments(String commentId);

    void deleteComment(Comment comment);

    void saveVideos(String recipeId, List<String> uploadVideos);

    void deleteRecipe(Recipe recipe);

    void deletePhotoByRecipeId(Recipe recipe);

    void deleteVideoByRecipeId(Recipe recipe);

    void updateRecipe(Recipe recipe);

    void deleteTagsByRecipe(Recipe recipe);

    List<Recipe> getVisitorRecipeList(String recipeId, String creatorId);

    List<String> getVideoFileList(String recipeId);
}
