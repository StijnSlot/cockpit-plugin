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
  public ProcessInstanceResource getProcessInstanceResource(@PathParam("engineName") String engineName) {
    return subResource(new ProcessInstanceResource(engineName), engineName);
  }

  @Path("{engineName}/process-activity")
  public ProcessInstanceActivityResource getProcessInstanceActivityResource(
          @PathParam("engineName") String engineName,
          @QueryParam("procDefId") String procDefId) {
    return subResource(new ProcessInstanceActivityResource(engineName, procDefId), engineName);
  }
}