package uni.it.stdmanager.modules.i_auth.entity;


import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import java.util.Set;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String code; // Ví dụ: ADMIN, GIANGVIEN

    @Column(nullable = false, length = 100)
    private String name; // Ví dụ: Quản trị viên

    @Column(length = 255)
    private String description;

    @Column(name = "is_system")
    private Boolean isSystem = false; // Vai trò hệ thống không được xóa

    @OneToMany(mappedBy = "role")
    private Set<UserRole> userRoles;
}