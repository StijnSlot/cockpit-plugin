package org.camunda.bpm.cockpit.plugin.sample;

import java.util.List;

import org.camunda.bpm.cockpit.Cockpit;
import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessActivityDto;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessInstanceCountDto;
import org.camunda.bpm.cockpit.plugin.spi.CockpitPlugin;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.junit.Assert;
import org.junit.Test;

/**
*
* @author nico.rehwaldt
*/
public class SamplePluginTest extends AbstractCockpitPluginTest {

  @Test
  public void testPluginDiscovery() {
    @SuppressWarnings("deprecation")
	CockpitPlugin samplePlugin = Cockpit.getRuntimeDelegate().getPluginRegistry().getPlugin("sample-plugin");

    Assert.assertNotNull(samplePlugin);
  }

  @Test
  public void testProcessInstanceQueryWorks() {

    List<ProcessInstanceCountDto> instanceCounts =
      getQueryService()
        .executeQuery(
          "cockpit.sample.selectProcessInstanceCountsByProcessDefinition",
          new QueryParameters<ProcessInstanceCountDto>());

    Assert.assertEquals(0, instanceCounts.size());
  }

  @Test
  public void testProcessInstanceActivityQueryWorks() {

    QueryParameters<ProcessActivityDto> parameters = new QueryParameters<ProcessActivityDto>();
    parameters.setParameter("");

    List<ProcessActivityDto> instanceCounts =
      getQueryService()
        .executeQuery(
        "cockpit.sample.selectProcessActivityStatistics",
         parameters);

    Assert.assertEquals(0, instanceCounts.size());
  }

}