package org.camunda.bpm.cockpit.plugin.sample;

import java.util.List;

import org.camunda.bpm.cockpit.Cockpit;
import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessActivityDto;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessStatisticsDto;
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


}