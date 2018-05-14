package org.camunda.bpm.cockpit.plugin.resources;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.sse.OutboundSseEvent;
import javax.ws.rs.sse.Sse;
import javax.ws.rs.sse.SseBroadcaster;

public final class SingletonBroadcast {
    private static final SingletonBroadcast instance = new SingletonBroadcast();
    private SseBroadcaster sseBroadcaster;
    private OutboundSseEvent event;

    private SingletonBroadcast() {
    }

    public static SingletonBroadcast getInstance() {
        return instance;
    }

    public void setBroadcaster(SseBroadcaster in) {
        if (this.sseBroadcaster == null) {
            this.sseBroadcaster = in;
        }
    }

    public SseBroadcaster getBroadcaster() {
        return this.sseBroadcaster;
    }

    public void setMessage(Sse sse) {
        if (event == null) {
            event = sse.newEventBuilder()
                        .name("message")
                        .mediaType(MediaType.TEXT_PLAIN_TYPE)
                        .data(String.class, "refresh")
                        .build();
        }
    }

    public void broadcast() {
        if (event != null && this.sseBroadcaster != null) {
            this.sseBroadcaster.broadcast(event);
        }
    }
}