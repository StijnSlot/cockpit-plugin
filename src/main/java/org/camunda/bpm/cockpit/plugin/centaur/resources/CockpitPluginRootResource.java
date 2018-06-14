package org.camunda.bpm.cockpit.plugin.centaur.resources;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;
import org.camunda.bpm.cockpit.plugin.centaur.CockpitPlugin;

import java.util.Timer;
import java.util.TimerTask;

@Path("plugin/" + CockpitPlugin.ID)
public class CockpitPluginRootResource extends AbstractCockpitPluginRootResource {

  private static Boolean init = false;

  public CockpitPluginRootResource() {
    super(CockpitPlugin.ID);
    synchronized (init) {
      if(!init) {
        init = true;
        UsersResource res = new UsersResource("default");
        res.createTable();
        res.setAssigned();

        Timer t = new Timer();
        t.scheduleAtFixedRate(new TimerTask() {
          @Override
          public void run() {
            System.out.println("run");
            new UsersResource("default").setAssigned();
          }
        }, 0, 10000);
      }
    }

  }

  @GET
  @Produces(MediaType.TEXT_PLAIN)
  public String getIt() {
    return "Got it!";
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
          @QueryParam("procDefId") String procDefId,
          @QueryParam("actId") String actId) {
    return subResource(new InstanceVariablesResource(engineName, procDefId, actId), engineName);
  }

  @Path("{engineName}/process-variables")
  public ProcessVariablesResource getProcessVariableResource(
          @PathParam("engineName") String engineName,
          @QueryParam("procDefId") String procDefId) {
    return subResource(new ProcessVariablesResource(engineName, procDefId), engineName);
  }

  @Path("{engineName}/instance-start-time")
  public InstanceStartTimeResource getInstanceStartTimeResource(
          @PathParam("engineName") String engineName) {
    return subResource(new InstanceStartTimeResource(engineName), engineName);
  }

  @Path("{engineName}/execution-sequence-counter")
  public ExecutionSequenceCounterResource getExecutionSequenceCounter(
          @PathParam("engineName") String engineName) {
    return subResource(new ExecutionSequenceCounterResource(engineName), engineName);
  }

  @Path("{engineName}/refresh")
  public RefreshResource getRefreshResource(
          @PathParam("engineName") String engineName,
          @QueryParam("procDefId") String procDefId) {
    return subResource(new RefreshResource(engineName, procDefId), engineName);
  }

  @Path("{engineName}/users")
  public UsersResource getUsers(
          @PathParam("engineName") String engineName) {
    return subResource(new UsersResource(engineName), engineName);
  }
}
