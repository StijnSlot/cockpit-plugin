package org.camunda.bpm.cockpit.plugin.centaur;

import java.util.*;

import org.camunda.bpm.cockpit.plugin.centaur.resources.CockpitPluginRootResource;
import org.camunda.bpm.cockpit.plugin.spi.impl.AbstractCockpitPlugin;

public class CockpitPlugin extends AbstractCockpitPlugin {

	public static final String ID = "centaur";

	public String getId() {
		return ID;
	}

	@Override
	public List<String> getMappingFiles() {
	    return Arrays.asList("org/camunda/bpm/cockpit/plugin/centaur/queries/query.xml",
			"org/camunda/bpm/cockpit/plugin/centaur/queries/resourceQuery.xml");
	}

	@Override
	public Set<Class<?>> getResourceClasses() {
	    Set<Class<?>> classes = new HashSet<>();

	    classes.add(CockpitPluginRootResource.class);

	    return classes;
	}
}
