 package org.camunda.bpm.cockpit.plugin.sample.resources;

 import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import java.io.IOException;

import javax.ejb.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.sse.Sse;
import javax.ws.rs.sse.SseBroadcaster;
import javax.ws.rs.sse.SseEventSink;
import javax.ws.rs.sse.OutboundSseEvent;

@Singleton
public class SSETestingResource extends AbstractCockpitPluginResource {
        
    SseBroadcaster sseBroadcaster;
    Sse sse;
    SseEventSink sink;

    public SSETestingResource(String engineName) {
        super(engineName);
    }

    @GET
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void startDomain(@Context SseEventSink sink, @Context Sse sse) throws IOException {
        sseBroadcaster = sse.newBroadcaster();
        this.sink = sink;
        this.sse = sse;
        subscribe(sink);
    }     

    public void subscribe(@Context SseEventSink sink) throws IOException {
        if (sink == null)
        {
            throw new IllegalStateException("No client connected.");
        }
        sseBroadcaster.register(sink);
    }

    @POST
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void broadcast() throws IOException
    {
        // if (sseBroadcaster == null)
        // {
        //     sseBroadcaster = sse.newBroadcaster();
        // }
        
        // sseBroadcaster.broadcast(sse.newEventBuilder()
        // .name("message-to-client")
        // .data(String.class, "Hello world!")
        // .build());
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                // ... code that waits 1 second
                try {
                   wait(1000);
               } catch (InterruptedException e) {
                   // TODO Auto-generated catch block
                   e.printStackTrace();
               }
                final OutboundSseEvent event = sse.newEventBuilder()
                        .name("message-to-client")
                        .data(String.class, "Hello world " + i + "!")
                        .build();
                sink.send(event);
            }
        }).start();
    } 
 }