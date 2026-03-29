package uni.it.stdmanager.modules.i_auth.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;

@Entity
@Table(name = "user_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRole extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Ngắt việc quét ngược lại User để tránh lỗi 500 và vòng lặp
    @Schema(hidden = true) // Thêm dòng này
    private User user;

    @ManyToOne(fetch = FetchType.EAGER) // Giữ EAGER để lấy quyền ngay lập tức
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
}