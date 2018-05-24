package org.camunda.bpm.cockpit.plugin.centaur.db;

public class ExecutionSequenceCounterDto {

    private String instanceId;

    private int sequenceCounter;

    public String getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public int getSequenceCounter() {
        return sequenceCounter;
    }

    public void setSequenceCounter(int sequenceCounter) {
        this.sequenceCounter = sequenceCounter;
    }
}
