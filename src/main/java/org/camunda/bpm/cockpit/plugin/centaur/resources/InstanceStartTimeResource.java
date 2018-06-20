package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.centaur.db.InstanceStartTimeDto;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Resource returning process instances and
 * their start time of a process definition.
 *
 * @version 1.0
 */
public class InstanceStartTimeResource extends AbstractCockpitPluginResource {

    private String procDefId;

    /**
     * Constructor of the resource.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of the process definition.
     */
    InstanceStartTimeResource(String engineName, String procDefId) {
        super(engineName);
        this.procDefId = procDefId;
    }

    /**
     * A JAX-RS GET request to this function
     * returns a list of instances and their start time.
     *
     * @return A list of the instances and the start time associated
     * with the process definition.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<InstanceStartTimeDto> InstanceStartTime() {
        QueryParameters<InstanceStartTimeDto> queryParameters = new QueryParameters<>();

        queryParameters.setParameter(procDefId);
        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectInstanceStartTime", queryParameters);
    }
}
