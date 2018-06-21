package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.centaur.db.AssigneeDto;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.centaur.db.UserDto;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;

/**
 * JAX-RS Resource that handles statistics for users.
 *
 * @version 1.4
 */
public class UsersResource extends AbstractCockpitPluginResource {

    /**
     * Constructor for the resource.
     *
     * @param engineName The engine currently being used by the platform.
     */
    UsersResource(String engineName) {
        super(engineName);
    }

    /**
     * Handles the GET request to this url by returning a JAX-RS resource.
     *
     * @return A list of users and the statistics about their idle time , etc.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserDto> getUsers() {
        QueryParameters<UserDto> queryParameters = new QueryParameters<>();

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery("cockpit.query.resource.selectUsers", queryParameters);
    }

    /**
     * Creates the table required to store the statistics
     * and init table.
     */
    void createTable() {
        getQueryService().executeQuery("cockpit.query.resource.createTable", new QueryParameters<>());
        update();
    }

    /**
     * Updates the table with new entries if required.
     */
    void update() {
        setResources();
        updateAssignedTasks();
    }

    /**
     * Set the users in the resources table by deleting inactive users and adding new users.
     */
    private void setResources() {
        getQueryService().executeQuery("cockpit.query.resource.deleteResourceIds", new QueryParameters<>());
        getQueryService().executeQuery("cockpit.query.resource.addResourceIds", new QueryParameters<>());
    }

    /**
     * Updates the assigned tasks for each user in the ACT_RU_RESOURCE table.
     */
    private void updateAssignedTasks() {
        // Retrieve the already existing users in the table
        List<AssigneeDto> result = getQueryService().executeQuery("cockpit.query.resource.selectAssigned", new QueryParameters<>());
        // For each user
        for (AssigneeDto user : result) {
            boolean assigned = user.getCount() > 0;
            boolean prevAssigned = user.getPrevAssigned();

            // If prev assigned is same as current assigned, do nothing
            if (assigned == prevAssigned) continue;

            // Else update the table
            QueryParameters<Object> queryParameters = new QueryParameters<>();

            HashMap<String, String> param = new HashMap<>();
            param.put("id", user.getId());
            param.put("active", String.valueOf(user.getActive()));
            param.put("assigned", String.valueOf(assigned));
            param.put("prevAssigned", String.valueOf(prevAssigned));
            queryParameters.setParameter(param);

            configureTenantCheck(queryParameters);

            getQueryService().executeQuery("cockpit.query.resource.updateAssigned", queryParameters);
        }
    }

    /**
     * A POST request to the path plugin/{engineName}/users/set-active/
     * with fields active and id triggers this function to set the field
     * active of the user with specified id to the specified active status.
     *
     * @param active Specifies if the user is active or not.
     * @param id     User id to set active field of.
     */
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

        getQueryService().executeQuery("cockpit.query.resource.updateActive", queryParameters);
    }
}
