package org.camunda.bpm.cockpit.plugin;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.camunda.bpm.cockpit.plugin.resources.CockpitPluginRootResource;
import org.camunda.bpm.cockpit.plugin.spi.impl.AbstractCockpitPlugin;

public class CockpitPlugin extends AbstractCockpitPlugin {
	
	public static final String ID = "cockpit-plugin";

	public String getId() {
		return ID;
	}
	
	@Override
	public List<String> getMappingFiles() {
	    return Arrays.asList("org/camunda/bpm/cockpit/plugin/queries/query.xml");
	}	
	
	@Override
	public Set<Class<?>> getResourceClasses() {
	    Set<Class<?>> classes = new HashSet<>();

	    classes.add(CockpitPluginRootResource.class);

	    return classes;
	}
}
