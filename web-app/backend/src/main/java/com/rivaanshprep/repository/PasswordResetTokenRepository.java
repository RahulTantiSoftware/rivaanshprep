package com.rivaanshprep.repository;

import com.rivaanshprep.entity.PasswordResetToken;
import com.rivaanshprep.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByToken(String token);

    @Modifying
    @Query("UPDATE PasswordResetToken p SET p.used = true WHERE p.user = :user AND p.used = false")
    void invalidateAllByUser(@Param("user") User user);

    void deleteByUser(User user);
}
