package uni.it.stdmanager.modules.i_auth.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "Thông tin phản hồi sau đăng nhập")
public class AuthResponse {

    @Schema(description = "Mã thông báo JWT")
    private String accessToken;

    @Schema(description = "Loại mã thông báo", example = "Bearer")
    private String tokenType;

    @Schema(description = "Tên đăng nhập")
    private String username;

    @Schema(description = "Họ và tên")
    private String fullName;

    @Schema(description = "Danh sách vai trò")
    private List<String> roles;
}
