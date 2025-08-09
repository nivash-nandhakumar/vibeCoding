
package com.example.demo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Data {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long content_Id;

    private String username;
    private String content;
}
