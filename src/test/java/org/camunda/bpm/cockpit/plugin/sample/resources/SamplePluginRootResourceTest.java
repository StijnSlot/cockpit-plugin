package org.camunda.bpm.cockpit.plugin.sample.resources;

import org.camunda.bpm.cockpit.plugin.sample.SamplePlugin;
import org.camunda.bpm.cockpit.plugin.sample.db.ProcessStatisticsDto;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response;

import java.net.URI;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;

public class SamplePluginRootResourceTest extends AbstractCockpitPluginTest {

    private HttpServer server;
    private WebTarget target;

    private String BASE_URI = "http://localhost:8000";

    @Before
    public void setUp() {
        final ResourceConfig rc = new ResourceConfig().packages("org.camunda.bpm.cockpit.plugin.sample.resources");

        server = GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);

        Client c = ClientBuilder.newClient();
        target = c.target(BASE_URI);
    }

    @After
    public void close() {
        server.shutdownNow();
    }

    @Test
    public void test() {
        Response output = target.path("plugin/" + SamplePlugin.ID).request().get();
        assertEquals(200, output.getStatus());
        assertEquals("Got it!", output.readEntity(String.class));
    }

    @Test
    public void processInstanceTest() {
        Response output = target.path("/plugin/" + SamplePlugin.ID + "/" +
                 getProcessEngine().getName() + "/process-instance").request().get();
        assertEquals(200, output.getStatus());
        assertNotNull(output.readEntity(List.class));
    }

    @Test
    public void processActivityTest() {
        Response output = target.path("/plugin/" + SamplePlugin.ID + "/" +
                getProcessEngine().getName() + "/process-activity").request().get();
        assertEquals(200, output.getStatus());
        assertNotNull(output.readEntity(List.class));
    }

    @Test
    public void instanceVariablesTest() {
        Response output = target.path("/plugin/" + SamplePlugin.ID + "/" +
                getProcessEngine().getName() + "/instance-variables").request().get();
        assertEquals(200, output.getStatus());
        assertNotNull(output.readEntity(List.class));
    }

    @Test
    public void instanceStartTimeTest() {
        Response output = target.path("/plugin/" + SamplePlugin.ID + "/" +
                getProcessEngine().getName() + "/instance-start-time").request().get();
        assertEquals(200, output.getStatus());
        assertNotNull(output.readEntity(List.class));
    }
}
