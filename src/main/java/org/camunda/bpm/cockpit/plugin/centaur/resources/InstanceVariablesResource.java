package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.centaur.db.InstanceVariablesDto;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InstanceVariablesResource extends AbstractCockpitPluginResource {

    private Map<String, String> param;

    public InstanceVariablesResource(String engineName, String procDefId, String actId) {
        super(engineName);
        param = new HashMap<>();
        param.put("procDefId", procDefId);
        param.put("actId", actId);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<InstanceVariablesDto> getInstanceVariableStatistics() {
        QueryParameters<InstanceVariablesDto> queryParameters = new QueryParameters<>();
        queryParameters.setParameter(param);

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectInstanceVariables", queryParameters);
    }
}
