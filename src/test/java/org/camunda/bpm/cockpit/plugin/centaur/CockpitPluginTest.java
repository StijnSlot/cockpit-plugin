package org.camunda.bpm.cockpit.plugin.centaur;

import org.camunda.bpm.cockpit.Cockpit;
import org.camunda.bpm.cockpit.plugin.centaur.resources.CockpitPluginRootResource;
import org.camunda.bpm.cockpit.plugin.spi.CockpitPlugin;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.Set;

/**
*
* @author nico.rehwaldt
*/
public class CockpitPluginTest extends AbstractCockpitPluginTest {
  private CockpitPlugin cockpitPlugin;

  @Before
  public void init() {
    cockpitPlugin = Cockpit.getRuntimeDelegate().getPluginRegistry().getPlugin("centaur");
  }

  @Test
  public void testPluginDiscovery() {
    Assert.assertNotNull(cockpitPlugin);
  }

  @Test
  public void testGetMappingFiles() {
    List<String> mapFiles = cockpitPlugin.getMappingFiles();
    Assert.assertNotEquals(mapFiles.size(), 0);
  }

  @Test
  public void getResourceClasses() {
    @SuppressWarnings("deprecation")
    Set<Class<?>> classes = cockpitPlugin.getResourceClasses();
    Assert.assertTrue(classes.contains(CockpitPluginRootResource.class));
  }
}