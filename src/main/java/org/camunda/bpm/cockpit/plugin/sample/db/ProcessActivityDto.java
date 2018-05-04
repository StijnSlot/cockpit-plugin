package org.camunda.bpm.cockpit.plugin.sample.db;

public class ProcessActivityDto {

    private String name;

    private int absFrequency;

    private int avgDuration;

    private int minDuration;

    private int maxDuration;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAvgDuration() {
        return avgDuration;
    }

    public void setAvgDuration(int avgDuration) {
        this.avgDuration = avgDuration;
    }

    public int getAbsFrequency() {
        return absFrequency;
    }

    public void setAbsFrequency(int absFrequency) {
        this.absFrequency = absFrequency;
    }

    public int getMinDuration() {
        return minDuration;
    }

    public void setMinDuration(int minDuration) {
        this.minDuration = minDuration;
    }

    public int getMaxDuration() {
        return maxDuration;
    }

    public void setMaxDuration(int maxDuration) {
        this.maxDuration = maxDuration;
    }
}
