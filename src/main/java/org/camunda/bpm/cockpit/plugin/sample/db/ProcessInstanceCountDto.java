package org.camunda.bpm.cockpit.plugin.sample.db;

public class ProcessInstanceCountDto {

  private String key;

  private String name;

  private int instanceCount;

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public int getInstanceCount() {
    return instanceCount;
  }

  public void setInstanceCount(int instanceCount) {
    this.instanceCount = instanceCount;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}