package uni.it.stdmanager.modules.teamone.user_role.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uni.it.stdmanager.modules.teamone.user_role.model.UserRole;
import uni.it.stdmanager.modules.teamone.user_role.repository.UserRoleRepository;
import uni.it.stdmanager.modules.teamone.user_role.service.UserRoleService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserRoleServiceImpl implements UserRoleService {

    private final UserRoleRepository repository;

    public UserRoleServiceImpl(UserRoleRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<UserRole> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public UserRole getById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy"));
    }

    @Override
    public UserRole assignRole(UUID userId, UUID roleId) {
        UserRole ur = new UserRole();
        ur.setId(UUID.randomUUID());
        ur.setUserId(userId);
        ur.setRoleId(roleId);
        ur.setCreatedAt(LocalDateTime.now());
        ur.setIsActive(true);
        // created_by = null hoặc lấy từ SecurityContext nếu có
        return repository.save(ur);
    }

    @Override
    public UserRole update(UUID id, UserRole updateData) {
        UserRole existing = getById(id);
        if (updateData.getRoleId() != null)
            existing.setRoleId(updateData.getRoleId());
        existing.setUpdatedAt(LocalDateTime.now());
        return repository.save(existing);
    }

    @Override
    public void softDelete(UUID id) {
        UserRole ur = getById(id);
        ur.setDeletedAt(LocalDateTime.now());
        ur.setIsActive(false);
        repository.save(ur);
    }

    @Override
    public List<UserRole> getRolesByUser(UUID userId) {
        return repository.findActiveRolesByUserId(userId);
    }

    @Override
    public List<UserRole> getUsersByRole(UUID roleId) {
        return repository.findByRoleId(roleId);
    }

    @Override
    public Page<UserRole> searchByUserId(UUID userId, Pageable pageable) {
        return repository.findByIsActive(true, pageable); // có thể tinh chỉnh query
    }

    @Override
    public List<UserRole> getByIsActive(Boolean isActive) {
        return repository.findByIsActive(isActive);
    }

    @Override
    public UserRole lock(UUID id) {
        UserRole ur = getById(id);
        ur.setIsActive(false);
        ur.setUpdatedAt(LocalDateTime.now());
        return repository.save(ur);
    }

    @Override
    public UserRole unlock(UUID id) {
        UserRole ur = getById(id);
        ur.setIsActive(true);
        ur.setUpdatedAt(LocalDateTime.now());
        return repository.save(ur);
    }
}
