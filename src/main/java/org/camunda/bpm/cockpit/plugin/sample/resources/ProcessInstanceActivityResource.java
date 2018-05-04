package org.camunda.bpm.cockpit.plugin.sample.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessInstanceActivityDto;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessInstanceCountDto;

import javax.ws.rs.GET;
import java.util.List;

public class ProcessInstanceActivityResource extends AbstractCockpitPluginResource {

    String procDefId;

    public ProcessInstanceActivityResource(String engineName, String procDefId) {
        super(engineName);
        this.procDefId = procDefId;
    }

    @GET
    public List<ProcessInstanceActivityDto> getProcessInstanceCounts() {
        QueryParameters<ProcessInstanceActivityDto> queryParameters = new QueryParameters<ProcessInstanceActivityDto>();
        queryParameters.setParameter(procDefId);
        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.sample.selectProcessInstanceAverageDurationPerActivity", queryParameters);
    }
}
