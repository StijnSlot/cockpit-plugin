package org.camunda.bpm.cockpit.plugin.centaur;

import org.camunda.bpm.cockpit.Cockpit;
import org.camunda.bpm.cockpit.plugin.spi.CockpitPlugin;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.junit.Assert;
import org.junit.Test;

/**
*
* @author nico.rehwaldt
*/
public class CockpitPluginTest extends AbstractCockpitPluginTest {

  @Test
  public void testPluginDiscovery() {
    @SuppressWarnings("deprecation")
	CockpitPlugin cockpitPlugin = Cockpit.getRuntimeDelegate().getPluginRegistry().getPlugin("centaur");

    Assert.assertNotNull(cockpitPlugin);
  }
}