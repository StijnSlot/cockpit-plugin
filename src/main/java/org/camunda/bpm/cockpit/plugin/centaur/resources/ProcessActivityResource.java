package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.centaur.db.ProcessActivityDto;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

public class ProcessActivityResource extends AbstractCockpitPluginResource {

    String procDefId;

    public ProcessActivityResource(String engineName, String procDefId) {
        super(engineName);
        this.procDefId = procDefId;
    }

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
