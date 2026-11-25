package com.csit321g2.bainabai.trackwise.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csit321g2.bainabai.trackwise.entity.AttemptEntity;
import com.csit321g2.bainabai.trackwise.service.AttemptService;
import com.csit321g2.bainabai.trackwise.service.NameErrorResponse;

@RestController
@RequestMapping("/attempt/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AttemptController {

    @Autowired
    AttemptService service;

    public AttemptController() {
    }

    @PostMapping("/submitAttempt")
    public AttemptEntity submitAttempt(@RequestBody AttemptEntity attempt) {
        return service.submitAttempt(attempt);
    }

    @GetMapping("/getAttempt/{id}")
    public AttemptEntity getAttempt(@PathVariable int id) {
        return service.getAttempt(id);
    }

    @GetMapping("/getAttemptsByStudent/{studentId}")
    public List<AttemptEntity> getAttemptsByStudent(@PathVariable int studentId) {
        return service.getAttemptsByStudent(studentId);
    }

    @ExceptionHandler
    public ResponseEntity<NameErrorResponse> handleException(NoSuchElementException ex) {
        NameErrorResponse error = new NameErrorResponse();
        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.setMessage(ex.getMessage());
        error.setTimestamp(System.currentTimeMillis());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<NameErrorResponse> handleException(Exception ex) {
        NameErrorResponse error = new NameErrorResponse();
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setMessage(ex.getMessage());
        error.setTimestamp(System.currentTimeMillis());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

}
