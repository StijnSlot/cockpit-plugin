package org.camunda.bpm.cockpit.plugin.sample.db;

public class ProcessInstanceActivityDto {

    private String name;

    private int processActivityDurationAvg;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getProcessActivityDurationAvg() {
        return processActivityDurationAvg;
    }

    public void setProcessActivityDurationAvg(int processActivityDurationAvg) {
        this.processActivityDurationAvg = processActivityDurationAvg;
    }
}
