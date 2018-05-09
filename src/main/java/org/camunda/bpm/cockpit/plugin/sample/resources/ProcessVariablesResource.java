package org.camunda.bpm.cockpit.plugin.sample.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.sample.db.InstanceVariablesDto;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

public class ProcessVariablesResource extends AbstractCockpitPluginResource {

    private String procDefId;

    public ProcessVariablesResource(String engineName, String procDefId) {
        super(engineName);
        this.procDefId = procDefId;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<InstanceVariablesDto> getInstanceVariableStatistics() {
        QueryParameters<InstanceVariablesDto> queryParameters = new QueryParameters<>();
        queryParameters.setParameter(procDefId);

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.sample.selectProcessVariables", queryParameters);
    }
}
