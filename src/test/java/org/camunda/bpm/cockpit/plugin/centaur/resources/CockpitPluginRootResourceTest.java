package org.camunda.bpm.cockpit.plugin.centaur.resources;

import org.camunda.bpm.cockpit.plugin.centaur.CockpitPlugin;
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

public class CockpitPluginRootResourceTest extends AbstractCockpitPluginTest {

    private HttpServer server;
    private WebTarget target;



    @Before
    public void setUp() {
        String BASE_URI = "http://localhost:8000";

        final ResourceConfig rc = new ResourceConfig().packages("org.camunda.bpm.cockpit.plugin.centaur.resources");

        server = GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);

        Client c = ClientBuilder.newClient();
        target = c.target(BASE_URI);
    }

    @After
    public void close() {
        server.shutdownNow();
    }

    @Test
    public void processActivityTest() {
        Response output = target.path("/plugin/" + CockpitPlugin.ID + "/" +
                getProcessEngine().getName() + "/process-activity").request().get();
        assertEquals(200, output.getStatus());
        assertNotNull(output.readEntity(List.class));
    }

    @Test
    public void processVariablesTest() {
        Response output = target.path("/plugin/" + CockpitPlugin.ID + "/" +
                getProcessEngine().getName() + "/process-variables").request().get();
        assertEquals(200, output.getStatus());
        assertNotNull(output.readEntity(List.class));
    }
    @Test
    public void instanceStartTimeTest() {
        Response output = target.path("/plugin/" + CockpitPlugin.ID + "/" +
                getProcessEngine().getName() + "/instance-start-time").request().get();
        assertEquals(200, output.getStatus());
        assertNotNull(output.readEntity(List.class));
    }

    @Test
    public void orderStatisticsTest() {
        Response output = target.path("/plugin/" + CockpitPlugin.ID + "/" +
                getProcessEngine().getName() + "/order-statistics").request().get();
        assertEquals(200, output.getStatus());
              assertNotNull(output.readEntity(List.class));
          }

    @Test
    public void getUsersTest() {
        Response output = target.path("/plugin/" + CockpitPlugin.ID + "/" +
                getProcessEngine().getName() + "/users").request().get();
        assertEquals(200, output.getStatus());
        assertNotNull(output.readEntity(List.class));
    }
}
