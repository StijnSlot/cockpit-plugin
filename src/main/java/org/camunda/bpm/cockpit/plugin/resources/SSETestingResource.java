package org.camunda.bpm.cockpit.plugin.resources;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import java.io.IOException;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.sse.Sse;
import javax.ws.rs.sse.SseEventSink;

public class SSETestingResource extends AbstractCockpitPluginResource {

    public SSETestingResource(String engineName) {
        super(engineName);
    }

    @GET
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public List<Object> subscribe(@Context SseEventSink sink, @Context Sse sse) throws IOException {
        List<Object> query = null;
        SingletonBroadcast ss = SingletonBroadcast.getInstance();
        ss.setBroadcaster(sse.newBroadcaster());
        ss.setMessage(sse);
        ss.getBroadcaster().register(sink);
        if (!ss.getTrigger()) {
            query = getQueryService().executeQuery("cockpit.query.createMyTrigger", new QueryParameters<Object>());
            ss.setTrigger();
        }
        return query;
    }
    
    @GET 
    @Path("hello/")
    public void send() {
        getQueryService().executeQuery("makeChangesInTheTable", new QueryParameters<Object>());
    }
 }