package uni.it.stdmanager.modules.teamone.role_permission.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uni.it.stdmanager.modules.teamone.role_permission.model.RolePermission;
import uni.it.stdmanager.modules.teamone.role_permission.repository.RolePermissionRepository;
import uni.it.stdmanager.modules.teamone.role_permission.service.RolePermissionService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class RolePermissionServiceImpl implements RolePermissionService {

    private final RolePermissionRepository repository;

    public RolePermissionServiceImpl(RolePermissionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<RolePermission> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public RolePermission getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi gán quyền"));
    }

    @Override
    public RolePermission assignPermission(UUID roleId, UUID permissionId) {
        // Kiểm tra trùng lặp (nếu cần có thể thêm validation)
        RolePermission rp = new RolePermission();
        rp.setId(UUID.randomUUID());
        rp.setRoleId(roleId);
        rp.setPermissionId(permissionId);
        rp.setCreatedAt(LocalDateTime.now());
        rp.setIsActive(true);
        // created_by = null hoặc lấy từ SecurityContext nếu có authentication
        return repository.save(rp);
    }

    @Override
    public RolePermission update(UUID id, RolePermission updateData) {
        RolePermission existing = getById(id);
        if (updateData.getPermissionId() != null) {
            existing.setPermissionId(updateData.getPermissionId());
        }
        // Có thể cập nhật roleId nếu cần, nhưng thường ít thay đổi
        existing.setUpdatedAt(LocalDateTime.now());
        return repository.save(existing);
    }

    @Override
    public void softDelete(UUID id) {
        RolePermission rp = getById(id);
        rp.setDeletedAt(LocalDateTime.now());
        rp.setIsActive(false);
        // deleted_by = null hoặc từ SecurityContext
        repository.save(rp);
    }

    @Override
    public List<RolePermission> getPermissionsByRole(UUID roleId) {
        return repository.findActivePermissionsByRoleId(roleId);
    }

    @Override
    public List<RolePermission> getRolesByPermission(UUID permissionId) {
        return repository.findActiveRolesByPermissionId(permissionId);
    }

    @Override
    public Page<RolePermission> searchByRoleId(UUID roleId, Pageable pageable) {
        // Có thể tinh chỉnh query nếu cần filter theo roleId
        // Hiện tại dùng findAll + filter trong service hoặc custom query
        return repository.findAll(pageable); // hoặc implement custom nếu cần
    }

    @Override
    public RolePermission lock(UUID id) {
        RolePermission rp = getById(id);
        rp.setIsActive(false);
        rp.setUpdatedAt(LocalDateTime.now());
        return repository.save(rp);
    }

    @Override
    public RolePermission unlock(UUID id) {
        RolePermission rp = getById(id);
        rp.setIsActive(true);
        rp.setUpdatedAt(LocalDateTime.now());
        return repository.save(rp);
    }
}