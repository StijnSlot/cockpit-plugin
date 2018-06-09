package org.camunda.bpm.cockpit.plugin.centaur.db;

public class ProcessActivityDto {

    private String id;

    private Long absFrequency;

    private Long avgDuration;

    private Long minDuration;

    private Long maxDuration;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getAvgDuration() {
        return avgDuration;
    }

    public void setAvgDuration(Long avgDuration) {
        this.avgDuration = avgDuration;
    }

    public Long getAbsFrequency() {
        return absFrequency;
    }

    public void setAbsFrequency(Long absFrequency) {
        this.absFrequency = absFrequency;
    }

    public Long getMinDuration() {
        return minDuration;
    }

    public void setMinDuration(Long minDuration) {
        this.minDuration = minDuration;
    }

    public Long getMaxDuration() {
        return maxDuration;
    }

    public void setMaxDuration(Long maxDuration) {
        this.maxDuration = maxDuration;
    }
}
