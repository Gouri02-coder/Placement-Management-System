package com.placement.dto;

public class AttendanceDTO {
    private Long placementId;
    private String status;

    // Getters and Setters
    public Long getPlacementId() {
        return placementId;
    }

    public void setPlacementId(Long placementId) {
        this.placementId = placementId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}