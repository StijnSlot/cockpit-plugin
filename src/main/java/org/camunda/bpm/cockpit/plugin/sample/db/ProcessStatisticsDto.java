package org.camunda.bpm.cockpit.plugin.sample.db;

public class ProcessStatisticsDto {

  private String key;

  private String name;

  private Integer instanceCount;

  private Integer maxDuration;

  private Integer maxFrequency;

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public Integer getInstanceCount() {
    return instanceCount;
  }

  public void setInstanceCount(Integer instanceCount) {
    this.instanceCount = instanceCount;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getMaxDuration() {
    return maxDuration;
  }

  public void setMaxDuration(Integer maxDuration) {
    this.maxDuration = maxDuration;
  }

  public Integer getMaxFrequency() {
    return maxFrequency;
  }

  public void setMaxFrequency(Integer maxFrequency) {
    this.maxFrequency = maxFrequency;
  }
}