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

    public Timestamp getSequenceCounter() {
        return sequenceCounter;
    }

    public void setsequenceCounter(int sequenceCounter) {
        this.sequenceCounter = sequenceCounter;
    }


}
