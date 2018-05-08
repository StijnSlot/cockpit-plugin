package org.camunda.bpm.cockpit.plugin.sample.db;

import java.sql.Timestamp;

public class InstanceStartTimeDto {

    private String instanceId;

    private Timestamp startTime;

    public String getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }
}
