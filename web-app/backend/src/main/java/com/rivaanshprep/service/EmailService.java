package com.rivaanshprep.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:dev@rivaanshprep.local}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
        String subject = "RivaanshPrep: Password Reset Request";
        String content = "Hello,\n\n"
                + "You requested to reset your password for your RivaanshPrep Class 10 Math account.\n"
                + "Click the link below to set a new password:\n"
                + resetUrl + "\n\n"
                + "This link will expire in 30 minutes.\n"
                + "If you did not request this, please ignore this email and your account remains safe.\n\n"
                + "Warm regards,\nRivaanshPrep Security Team";

        log.info("==================================================================");
        log.info("🔑 [PASSWORD RESET LINK GENERATED]");
        log.info("To: {}", toEmail);
        log.info("Link: {}", resetUrl);
        log.info("Token: {}", resetToken);
        log.info("==================================================================");

        // If Gmail app password is provided, attempt SMTP transmission
        if (mailPassword != null && !mailPassword.trim().isEmpty()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                log.info("Password reset email sent successfully via SMTP to {}", toEmail);
            } catch (Exception e) {
                log.warn("Could not dispatch SMTP email (Link logged to console for testing): {}", e.getMessage());
            }
        }
    }
}
