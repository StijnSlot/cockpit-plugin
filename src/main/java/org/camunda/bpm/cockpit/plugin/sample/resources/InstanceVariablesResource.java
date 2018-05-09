package org.camunda.bpm.cockpit.plugin.sample.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.sample.db.InstanceVariablesDto;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InstanceVariablesResource extends AbstractCockpitPluginResource {

    Map<String, String> param;

    public InstanceVariablesResource(String engineName, String exId, String caExId, String taskId) {
        super(engineName);
        param = new HashMap<>();

        param.put("executionId", exId);
        param.put("caseExecutionId", caExId);
        param.put("taskId", taskId);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<InstanceVariablesDto> getInstanceVariableStatistics() {
        QueryParameters<InstanceVariablesDto> queryParameters = new QueryParameters<>();
        queryParameters.setParameter(param);

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.sample.selectInstanceVariables", queryParameters);
    }
}
