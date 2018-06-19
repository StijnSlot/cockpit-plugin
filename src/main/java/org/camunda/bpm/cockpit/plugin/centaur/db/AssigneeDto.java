package org.camunda.bpm.cockpit.plugin.centaur.db;

public class AssigneeDto {
    private String id;

    private Boolean active;

    private Boolean prevAssigned;

    private Integer count;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getPrevAssigned() {
        return prevAssigned;
    }

    public void setPrevAssigned(Boolean prevAssigned) {
        this.prevAssigned = prevAssigned;
    }
}
