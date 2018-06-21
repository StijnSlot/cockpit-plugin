package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.centaur.db.ProcessStatisticsDto;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Resource returning the max and avg duration of a process definiton id.
 *
 * @version 1.0
 */
public class ProcessStatisticsResource extends AbstractCockpitPluginResource {

    private String procDefId;

    /**
     * Constructor for this resource.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  A process definition id.
     */
    ProcessStatisticsResource(String engineName, String procDefId) {
        super(engineName);
        this.procDefId = procDefId;
    }

    /**
     * A JAX-RS function when a GET request is made to the {engineName}/order-statistics path.
     *
     * @return A list containing the max and the avg of the running instances
     * of the given process definition id.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProcessStatisticsDto> getOrderStatistics() {
        QueryParameters<ProcessStatisticsDto> queryParameters = new QueryParameters<>();

        queryParameters.setParameter(procDefId);
        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectProcessStatistics", queryParameters);
    }
}
