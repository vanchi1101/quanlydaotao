package uni.it.stdmanager.modules.i_auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.security.JwtTokenProvider;
import uni.it.stdmanager.modules.i_auth.dto.AuthResponse;
import uni.it.stdmanager.modules.i_auth.dto.LoginRequest;
import uni.it.stdmanager.modules.i_auth.entity.UserAuth;
import uni.it.stdmanager.modules.i_auth.repository.UserRepositoryAuth;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final AuthenticationManager authenticationManager;
        private final UserRepositoryAuth userRepository;
        private final JwtTokenProvider tokenProvider;

        @Transactional(readOnly = true)
        public AuthResponse login(LoginRequest loginRequest) {
                // 1. Xác thực từ username và password
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                loginRequest.getUsername(),
                                                loginRequest.getPassword()));

                // 2. Set thông tin vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 3. Tạo JWT Token
                String jwt = tokenProvider.generateToken(authentication);

                // 4. Lấy thông tin User để trả về chi tiết (Roles, FullName)
                UserAuth user = userRepository.findByUsername(loginRequest.getUsername())
                                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại sau khi xác thực"));

                // 5. Chuyển đổi danh sách GrantedAuthority sang List<String>
                List<String> roles = authentication.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList());

                // 6. Trả về đối tượng AuthResponse chuẩn
                return AuthResponse.builder()
                                .accessToken(jwt)
                                .tokenType("Bearer")
                                .username(user.getUsername())
                                .fullName(user.getFullName())
                                .roles(roles)
                                .build();
        }
}