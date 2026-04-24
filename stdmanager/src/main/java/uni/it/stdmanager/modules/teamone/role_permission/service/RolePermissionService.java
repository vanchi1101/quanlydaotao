package uni.it.stdmanager.modules.teamone.role_permission.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import uni.it.stdmanager.modules.teamone.role_permission.model.RolePermission;

import java.util.List;
import java.util.UUID;

public interface RolePermissionService {

    Page<RolePermission> getAll(Pageable pageable);

    RolePermission getById(UUID id);

    RolePermission assignPermission(UUID roleId, UUID permissionId); // POST

    RolePermission update(UUID id, RolePermission updateData); // PUT

    void softDelete(UUID id); // DELETE (xóa mềm)

    List<RolePermission> getPermissionsByRole(UUID roleId);

    List<RolePermission> getRolesByPermission(UUID permissionId);

    Page<RolePermission> searchByRoleId(UUID roleId, Pageable pageable);

    RolePermission lock(UUID id);

    RolePermission unlock(UUID id);
}