package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.centaur.db.ActiveInstancesDto;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;

public class RefreshResource extends AbstractCockpitPluginResource {

    /**
     * Stores the process definition id passed in the url
     */
    private String procDefId;

    /**
     * Stores the process instance id passed in the url
     */
    private String procInstId;

    /**
     * Constructor for the resource
     * @param engineName is passed from the creation
     * @param procDefId is the process definition
     *                  we want the active instances of
     */
    public RefreshResource(String engineName, String procDefId, String procInstId) {
        super(engineName);
        this.procDefId = procDefId;
        this.procInstId = procInstId;
    }

    /**
     * JXRS GET path on /refresh with parameter procDefId that returns
     * active instance ids
     * @return a list of all active instance ids of @param{procDefId}
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ActiveInstancesDto> checkRefresh() {
        QueryParameters<ActiveInstancesDto> queryParameters = new QueryParameters<>();

        HashMap<String, String> param = new HashMap<>();
        param.put("procDefId", procDefId);
        param.put("procInstId", procInstId);
        queryParameters.setParameter(param);

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectActiveInstances", queryParameters);
    }
}
