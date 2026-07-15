package com.tenalink.auth.repository;
import com.tenalink.auth.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByFaydaId(String faydaId);
    List<UserEntity> findByRoleOrderByCreatedAtDesc(String role);
    long countByRole(String role);
    List<UserEntity> findAllByOrderByCreatedAtDesc();
}
