package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.centaur.db.SequenceCounterDto;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

public class SequenceCounterResource extends AbstractCockpitPluginResource {

    SequenceCounterResource(String engineName) {
        super(engineName);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<SequenceCounterDto> ExecutionSequenceCounter() {
        QueryParameters<SequenceCounterDto> queryParameters = new QueryParameters<>();

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectSequenceCounter", queryParameters);
    }
}
