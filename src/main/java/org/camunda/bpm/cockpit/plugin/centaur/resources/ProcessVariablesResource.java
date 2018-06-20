package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.centaur.db.ProcessVariablesDto;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;

/**
 * Resource returning all variables of the
 * process definition and process instance.
 *
 * @version 1.0
 */
public class ProcessVariablesResource extends AbstractCockpitPluginResource {

    private String procDefId;
    private String procInstId;

    /**
     * Constructor for the resource.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of the process definition.
     * @param procInstId The id of the process instance.
     */
    ProcessVariablesResource(String engineName, String procDefId, String procInstId) {
        super(engineName);
        this.procDefId = procDefId;
        this.procInstId = procInstId;
    }

    /**
     * A JAX-RS function that handles GET requests to the url.
     * On such a call, returns all the process variables of the
     * given procDefId and procInstId.
     *
     * @return A list of variables relating to the process instance
     * and process definition.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProcessVariablesDto> getInstanceVariableStatistics() {
        QueryParameters<ProcessVariablesDto> queryParameters = new QueryParameters<>();

        // Create parameter map and add to queryParameters
        HashMap<String, String> param = new HashMap<>();
        param.put("procDefId", procDefId);
        param.put("procInstId", procInstId);
        queryParameters.setParameter(param);

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectProcessVariables", queryParameters);
    }
}
