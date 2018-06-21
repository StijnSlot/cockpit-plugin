package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.centaur.db.InstanceStartTimeDto;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Resource returning all start times of
 * process instances of a given process definition.
 *
 * @version 1.0
 */
public class ProcessInstanceStartTimeResource extends AbstractCockpitPluginResource {

    private String procDefId;

    /**
     * Constructor for the resource.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of a process definition.
     */
    ProcessInstanceStartTimeResource(String engineName, String procDefId) {
        super(engineName);
        this.procDefId = procDefId;
    }

    /**
     * A JAX-RS GET function that returns the process instance start time
     * of the given process definition id.
     *
     * @return A list of all process instances start times relating
     * to the process definition id.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<InstanceStartTimeDto> InstanceStartTime() {
        QueryParameters<InstanceStartTimeDto> queryParameters = new QueryParameters<>();

        queryParameters.setParameter(procDefId);
        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectProcessInstanceStartTime", queryParameters);
    }
}
