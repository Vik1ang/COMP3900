package com.yyds.recipe.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class Recipe implements Serializable {
    private String recipeId;
    private String introduction;
    private String title;
    private String ingredients;
    private String method;
    private List<String> tags;
    private int timeDuration;
    private List<String> recipePhotos;
    private List<String> recipeVideos;
    private List<Comment> comments;
    private int likes;
    private String userId;
    private String createTime;
    private int isPrivacy;
    private Double rateScore;
    private Integer isLiked;
    private Integer isRated;
    private Double myRateScore;
    private String nickName;
}
