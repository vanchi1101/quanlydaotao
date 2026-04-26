package uni.it.stdmanager.core.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import uni.it.stdmanager.core.security.JwtAuthenticationFilter;


import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.Arrays;
import java.util.List;



@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Cho phép phân quyền mức Method (ví dụ: @PreAuthorize)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter; // Khai báo biến này

    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                        // 1. Kích hoạt cấu hình CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            //             .authorizeHttpRequests(auth -> auth
            //     .requestMatchers("/api/v1/auth/**", "/v3/api-docs/**", "/swagger-ui/**", "/favicon.ico").permitAll()
            //     .anyRequest().authenticated()
            // );
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        // Thêm JWT Filter trước UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 2. Định nghĩa chi tiết các nguồn (Origin) được phép truy cập
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(List.of("http://localhost:5174", "http://localhost:5173"));
        
        // Cho phép các phương thức HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Cho phép các Header quan trọng, đặc biệt là Authorization cho JWT
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        
        // Cho phép gửi kèm thông tin xác thực (Credentials)
        configuration.setAllowCredentials(true);
        
        // Đặt thời gian Cache cho cấu hình CORS (ví dụ: 1 giờ)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
