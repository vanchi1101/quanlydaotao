package uni.it.stdmanager.modules.i_auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.i_auth.dto.AuthResponse;
import uni.it.stdmanager.modules.i_auth.dto.LoginRequest;
import uni.it.stdmanager.modules.i_auth.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "1. Auth Module", description = "Quản lý đăng nhập và xác thực hệ thống")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(
        summary = "Đăng nhập hệ thống", 
        description = "Tiếp nhận username/password và trả về JWT Token cùng thông tin người dùng"
    )
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Thực hiện đăng nhập thông qua Service
        AuthResponse authResponse = authService.login(loginRequest);
        
        // Trả về kết quả chuẩn hóa qua ApiResponse
        return ApiResponse.success(authResponse, "Đăng nhập thành công");
    }

    @GetMapping("/me")
    @Operation(
        summary = "Kiểm tra trạng thái xác thực", 
        description = "Sử dụng để xác minh Token hiện tại còn hiệu lực hay không"
    )
    public ApiResponse<String> checkToken() {
        return ApiResponse.success("Đã xác thực", "Token hiện tại vẫn còn hiệu lực");
    }
}