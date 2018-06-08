package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RefreshResource extends AbstractCockpitPluginResource {

    private static HashMap<String,ArrayList<String>> map = new HashMap<String,ArrayList<String>>();
    private String procDefId;

    /**
     * Constructor for the resource
     * @param engineName is passed from the creation
     */
    public RefreshResource(String engineName, String procDefId) {
        super(engineName);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void checkRefresh() {

    }
}
