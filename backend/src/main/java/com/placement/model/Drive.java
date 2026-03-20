
package com.placement.model;

import jakarta.persistence.*;

@Entity
public class Drive {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String date;

    // getters/setters
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDate() { return date; } public void setDate(String date) { this.date = date; }
}
