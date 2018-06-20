package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.centaur.db.OrderStatisticsDto;
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
public class OrderStatisticsResource extends AbstractCockpitPluginResource {

    private String procDefId;

    /**
     * Constructor for this resource.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  A process definition id.
     */
    OrderStatisticsResource(String engineName, String procDefId) {
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
    public List<OrderStatisticsDto> getOrderStatistics() {
        QueryParameters<OrderStatisticsDto> queryParameters = new QueryParameters<>();

        queryParameters.setParameter(procDefId);
        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectOrderStatistics", queryParameters);
    }
}
