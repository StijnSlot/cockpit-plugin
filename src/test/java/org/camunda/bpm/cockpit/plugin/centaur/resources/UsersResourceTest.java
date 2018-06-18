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
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;

public class UsersResourceTest extends AbstractCockpitPluginTest {

    private HttpServer server;
    private WebTarget target;

    private final String BASE_URI = "http://localhost:8000";
    @Before
    public void setUp() {
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
    public void createTableTest() {
        (new UsersResource("test")).createTable();
    }

    @Test
    public void getUsersTest() {
        Form form = new Form();
        form.param("active", "true");
        form.param("id", "test");
        Response output = target.path("/plugin/" + CockpitPlugin.ID + "/" + getProcessEngine().getName() + "/users/set-active")
                .request()
                .post(Entity.form(form));

        assertEquals(204, output.getStatus());
    }

    @Test
    public void updateTest() {
        (new UsersResource("test")).update();
    }
}
