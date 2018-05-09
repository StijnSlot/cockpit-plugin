package org.camunda.bpm.cockpit.plugin.sample.resources;

import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;
import org.camunda.bpm.cockpit.plugin.sample.SamplePlugin;

@Path("plugin/" + SamplePlugin.ID)
public class SamplePluginRootResource extends AbstractCockpitPluginRootResource {

  public SamplePluginRootResource() {
    super(SamplePlugin.ID);
  }

  @Path("{engineName}/process-instance")
  public ProcessStatisticsResource getProcessInstanceResource(
          @PathParam("engineName") String engineName) {
    return subResource(new ProcessStatisticsResource(engineName), engineName);
  }

  @Path("{engineName}/process-activity")
  public ProcessActivityResource getProcessInstanceActivityResource(
          @PathParam("engineName") String engineName,
          @QueryParam("procDefId") String procDefId) {
    return subResource(new ProcessActivityResource(engineName, procDefId), engineName);
  }

  @Path("{engineName}/instance-variables")
  public InstanceVariablesResource getInstanceVariableResource(
          @PathParam("engineName") String engineName,
          @QueryParam("executionId") String executionId,
          @QueryParam("caseExecutionId") String caseExecutionId,
          @QueryParam("taskId") String taskId) {
    return subResource(new InstanceVariablesResource(engineName, executionId, caseExecutionId, taskId),
            engineName);
  }

  @Path("{engineName}/instance-start-time")
  public InstanceStartTimeResource getInstanceVariableResource(
          @PathParam("engineName") String engineName) {
    return subResource(new InstanceStartTimeResource(engineName), engineName);
  }

  @Path("{engineName}/sse")
  public SSETestingResource getSSETestingResource(
          @PathParam("engineName") String engineName) {
    return subResource(new SSETestingResource(engineName), engineName);
  }
}