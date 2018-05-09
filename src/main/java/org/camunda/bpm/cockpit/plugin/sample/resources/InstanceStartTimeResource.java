package org.camunda.bpm.cockpit.plugin.sample.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.sample.db.InstanceStartTimeDto;
import org.camunda.bpm.cockpit.plugin.sample.db.InstanceVariablesDto;

import javax.ws.rs.GET;
import java.util.List;

public class InstanceStartTimeResource extends AbstractCockpitPluginResource {

    public InstanceStartTimeResource(String engineName) {
        super(engineName);
    }

    @GET
    public List<InstanceStartTimeDto> InstanceStartTime() {
        QueryParameters<InstanceStartTimeDto> queryParameters = new QueryParameters<>();

        configureTenantCheck(queryParameters);

        return getQueryService().executeQuery(
                "cockpit.sample.selectInstanceStartTime", queryParameters);
    }
}
