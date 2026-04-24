package uni.it.stdmanager.modules.i_auth.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAuth extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    // Quan hệ với bảng trung gian user_roles
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore // Thêm annotation này để Swagger không quét ngược lại
    @Schema(hidden = true)
    private Set<UserRoleAuth> userRoles;
}