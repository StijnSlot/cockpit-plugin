package org.camunda.bpm.cockpit.plugin.sample.db;

public class ProcessActivityDto {

    private String id;

    private Integer absFrequency;

    private Integer avgDuration;

    private Integer minDuration;

    private Integer maxDuration;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getAvgDuration() {
        return avgDuration;
    }

    public void setAvgDuration(Integer avgDuration) {
        this.avgDuration = avgDuration;
    }

    public Integer getAbsFrequency() {
        return absFrequency;
    }

    public void setAbsFrequency(Integer absFrequency) {
        this.absFrequency = absFrequency;
    }

    public Integer getMinDuration() {
        return minDuration;
    }

    public void setMinDuration(Integer minDuration) {
        this.minDuration = minDuration;
    }

    public Integer getMaxDuration() {
        return maxDuration;
    }

    public void setMaxDuration(Integer maxDuration) {
        this.maxDuration = maxDuration;
    }
}
