package uni.it.stdmanager.modules.teamone.user_role.repository;

import uni.it.stdmanager.modules.teamone.user_role.model.UserRole;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {
    Page<UserRole> findAll(Pageable pageable);

    List<UserRole> findByIsActiveTrue();

    List<UserRole> findByIsActive(Boolean isActive);

    Page<UserRole> findByIsActive(Boolean isActive, Pageable pageable);

    List<UserRole> findByUserId(UUID userId);

    List<UserRole> findByRoleId(UUID roleId);

    @Query("SELECT ur FROM UserRole ur WHERE ur.userId = :userId AND ur.deletedAt IS NULL")
    List<UserRole> findActiveRolesByUserId(UUID userId);
}
