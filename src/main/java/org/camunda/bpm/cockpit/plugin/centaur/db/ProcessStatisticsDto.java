package org.camunda.bpm.cockpit.plugin.centaur.db;

public class ProcessStatisticsDto {

  private String id;

  private String name;

  private Long instanceCount;

  private Long maxDuration;

  private Long maxFrequency;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Long getInstanceCount() {
    return instanceCount;
  }

  public void setInstanceCount(Long instanceCount) {
    this.instanceCount = instanceCount;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getMaxDuration() {
    return maxDuration;
  }

  public void setMaxDuration(Long maxDuration) {
    this.maxDuration = maxDuration;
  }

  public Long getMaxFrequency() {
    return maxFrequency;
  }

  public void setMaxFrequency(Long maxFrequency) {
    this.maxFrequency = maxFrequency;
  }
}