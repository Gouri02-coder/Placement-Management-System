package com.placement.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendAbsentInterviewEmail(String toEmail, String studentName, String companyName, String interviewDate) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Interview Absence Notification");
        message.setText(
                "Dear " + studentName + ",\n\n" +
                "You were marked ABSENT for your interview.\n\n" +
                "Company: " + companyName + "\n" +
                "Interview Date: " + interviewDate + "\n\n" +
                "If this is incorrect, please contact the placement cell.\n\n" +
                "Regards,\n" +
                "Placement Management System"
        );

        mailSender.send(message);
    }
}