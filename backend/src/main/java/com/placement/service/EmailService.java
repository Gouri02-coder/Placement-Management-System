package com.placement.service;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
    void sendAbsentInterviewEmail(String toEmail, String studentName, String companyName, String interviewDate);
}