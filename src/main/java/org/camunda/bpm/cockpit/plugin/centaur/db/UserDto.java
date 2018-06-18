package org.camunda.bpm.cockpit.plugin.centaur.db;

import java.sql.Timestamp;

public class UserDto {
    private String id;

    private String firstName;

    private String lastName;

    private Boolean active;

    private Boolean assigned;

    private Timestamp lastChange;

    private Long timeActive;

    private Long timeIdle;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getAssigned() {
        return assigned;
    }

    public void setAssigned(Boolean assigned) {
        this.assigned = assigned;
    }

    public Timestamp getLastChange() {
        return lastChange;
    }

    public void setLastChange(Timestamp lastChange) {
        this.lastChange = lastChange;
    }

    public Long getTimeActive() {
        return timeActive;
    }

    public void setTimeActive(Long timeActive) {
        this.timeActive = timeActive;
    }

    public Long getTimeIdle() {
        return timeIdle;
    }

    public void setTimeIdle(Long timeIdle) {
        this.timeIdle = timeIdle;
    }
}
