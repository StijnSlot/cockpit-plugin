package org.camunda.bpm.cockpit.plugin.sample.db;

public class ProcessStatisticsDto {

  private String key;

  private String name;

  private int instanceCount;

  private int maxDuration;

  private int maxFrequency;

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

  public int getMaxDuration() {
    return maxDuration;
  }

  public void setMaxDuration(int maxDuration) {
    this.maxDuration = maxDuration;
  }

  public int getMaxFrequency() {
    return maxFrequency;
  }

  public void setMaxFrequency(int maxFrequency) {
    this.maxFrequency = maxFrequency;
  }
}