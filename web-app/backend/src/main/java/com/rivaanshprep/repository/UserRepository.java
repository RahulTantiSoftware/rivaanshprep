package com.rivaanshprep.repository;

import com.rivaanshprep.entity.Role;
import com.rivaanshprep.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:identifier) OR LOWER(u.username) = LOWER(:identifier)")
    Optional<User> findByEmailOrUsername(@Param("identifier") String identifier);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    long countByRole(Role role);

    long countByActiveTrue();

    long countBySubscriptionStatus(String subscriptionStatus);

    @Query("SELECT u FROM User u WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY u.createdAt DESC")
    List<User> searchUsers(@Param("query") String query);
}
