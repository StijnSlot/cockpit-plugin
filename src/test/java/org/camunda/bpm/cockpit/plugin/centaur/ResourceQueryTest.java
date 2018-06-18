package org.camunda.bpm.cockpit.plugin.centaur;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.centaur.db.AssigneeDto;
import org.camunda.bpm.cockpit.plugin.centaur.db.UserDto;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.junit.Assert;
import org.junit.Test;

import java.util.HashMap;
import java.util.List;

public class ResourceQueryTest extends AbstractCockpitPluginTest {
    @Test
    public void testCreateTable() {
        getQueryService()
            .executeQuery(
                "cockpit.query.resource.createTable",
                new QueryParameters<>());
    }

    @Test
    public void testAddResourceIds() {
        getQueryService()
            .executeQuery(
                "cockpit.query.resource.addResourceIds",
                new QueryParameters<>());
    }
    @Test
    public void testdeleteResourceIds() {
        getQueryService()
            .executeQuery(
                "cockpit.query.resource.deleteResourceIds",
                new QueryParameters<>());
    }

    @Test
    public void testSelectUsers() {
        List<UserDto> result =
            getQueryService()
                .executeQuery(
                    "cockpit.query.resource.selectUsers",
                    new QueryParameters<>());

        Assert.assertEquals(0, result.size());
    }

    @Test
    public void testUpdateActive() {
        QueryParameters<Object> parameters = new QueryParameters<>();
        HashMap<String, String> param = new HashMap<>();
        param.put("id", "test");
        param.put("active", "false");
        parameters.setParameter(param);

        getQueryService()
            .executeQuery(
                "cockpit.query.resource.updateActive",
                parameters);
    }

    @Test
    public void testSelectAssigned() {
        List<AssigneeDto> result =
            getQueryService()
                .executeQuery(
                    "cockpit.query.resource.selectAssigned",
                    new QueryParameters<>());

        Assert.assertEquals(0, result.size());
    }

    @Test
    public void testUpdateAssigned() {
        QueryParameters<Object> parameters = new QueryParameters<>();
        HashMap<String, String> param = new HashMap<>();
        param.put("id", "test");
        param.put("active", "true");
        param.put("prevAssigned", "false");
        parameters.setParameter(param);

        getQueryService()
            .executeQuery(
                "cockpit.query.resource.updateAssigned",
                parameters);
    }
}
