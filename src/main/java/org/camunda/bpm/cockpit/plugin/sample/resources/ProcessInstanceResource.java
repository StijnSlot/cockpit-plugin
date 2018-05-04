package org.camunda.bpm.cockpit.plugin.sample.resources;

import java.util.List;
import javax.ws.rs.GET;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessInstanceCountDto;
import org.camunda.bpm.engine.impl.QueryEntityRelationCondition;
import org.camunda.bpm.engine.impl.db.ListQueryParameterObject;
import org.camunda.bpm.engine.impl.interceptor.Command;
import org.camunda.bpm.engine.impl.interceptor.CommandContext;

public class ProcessInstanceResource extends AbstractCockpitPluginResource {

  public ProcessInstanceResource(String engineName) {
    super(engineName);
  }

  @GET
  public List<ProcessInstanceCountDto> getProcessInstanceCounts() {
	  QueryParameters<ProcessInstanceCountDto> queryParameters = new QueryParameters<ProcessInstanceCountDto>();
      configureTenantCheck(queryParameters);

	  return getQueryService().executeQuery(
	          "cockpit.sample.selectProcessInstanceCountsByProcessDefinition", queryParameters);
  }
}