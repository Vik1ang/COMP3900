package com.yyds.recipe.controller;

import com.yyds.recipe.model.Comment;
import com.yyds.recipe.model.Recipe;
import com.yyds.recipe.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

@RestController
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @RequestMapping(value = "/recipe/postRecipe", method = RequestMethod.POST)
    public ResponseEntity<?> postRecipe(HttpServletRequest request,
                                        @RequestPart(value = "uploadPhotos") MultipartFile[] uploadPhotos,
                                        @RequestPart(value = "jsonData") Recipe recipe,
                                        @RequestPart(value = "uploadVideos", required = false) MultipartFile[] uploadVideos) {
        return recipeService.postRecipe(request, uploadPhotos, recipe, uploadVideos);
    }

    @RequestMapping(value = "/recipe/update", method = RequestMethod.POST)
    public ResponseEntity<?> RecipeUpdate(
            @RequestPart(value = "uploadPhotos", required = false) MultipartFile[] uploadPhotos,
            @RequestPart(value = "jsonData") Recipe recipe,
            @RequestPart(value = "uploadVideos", required = false) MultipartFile[] uploadVideos,
            HttpServletRequest request) {
        return recipeService.updateRecipe(uploadPhotos, recipe, uploadVideos, request);
    }

    @RequestMapping(value = "/recipe/delete", method = RequestMethod.POST)
    public ResponseEntity<?> RecipeDelete(@RequestBody Recipe recipe, HttpServletRequest request) {
        return recipeService.deleteRecipe(recipe, request);
    }

    @RequestMapping(value = "/recipe/like", method = RequestMethod.POST)
    public ResponseEntity<?> likeRecipe(HttpServletRequest request, @RequestBody Recipe recipe) {

        return recipeService.likeRecipe(request, recipe);
    }

    @RequestMapping(value = "/recipe/unlike", method = RequestMethod.POST)
    public ResponseEntity<?> unlikeRecipe(HttpServletRequest request, @RequestBody Recipe recipe) {
        return recipeService.unlikeRecipe(request, recipe);
    }

    @RequestMapping(value = "/recipe/set_privacy", method = RequestMethod.GET)
    public ResponseEntity<?> setRecipePrivacy(HttpServletRequest request, @RequestBody Recipe recipe) {
        return recipeService.setPrivacyRecipe(request, recipe);
    }

    @RequestMapping(value = "/recipe/recipe_list", method = RequestMethod.GET)
    public ResponseEntity<?> getRecipeList(@RequestParam(value = "recipeId", required = false) String recipeId,
                                           @RequestParam(value = "userId", required = false) String userId,
                                           @RequestParam(value = "search", required = false) String search,
                                           @RequestParam(value = "tag", required = false) String tags,
                                           @RequestParam(value = "is_liked", required = false) Integer isLiked,
                                           @RequestParam(value = "pageNum", required = false) Integer pageNum,
                                           @RequestParam(value = "pageSize", required = false) Integer pageSize,
                                           HttpServletRequest request) {
        return recipeService.getAllPublicRecipes(recipeId, userId, search, tags, isLiked, pageNum, pageSize, request);
    }

    @RequestMapping(value = "/recipe/my_recipe", method = RequestMethod.GET)
    public ResponseEntity<?> getMyRecipeList(@RequestParam(value = "pageNum", required = false) int pageNum, @RequestParam(value = "pageSize", required = false) int pageSize, HttpServletRequest request) {
        return recipeService.getMyRecipes(pageNum, pageSize, request);
    }

    @RequestMapping(value = "/recipe/rate", method = RequestMethod.POST)
    public ResponseEntity<?> rateRecipe(@RequestBody Recipe recipe, HttpServletRequest request) {
        return recipeService.rateRecipe(recipe, request);
    }


    @RequestMapping(value = "/recipe/comment", method = RequestMethod.POST)
    public ResponseEntity<?> commentRecipe(@RequestBody Comment comment, HttpServletRequest request) {
        return recipeService.commentRecipe(comment, request);
    }


    @RequestMapping(value = "/recipe/deleteComment", method = RequestMethod.POST)
    public ResponseEntity<?> deleteComment(@RequestBody Comment comment, HttpServletRequest request) {
        return recipeService.deleteComment(comment, request);
    }


    @RequestMapping(value = "/visitor/recipe_list", method = RequestMethod.GET)
    public ResponseEntity<?> getPublicList(@RequestParam(value = "recipeId", required = false) String recipeId,
                                           @RequestParam(value = "userId", required = false) String userId,
                                           @RequestParam(value = "search", required = false) String search,
                                           @RequestParam(value = "tag", required = false) String tags,
                                           @RequestParam(value = "pageNum", required = false) Integer pageNum,
                                           @RequestParam(value = "pageSize", required = false) Integer pageSize) {
        return recipeService.visitorGetRecipeList(recipeId, userId, search, tags, pageNum, pageSize);
    }

}
