package uni.it.stdmanager.modules.teamone.permissions.repository;

import uni.it.stdmanager.modules.teamone.permissions.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {

    List<Permission> findByNameContainingIgnoreCaseAndDeletedAtIsNull(String name);

    List<Permission> findByCodeContainingIgnoreCaseAndDeletedAtIsNull(String code);

    List<Permission> findByModuleAndDeletedAtIsNull(String module);

    List<Permission> findByIsActiveAndDeletedAtIsNull(Boolean isActive);

    List<Permission> findByDeletedAtIsNull();

    Optional<Permission> findByCodeAndDeletedAtIsNull(String code);

    Optional<Permission> findByIdAndDeletedAtIsNull(UUID id);

    Page<Permission> findByDeletedAtIsNull(Pageable pageable);

}
