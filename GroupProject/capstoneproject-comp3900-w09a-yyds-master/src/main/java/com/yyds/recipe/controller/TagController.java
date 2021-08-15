package com.yyds.recipe.controller;

import com.yyds.recipe.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TagController {

    @Autowired
    private TagService tagService;

    @RequestMapping(value = "/tags/tag_list", method = RequestMethod.GET)
    public ResponseEntity<?> getTagList() {
        return tagService.getTags();
    }
}
