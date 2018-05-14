package org.camunda.bpm.cockpit.plugin.db;

public class ProcessActivityDto {

    private String name;

    private Integer absFrequency;

    private Integer avgDuration;

    private Integer minDuration;

    private Integer maxDuration;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
