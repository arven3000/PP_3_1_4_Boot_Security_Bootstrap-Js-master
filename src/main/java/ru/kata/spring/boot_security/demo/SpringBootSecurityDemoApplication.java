package ru.kata.spring.boot_security.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import ru.kata.spring.boot_security.demo.dao.UserRepository;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.LinkedHashSet;
import java.util.List;

@SpringBootApplication
public class SpringBootSecurityDemoApplication implements CommandLineRunner {

    private final UserRepository userRepository;

    public SpringBootSecurityDemoApplication(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringBootSecurityDemoApplication.class, args);
    }

    @Override
    public void run(String... args) {
        User admin = new User("admin", "admin", 35, "admin@gmail.com",
                "+79992224466", "$2a$10$mho1WSFBpQDqSOBPVhcNlOUCUOKrWVOYCS8ntlZmpUTYw3B3lPlPe");
        admin.setRoles(new LinkedHashSet<>(List.of(new Role("ROLE_ADMIN"), new Role("ROLE_USER"))));
        userRepository.save(admin);
    }
}
