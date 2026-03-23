package com.placement.service.impl;

import com.placement.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (org.springframework.mail.MailException e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    @Override
    public void sendAbsentInterviewEmail(String toEmail, String studentName, String companyName, String interviewDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Interview Absence Notification");
        message.setText("Dear " + studentName + ",\n\n" +
                "We regret to inform you that you were marked as absent for your interview with " + companyName + " scheduled on " + interviewDate + ".\n\n" +
                "Please contact the placement office for further assistance.\n\n" +
                "Best regards,\nPlacement Management System");
        mailSender.send(message);
    }
}