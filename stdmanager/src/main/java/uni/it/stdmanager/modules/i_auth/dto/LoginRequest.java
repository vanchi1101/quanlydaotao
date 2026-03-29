package uni.it.stdmanager.modules.i_auth.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Yêu cầu đăng nhập")
public class LoginRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(max = 50, message = "Tên đăng nhập không quá 50 ký tự")
    @Schema(description = "Tên tài khoản", example = "admin")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    @Schema(description = "Mật khẩu người dùng", example = "Admin@123")
    private String password;
}
