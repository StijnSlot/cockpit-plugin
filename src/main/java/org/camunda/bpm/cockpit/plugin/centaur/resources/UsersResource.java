package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.centaur.db.AssigneeDto;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.centaur.db.UserDto;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;

public class UsersResource extends AbstractCockpitPluginResource {

    public UsersResource(String engineName) {
        super(engineName);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserDto> addActiveColumn() {
        QueryParameters<UserDto> queryParameters = new QueryParameters<>();

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery("cockpit.query.selectUsers", queryParameters);
    }

    /*@Path("create-table")
    @POST*/
    public void createTable() {
        QueryParameters<Object> queryParameters = new QueryParameters<>();

        configureTenantCheck(queryParameters);

        getQueryService().executeQuery("cockpit.query.createTable", queryParameters);
        getQueryService().executeQuery("cockpit.query.addIds", queryParameters);
    }

    @Path("set-active")
    @POST
    public void setActive(
            @QueryParam("active") String active,
            @QueryParam("id") String id) {
        QueryParameters<Object> queryParameters = new QueryParameters<>();

        HashMap<String, String> param = new HashMap<>();
        param.put("active", active);
        param.put("id", id);
        queryParameters.setParameter(param);

        configureTenantCheck(queryParameters);

        getQueryService().executeQuery("cockpit.query.updateActive", queryParameters);
    }

    public void setAssigned() {
        List<AssigneeDto> result = getQueryService().executeQuery("cockpit.query.selectAssigned", new QueryParameters<>());
        for(AssigneeDto element : result) {
            QueryParameters<Object> queryParameters = new QueryParameters<>();

            HashMap<String, String> param = new HashMap<>();
            param.put("id", element.getId());
            param.put("active", String.valueOf(element.getActive()));
            param.put("assigned", element.getCount() > 0 ? "true" : "false");
            param.put("prevAssigned", String.valueOf(element.getPrevAssigned()));

            queryParameters.setParameter(param);

            getQueryService().executeQuery("cockpit.query.updateAssigned", queryParameters);
        }
    }

    void setTrigger() {
        getQueryService().executeQuery("cockpit.query.createTrigger", new QueryParameters<>());
    }
}
