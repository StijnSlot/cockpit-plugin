package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.centaur.db.ProcessActivityDto;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Resource returning statistics of the process definition.
 *
 * @version 1.0
 */
public class ProcessActivityResource extends AbstractCockpitPluginResource {

    private String procDefId;

    /**
     * Constructor of the resource.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of the process definition.
     */
    ProcessActivityResource(String engineName, String procDefId) {
        super(engineName);
        this.procDefId = procDefId;
    }

    /**
     * A JAX-RS GET request to this url produces a list of statistics about
     * the process definition.
     *
     * @return The list of statistics about the process definitions.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProcessActivityDto> getProcessActivityStatistics() {
        QueryParameters<ProcessActivityDto> queryParameters = new QueryParameters<>();
        queryParameters.setParameter(procDefId);

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectProcessActivityStatistics", queryParameters);
    }
}
