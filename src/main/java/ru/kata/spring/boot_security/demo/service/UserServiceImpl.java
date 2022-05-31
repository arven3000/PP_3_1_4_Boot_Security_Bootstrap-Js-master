package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.RoleRepository;
import ru.kata.spring.boot_security.demo.dao.UserRepository;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public void saveUser(User user) {

        Optional<User> userFromDB = userRepository.findByEmail(user.getEmail());

        Set<String> roles = user.getRoles().stream()
                .map(Role::getName).collect(Collectors.toSet());
        Set<Role> newRoles = new LinkedHashSet<>();
        for (Role role : roleRepository.findAll()) {
            if (roles.contains(role.getName().substring(5))) {
                newRoles.add(role);
            }
        }

        if (userFromDB.isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else if (!userFromDB.get().getPassword().equals(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        user.setRoles(newRoles);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    @Override
    public Set<User> listUsers() {
        return userRepository.getAll();
    }

    @Transactional(readOnly = true)
    @Override
    public User getUserById(long id) {
        return userRepository.getUserById(id);
    }

    @Transactional
    @Override
    public void deleteUser(long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

}
