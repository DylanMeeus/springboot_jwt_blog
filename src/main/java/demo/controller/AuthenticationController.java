package controller;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class AuthenticationController {

    @RequestMapping("/login")
    private String login()
    {
        // return the JWT here?
        return "some JWT";
    }
}
