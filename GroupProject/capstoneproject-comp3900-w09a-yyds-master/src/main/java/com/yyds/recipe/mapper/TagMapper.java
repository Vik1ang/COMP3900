package com.yyds.recipe.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TagMapper {
    List<String> getTagsList();

    void addTagsList(List<String> tagList);
}
