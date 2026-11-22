package com.rivaanshprep.repository;

import com.rivaanshprep.entity.RefreshToken;
import com.rivaanshprep.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUserAndRevokedFalse(User user);

    List<RefreshToken> findAllByFamilyId(String familyId);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.user = :user AND r.revoked = false")
    void revokeAllByUser(@Param("user") User user);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.familyId = :familyId")
    void revokeAllByFamilyId(@Param("familyId") String familyId);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.user = :user AND r.id <> :currentSessionId AND r.revoked = false")
    void revokeOtherSessions(@Param("user") User user, @Param("currentSessionId") String currentSessionId);

    void deleteByUser(User user);

    void deleteByExpiresAtBefore(LocalDateTime now);
}
