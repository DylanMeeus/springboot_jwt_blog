package com.example;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * A Controller for our user-actions
 */

@RestController
public class UserController
{

    @RequestMapping("/users") /* Map all HTTP operations by default */
    public User getUsers(){

    }

}
