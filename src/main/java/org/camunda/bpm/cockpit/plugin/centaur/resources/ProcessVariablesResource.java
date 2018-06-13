package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.centaur.db.ProcessVariablesDto;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;

public class ProcessVariablesResource extends AbstractCockpitPluginResource {

    private String procDefId;

    private String procInstId;

    public ProcessVariablesResource(String engineName, String procDefId, String procInstId) {
        super(engineName);
        this.procDefId = procDefId;
        this.procInstId = procInstId;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProcessVariablesDto> getInstanceVariableStatistics() {
        QueryParameters<ProcessVariablesDto> queryParameters = new QueryParameters<>();

        // create parameter map and add to queryParameters
        HashMap<String, String> param = new HashMap<>();
        param.put("procDefId", procDefId);
        param.put("procInstId", procInstId);
        queryParameters.setParameter(param);

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectProcessVariables", queryParameters);
    }
}
