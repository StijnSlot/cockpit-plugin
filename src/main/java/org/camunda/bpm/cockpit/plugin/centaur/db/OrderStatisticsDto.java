package org.camunda.bpm.cockpit.plugin.centaur.db;

public class OrderStatisticsDto {
    private Long maxDuration;

    private Long avgDuration;

    public Long getAvgDuration() {
        return avgDuration;
    }

    public void setAvgDuration(Long avgDuration) {
        this.avgDuration = avgDuration;
    }

    public Long getMaxDuration() {
        return maxDuration;
    }

    public void setMaxDuration(Long maxDuration) {
        this.maxDuration = maxDuration;
    }
}
