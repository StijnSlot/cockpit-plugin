package org.camunda.bpm.cockpit.plugin.sample.resources;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessStatisticsDto;

public class ProcessStatisticsResource extends AbstractCockpitPluginResource {

  public ProcessStatisticsResource(String engineName) {
    super(engineName);
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public List<ProcessStatisticsDto> getProcessStatistics() {
	  QueryParameters<ProcessStatisticsDto> queryParameters = new QueryParameters<>();

	  configureTenantCheck(queryParameters);

	  return getQueryService().executeQuery(
	          "cockpit.sample.selectProcessStatistics", queryParameters);
  }
}