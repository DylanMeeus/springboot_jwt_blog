package com.example;

/**
 * POJO class
 */
public class User
{
    private String firstName;
    private String lastName;

    public User(String first, String last){
        firstName = first;
        lastName = last;
    }

    public String getFirstName(){
        return firstName;
    }

    public String getLastName(){
        return lastName;
    }
}
