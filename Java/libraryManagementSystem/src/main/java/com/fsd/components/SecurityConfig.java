package com.fsd.components;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class SecurityConfig {
	
	private final JwtAuthFilter jwtAuthFilter;
	//spring scans all @configuration and finds a bean in CorsConfig.java
	private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }
	
	@Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http
	            .csrf(csrf -> csrf.disable())
	            //cors config bean
	            .cors(cors -> cors.configurationSource(corsConfigurationSource))
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers("/api/user/login", "/api/user/new", "/api/user/checkemail").permitAll()
	                .anyRequest().authenticated()
	            )
	            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
	            .build();
    }
}
