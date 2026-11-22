package com.rivaanshprep;

import com.rivaanshprep.entity.Role;
import com.rivaanshprep.entity.User;
import com.rivaanshprep.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDefaultUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Seed Dedicated Backend-Only Administrator Account
            User admin = userRepository.findByUsername("admin")
                    .or(() -> userRepository.findByEmail("admin@rivaanshprep.com"))
                    .orElseGet(User::new);

            admin.setUsername("admin");
            admin.setEmail("admin@rivaanshprep.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@12345"));
            admin.setFullName("System Administrator");
            admin.setTargetBoard("Platform Administrator");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setActive(true);
            admin.setEmailVerified(true);
            admin.setSubscriptionPlan("PREMIUM");
            admin.setSubscriptionStatus("ACTIVE");
            userRepository.save(admin);

            // 2. Seed Demo Student
            if (!userRepository.existsByUsername("student10")) {
                User student = new User();
                student.setUsername("student10");
                student.setEmail("student10@rivaanshprep.com");
                student.setPasswordHash(passwordEncoder.encode("Password123!"));
                student.setFullName("Class 10 Student");
                student.setTargetBoard("CBSE Class 10");
                student.setRole(Role.ROLE_STUDENT);
                student.setActive(true);
                student.setEmailVerified(true);
                student.setSubscriptionPlan("FREE");
                student.setSubscriptionStatus("INACTIVE");
                userRepository.save(student);
            }

            // 3. Seed Sample Premium Student for realistic user management testing
            if (!userRepository.existsByUsername("aarav_sharma")) {
                User aarav = new User();
                aarav.setUsername("aarav_sharma");
                aarav.setEmail("aarav.sharma@rivaanshprep.com");
                aarav.setPasswordHash(passwordEncoder.encode("Password123!"));
                aarav.setFullName("Aarav Sharma");
                aarav.setTargetBoard("CBSE Class 10");
                aarav.setRole(Role.ROLE_STUDENT);
                aarav.setActive(true);
                aarav.setEmailVerified(true);
                aarav.setSubscriptionPlan("PREMIUM");
                aarav.setSubscriptionStatus("ACTIVE");
                userRepository.save(aarav);
            }
        };
    }
}
