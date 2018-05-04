package org.camunda.bpm.cockpit.plugin.sample.db;

public class ProcessActivityDto {

    private String name;

    private int absFrequency;

    private int avgDuration;

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
}
