package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.centaur.db.ActiveInstancesDto;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

public class RefreshResource extends AbstractCockpitPluginResource {

    /**
     * Stores the process definition id passed in the url
     */
    private String procDefId;

    /**
     * Constructor for the resource
     * @param engineName is passed from the creation
     * @param procDefId is the process definition
     *                  we want the active instances of
     */
    public RefreshResource(String engineName, String procDefId) {
        super(engineName);
        this.procDefId = procDefId;
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
        queryParameters.setParameter(this.procDefId);

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.query.selectActiveInstances", queryParameters);
    }
}
