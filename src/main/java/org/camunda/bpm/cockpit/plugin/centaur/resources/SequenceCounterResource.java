package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.centaur.db.SequenceCounterDto;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Resource returning the counters for all processes.
 *
 * @version 1.0
 */
public class SequenceCounterResource extends AbstractCockpitPluginResource {

    /**
     * Constructor for this resource.
     *
     * @param engineName The engine currently being used by the platform.
     */
    SequenceCounterResource(String engineName) {
        super(engineName);
    }

    /**
     * A JAX-RS function when a GET request is made to the {engineName}/execution-sequence-counter.
     *
     * @return A list of all process definitions that require more than one instance to be completed
     * before moving to the next activities.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<SequenceCounterDto> ExecutionSequenceCounter() {
        QueryParameters<SequenceCounterDto> queryParameters = new QueryParameters<>();

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectSequenceCounter", queryParameters);
    }
}
