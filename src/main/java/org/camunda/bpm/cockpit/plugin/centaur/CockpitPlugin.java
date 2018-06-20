package org.camunda.bpm.cockpit.plugin.centaur;

import java.util.*;

import org.camunda.bpm.cockpit.plugin.centaur.resources.CockpitPluginRootResource;
import org.camunda.bpm.cockpit.plugin.spi.impl.AbstractCockpitPlugin;

/**
 * Main Cockpit Plugin class that gets called by Camunda.
 */
public class CockpitPlugin extends AbstractCockpitPlugin {

    public static final String ID = "centaur";

    public String getId() {
        return ID;
    }

    /**
     * Returns the files storing the queries.
     *
     * @return List of files storing the queries.
     */
    @Override
    public List<String> getMappingFiles() {
        return Arrays.asList("org/camunda/bpm/cockpit/plugin/centaur/queries/query.xml",
                "org/camunda/bpm/cockpit/plugin/centaur/queries/resourceQuery.xml");
    }

    /**
     * Returns a set of all the resources of the plugin.
     *
     * @return {Set} A set storing all the sub resources
     * stored in the CockpitPluginRootResource.
     */
    @Override
    public Set<Class<?>> getResourceClasses() {
        Set<Class<?>> classes = new HashSet<>();

        classes.add(CockpitPluginRootResource.class);

        return classes;
    }
}
