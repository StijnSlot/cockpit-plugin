package org.camunda.bpm.cockpit.plugin.centaur.resources;

import javax.ws.rs.*;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;
import org.camunda.bpm.cockpit.plugin.centaur.CockpitPlugin;

import java.util.Timer;
import java.util.TimerTask;

/**
 * Root resource that calls all subsequent resources.
 * Default path of {url}/plugin.
 *
 * @version 1.4
 */
@Path("plugin/" + CockpitPlugin.ID)
public class CockpitPluginRootResource extends AbstractCockpitPluginRootResource {

    /**
     * Static variables required for updating user table.
     */
    private static final Object lock = new Object();
    private static boolean init = false;
    private static Timer t = new Timer();

    /**
     * Constructor for root resource. Calls the constructor of AbstractCockpitPluginRootResource.
     * Updates the user table every 10 seconds.
     */
    public CockpitPluginRootResource() {
        super(CockpitPlugin.ID);

        // Synchronized since it can sometimes create multiple copies
        synchronized (lock) {
            if (!init) {
                init = true;
                UsersResource res = new UsersResource("default");
                res.createTable();

                // Call the update function every 10 seconds
                t.scheduleAtFixedRate(new TimerTask() {
                    @Override
                    public void run() {
                        res.update();
                    }
                }, 0, 10000);
            }
        }
    }

    /**
     * Returns resource for path {engineName}/process-activity.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of a process definition.
     * @return List of statistics about the process definition with id = procDefId.
     */
    @Path("{engineName}/process-activity")
    public ProcessActivityResource getProcessInstanceActivityResource(
            @PathParam("engineName") String engineName,
            @QueryParam("procDefId") String procDefId) {
        return subResource(new ProcessActivityResource(engineName, procDefId), engineName);
    }

    /**
     * Returns resource for path {engineName}/process-variables.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of a process definition.
     * @param procInstId The id of a process instance.
     * @return List of all available variables for the instance.
     */
    @Path("{engineName}/process-variables")
    public ProcessVariablesResource getProcessVariableResource(
            @PathParam("engineName") String engineName,
            @QueryParam("procDefId") String procDefId,
            @QueryParam("procInstanceId") String procInstId) {
        return subResource(new ProcessVariablesResource(engineName, procDefId, procInstId), engineName);
    }

    /**
     * Returns resource for path {engineName}/instance-start-time.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of a process definition.
     * @return A list of all active instances of the process definition with
     * their respective start times.
     */
    @Path("{engineName}/instance-start-time")
    public InstanceStartTimeResource getInstanceStartTimeResource(
            @PathParam("engineName") String engineName,
            @QueryParam("procDefId") String procDefId) {
        return subResource(new InstanceStartTimeResource(engineName, procDefId), engineName);
    }

    /**
     * Returns resource for path {engineName}/order-statistics.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of a process definition.
     * @return A list containing the avg and max duration of the running instances
     * of the given process definition id.
     */
    @Path("{engineName}/order-statistics")
    public ProcessStatisticsResource getOrderStatistics(
            @PathParam("engineName") String engineName,
            @QueryParam("procDefId") String procDefId) {
        return subResource(new ProcessStatisticsResource(engineName, procDefId), engineName);
    }


    /**
     * Returns a resource for path {engineName}/execution-sequence-counter.
     *
     * @param engineName The engine currently being used by the platform.
     * @return A list of all process definitions that have a counter with their
     * respective counter.
     */
    @Path("{engineName}/execution-sequence-counter")
    public SequenceCounterResource getExecutionSequenceCounter(
            @PathParam("engineName") String engineName) {
        return subResource(new SequenceCounterResource(engineName), engineName);
    }

    /**
     * Returns a resource for path {engineName}/process-instance-start-time.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of a process definition.
     * @return A list of the process instance start times of the given process definition.
     */
    @Path("{engineName}/process-instance-start-time")
    public ProcessInstanceStartTimeResource getProcessInstanceStartTimes(
            @PathParam("engineName") String engineName,
            @QueryParam("procDefId") String procDefId) {
        return subResource(new ProcessInstanceStartTimeResource(engineName, procDefId), engineName);
    }

    /**
     * Returns a resource for path {engineName}/refresh.
     *
     * @param engineName The engine currently being used by the platform.
     * @param procDefId  The id of a process definition.
     * @param procInstId The id of a process instance.
     * @return A list of all active process instances and process definitions.
     */
    @Path("{engineName}/refresh")
    public RefreshResource getRefreshResource(
            @PathParam("engineName") String engineName,
            @QueryParam("procDefId") String procDefId,
            @QueryParam("procInstId") String procInstId) {
        return subResource(new RefreshResource(engineName, procDefId, procInstId), engineName);
    }

    /**
     * Returns a resource for the path {engineName}/users.
     *
     * @param engineName The engine currently being used by the platform.
     * @return A list of all users and their statistics regarding idle time, etc.
     */
    @Path("{engineName}/users")
    public UsersResource getUsers(
            @PathParam("engineName") String engineName) {
        return subResource(new UsersResource(engineName), engineName);
    }
}
