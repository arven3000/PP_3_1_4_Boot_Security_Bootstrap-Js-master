package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.Optional;
import java.util.Set;

public interface UserService {
    void saveUser(User user);

    Set<User> listUsers();

    User getUserById(long id);

    void deleteUser(long id);

    Optional<User> findByEmail(String email);
}
