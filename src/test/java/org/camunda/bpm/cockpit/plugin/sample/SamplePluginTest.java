package org.camunda.bpm.cockpit.plugin.sample;

import java.sql.SQLException;
import java.util.List;

import org.camunda.bpm.cockpit.Cockpit;
import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.db.QueryService;
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
  public void testSampleQueryWorks() {

    QueryService queryService = getQueryService();
    

    List<ProcessInstanceCountDto> instanceCounts =
      queryService
        .executeQuery(
          "cockpit.sample.selectProcessInstanceCountsByProcessDefinition",
          new QueryParameters<ProcessInstanceCountDto>());

    Assert.assertEquals(0, instanceCounts.size());
  }

  @Test(expected = SQLException.class)
  public void testTrigger(){

    getQueryService().executeQuery("createMyTrigger", new QueryParameters<Object>());
    getQueryService().executeQuery("makeChangesInTheTable", new QueryParameters<Object>());

  }

}