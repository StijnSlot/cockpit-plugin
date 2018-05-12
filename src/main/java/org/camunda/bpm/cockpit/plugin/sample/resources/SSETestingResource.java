package org.camunda.bpm.cockpit.plugin.sample.resources;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.cockpit.plugin.sample.resources.SingletonBroadcast;

import java.io.IOException;

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
    public void subscribe(@Context SseEventSink sink, @Context Sse sse) throws IOException {
        SingletonBroadcast ss = SingletonBroadcast.getInstance();
        ss.setBroadcaster(sse.newBroadcaster());
        ss.setMessage(sse);
        ss.getBroadcaster().register(sink);
    }
    
    @GET 
    @Path("hello/")
    public void send() {
        SingletonBroadcast.getInstance().broadcast();
    }
 }