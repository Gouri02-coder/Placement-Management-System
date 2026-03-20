package com.placement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gps_logs")
public class GPSLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ptoEmail;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;

    // Constructors
    public GPSLog() {}

    public GPSLog(String ptoEmail, Double latitude, Double longitude, LocalDateTime timestamp) {
        this.ptoEmail = ptoEmail;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPtoEmail() { return ptoEmail; }
    public void setPtoEmail(String ptoEmail) { this.ptoEmail = ptoEmail; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}