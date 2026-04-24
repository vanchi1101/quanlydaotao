package uni.it.stdmanager.modules.i_auth.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import java.util.Set;
import java.util.HashSet; // Nên khởi tạo tập hợp trống

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleAuth extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String code; // Ví dụ: ADMIN, GIANGVIEN

    @Column(nullable = false, length = 100)
    private String name; // Ví dụ: Quản trị viên

    @Column(length = 255)
    private String description;

    @Builder.Default // Thêm annotation này để giữ giá trị mặc định khi dùng Builder
    @Column(name = "is_system")
    private Boolean isSystem = false; // Vai trò hệ thống không được xóa

    @Builder.Default // Khởi tạo tập hợp trống để tránh null khi build
    @OneToMany(mappedBy = "role")
    @JsonIgnore // Ngắt vòng lặp tại đây
    @Schema(hidden = true) // Thêm dòng này
    private Set<UserRoleAuth> userRoles = new HashSet<>();
}