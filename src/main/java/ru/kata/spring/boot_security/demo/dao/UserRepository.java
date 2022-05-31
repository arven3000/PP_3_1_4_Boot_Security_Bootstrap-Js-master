package ru.kata.spring.boot_security.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u join fetch u.roles")
    Set<User> getAll();

    @Query("SELECT u FROM User u join fetch u.roles where u.id=:id")
    User getUserById(Long id);

    @Query("SELECT u from User u join fetch u.roles where u.email=:email")
    Optional<User> findByEmail(@Param("email") String email);

}
