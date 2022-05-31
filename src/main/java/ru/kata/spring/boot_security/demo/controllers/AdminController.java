package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.exceptions.BindingResultInfo;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public ResponseEntity<Set<User>> showAllUsers() {
        return new ResponseEntity<>(userService.listUsers(), HttpStatus.OK);
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<User> showUserById(@PathVariable long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @GetMapping("/admin/user")
    public ResponseEntity<User> getUserByUsername(Principal principal) {
        User user = userService.findByEmail(principal.getName()).get();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @PostMapping("/admin")
    private ResponseEntity<BindingResultInfo> createUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        return getBindingResultExceptionResponseEntity(user, bindingResult);

    }

    @PutMapping("/admin/{id}")
    private ResponseEntity<BindingResultInfo> updateUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        return getBindingResultExceptionResponseEntity(user, bindingResult);
    }

    private ResponseEntity<BindingResultInfo> getBindingResultExceptionResponseEntity(@RequestBody @Valid User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {

            String message = bindingResult.getFieldErrors()
                    .stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining("; "));
            return new ResponseEntity<>(new BindingResultInfo(message), HttpStatus.BAD_REQUEST);
        }
        try {
            userService.saveUser(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>(new BindingResultInfo("Данная эл.почта уже используется!"), HttpStatus.BAD_REQUEST);
        }
    }
}
