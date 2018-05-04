package org.camunda.bpm.cockpit.plugin.sample.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessActivityDto;

import javax.ws.rs.GET;
import java.util.List;

public class ProcessActivityResource extends AbstractCockpitPluginResource {

    String procDefId;

    public ProcessActivityResource(String engineName, String procDefId) {
        super(engineName);
        this.procDefId = procDefId;
    }

    @GET
    public List<ProcessActivityDto> getProcessActivityStatistics() {
        QueryParameters<ProcessActivityDto> queryParameters = new QueryParameters<ProcessActivityDto>();
        queryParameters.setParameter(procDefId);
        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.sample.selectProcessActivityStatistics", queryParameters);
    }
}
