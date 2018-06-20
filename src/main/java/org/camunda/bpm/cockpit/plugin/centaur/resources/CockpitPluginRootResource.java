package org.camunda.bpm.cockpit.plugin.centaur.resources;

import javax.ws.rs.*;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;
import org.camunda.bpm.cockpit.plugin.centaur.CockpitPlugin;

import java.util.Timer;
import java.util.TimerTask;

@Path("plugin/" + CockpitPlugin.ID)
public class CockpitPluginRootResource extends AbstractCockpitPluginRootResource {

  private static final Object lock = new Object();
  private static boolean init = false;
  private static Timer t = new Timer();

  public CockpitPluginRootResource() {
    super(CockpitPlugin.ID);

    // synchronized since it can sometimes create multiple copies somehow
    synchronized (lock) {
      if(!init) {
        init = true;
        UsersResource res = new UsersResource("default");
        res.createTable();

        t.scheduleAtFixedRate(new TimerTask() {
          @Override
          public void run() {
            res.update();
          }
        }, 0, 10000);
      }
    }
  }

  @Path("{engineName}/process-activity")
  public ProcessActivityResource getProcessInstanceActivityResource(
          @PathParam("engineName") String engineName,
          @QueryParam("procDefId") String procDefId) {
    return subResource(new ProcessActivityResource(engineName, procDefId), engineName);
  }

  @Path("{engineName}/process-variables")
  public ProcessVariablesResource getProcessVariableResource(
          @PathParam("engineName") String engineName,
          @QueryParam("procDefId") String procDefId,
          @QueryParam("procInstanceId") String procInstId) {
    return subResource(new ProcessVariablesResource(engineName, procDefId, procInstId), engineName);
  }

  @Path("{engineName}/instance-start-time")
  public InstanceStartTimeResource getInstanceStartTimeResource(
          @PathParam("engineName") String engineName,
          @QueryParam("procDefId") String procDefId) {
    return subResource(new InstanceStartTimeResource(engineName, procDefId), engineName);
  }

  @Path("{engineName}/order-statistics")
  public OrderStatisticsResource getOrderStatistics(
          @PathParam("engineName") String engineName,
          @QueryParam("procDefId") String procDefId) {
    return subResource(new OrderStatisticsResource(engineName, procDefId), engineName);
  }

  @Path("{engineName}/execution-sequence-counter")
  public SequenceCounterResource getExecutionSequenceCounter(
          @PathParam("engineName") String engineName) {
    return subResource(new SequenceCounterResource(engineName), engineName);
  }

  @Path("{engineName}/refresh")
  public RefreshResource getRefreshResource(
          @PathParam("engineName") String engineName,
          @QueryParam("procDefId") String procDefId,
          @QueryParam("procInstId") String procInstId) {
    return subResource(new RefreshResource(engineName, procDefId, procInstId), engineName);
  }

  @Path("{engineName}/users")
  public UsersResource getUsers(
          @PathParam("engineName") String engineName) {
    return subResource(new UsersResource(engineName), engineName);
  }
}
