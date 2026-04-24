package uni.it.stdmanager.modules.teamone.users.service;

import uni.it.stdmanager.modules.teamone.users.model.User;
import uni.it.stdmanager.modules.teamone.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findByDeletedAtIsNull();
    }

    public User getUserById(UUID id) {
        return userRepository.findByIdAndDeletedAtIsNull(id).orElse(null);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(UUID id, User userData) {
        User user = userRepository.findByIdAndDeletedAtIsNull(id).orElseThrow();

        if (userData.getUsername() != null && !userData.getUsername().isBlank()) {
            user.setUsername(userData.getUsername());
        }
        if (userData.getPasswordHash() != null && !userData.getPasswordHash().isBlank()) {
            user.setPasswordHash(userData.getPasswordHash());
        }
        if (userData.getFullName() != null) {
            user.setFullName(userData.getFullName());
        }
        if (userData.getEmail() != null) {
            user.setEmail(userData.getEmail());
        }
        if (userData.getPhone() != null) {
            user.setPhone(userData.getPhone());
        }
        if (userData.getIsActive() != null) {
            user.setIsActive(userData.getIsActive());
        }

        return userRepository.save(user);
    }

    public void deleteUser(UUID id) {
        deleteById(id);
    }

    public List<User> searchUsers(String name, String username, String email) {
        List<User> result = userRepository.findByDeletedAtIsNull();

        if (name != null && !name.isBlank()) {
            String nameKey = normalizeText(name);
            result = result.stream()
                    .filter(u -> u.getFullName() != null
                            && normalizeText(u.getFullName()).contains(nameKey))
                    .collect(Collectors.toList());
        }

        if (username != null && !username.isBlank()) {
            String usernameKey = normalizeText(username);
            result = result.stream()
                    .filter(u -> u.getUsername() != null
                            && normalizeText(u.getUsername()).contains(usernameKey))
                    .collect(Collectors.toList());
        }

        if (email != null && !email.isBlank()) {
            String emailKey = normalizeText(email);
            result = result.stream()
                    .filter(u -> u.getEmail() != null
                            && normalizeText(u.getEmail()).contains(emailKey))
                    .collect(Collectors.toList());
        }

        return result;
    }

    public List<User> getActiveUsers(Boolean isActive) {
        return userRepository.findByIsActiveAndDeletedAtIsNull(isActive);
    }

    public Page<User> getUsersPagination(int page, int size, String sort) {
        String[] sortArr = sort.split(",");
        String sortField = mapSortField(sortArr[0]);

        Sort sortObj = Sort.by(
                Sort.Direction.fromString(sortArr[1]),
                sortField);

        Pageable pageable = PageRequest.of(page, size, sortObj);

        return userRepository.findByDeletedAtIsNull(pageable);
    }

    public User lockUser(UUID id) {
        User user = userRepository.findByIdAndDeletedAtIsNull(id).orElseThrow();
        user.setIsActive(false);
        return userRepository.save(user);
    }

    public User unlockUser(UUID id) {
        User user = userRepository.findByIdAndDeletedAtIsNull(id).orElseThrow();
        user.setIsActive(true);
        return userRepository.save(user);
    }

    public void deleteById(UUID id) {
        User user = userRepository.findByIdAndDeletedAtIsNull(id).orElseThrow();
        if (user.getDeletedAt() == null) {
            user.setDeletedAt(LocalDateTime.now());
        }
        userRepository.save(user);
    }

    private String mapSortField(String field) {
        if ("full_name".equalsIgnoreCase(field)) {
            return "fullName";
        }
        if ("is_active".equalsIgnoreCase(field)) {
            return "isActive";
        }
        return field;
    }

    private String normalizeText(String input) {
        if (input == null)
            return "";
        String lower = input.trim().toLowerCase();
        String normalized = Normalizer.normalize(lower, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }
}
