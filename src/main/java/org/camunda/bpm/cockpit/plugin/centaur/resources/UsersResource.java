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
        getQueryService().executeQuery("cockpit.query.createTable", new QueryParameters<>());
        getQueryService().executeQuery("cockpit.query.addIds", new QueryParameters<>());
    }

    @Path("set-active")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void setActive(
            @FormParam("active") String active,
            @FormParam("id") String id) {
        QueryParameters<Object> queryParameters = new QueryParameters<>();

        HashMap<String, String> param = new HashMap<>();
        param.put("active", active);
        param.put("id", id);
        queryParameters.setParameter(param);

        configureTenantCheck(queryParameters);

        getQueryService().executeQuery("cockpit.query.updateActive", queryParameters);
    }

    @Path("set-assigned")
    @GET
    public void setAssigned() {
        List<AssigneeDto> result = getQueryService().executeQuery("cockpit.query.selectAssigned", new QueryParameters<>());
        for(AssigneeDto element : result) {
            boolean assigned = element.getCount() > 0;
            boolean prevAssigned = element.getPrevAssigned();

            // if prev assigned is same as current assigned, do nothing
            if(assigned == prevAssigned) continue;

            QueryParameters<Object> queryParameters = new QueryParameters<>();

            HashMap<String, String> param = new HashMap<>();
            param.put("id", element.getId());
            param.put("active", String.valueOf(element.getActive()));
            param.put("assigned", String.valueOf(assigned));
            param.put("prevAssigned", String.valueOf(prevAssigned));
            queryParameters.setParameter(param);

            configureTenantCheck(queryParameters);

            getQueryService().executeQuery("cockpit.query.updateAssigned", queryParameters);
        }
    }

    void setTrigger() {
        getQueryService().executeQuery("cockpit.query.createTrigger", new QueryParameters<>());
    }
}
