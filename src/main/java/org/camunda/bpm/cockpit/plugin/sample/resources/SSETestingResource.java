 package org.camunda.bpm.cockpit.plugin.sample.resources;

 import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

 import javax.ws.rs.GET;
 import javax.ws.rs.Path;
 import javax.ws.rs.Produces;
 import javax.ws.rs.core.Context;
 import java.util.Date;
 import javax.ws.rs.core.MediaType;
 import javax.ws.rs.sse.Sse;
 import javax.ws.rs.sse.SseEventSink;
 import javax.ws.rs.sse.OutboundSseEvent;


 public class SSETestingResource extends AbstractCockpitPluginResource {
     public SSETestingResource(String engineName) {
         super(engineName);
     }

     @GET
     @Produces(MediaType.SERVER_SENT_EVENTS)
     public void getServerSentEvents(@Context SseEventSink eventSink, @Context Sse sse) {
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
                 eventSink.send(event);
             }
         }).start();
     }
 }