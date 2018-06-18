package org.camunda.bpm.cockpit.plugin.centaur;

import org.camunda.bpm.cockpit.plugin.centaur.db.*;
import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.junit.Assert;
import org.junit.Test;

import java.util.HashMap;
import java.util.List;
import java.io.*;

public class QueryTest extends AbstractCockpitPluginTest {

    @Test
    public void testProcessStatisticsQueryWorks() {
        List<ProcessStatisticsDto> result =
            getQueryService()
            .executeQuery(
                "cockpit.query.selectProcessStatistics",
                new QueryParameters<>());

        Assert.assertEquals(0, result.size());
    }

    @Test
    public void testProcessInstanceActivityQueryWorks() {
        QueryParameters<ProcessActivityDto> parameters = new QueryParameters<>();
        parameters.setParameter("");

        List<ProcessActivityDto> result =
            getQueryService()
            .executeQuery(
                "cockpit.query.selectProcessActivityStatistics",
                parameters);

        Assert.assertEquals(0, result.size());
    }

    @Test
    public void testInstanceStartTimeQueryWorks() {
        List<InstanceStartTimeDto> result =
            getQueryService()
            .executeQuery(
                "cockpit.query.selectInstanceStartTime",
                new QueryParameters<>());

        Assert.assertEquals(0, result.size());
    }

    @Test
    public void testProcessVariables() {
        List<ProcessVariablesDto> result =
            getQueryService()
                .executeQuery(
                    "cockpit.query.selectProcessVariables",
                    new QueryParameters<>());

        Assert.assertEquals(0, result.size());
    }

    @Test
    public void testRefreshResource() {
        List<ProcessVariablesDto> result =
            getQueryService()
                .executeQuery(
                    "cockpit.query.selectActiveInstances",
                    new QueryParameters<>());

        Assert.assertEquals(0, result.size());
    }

    @Test
    public void testCreateTable() {
        getQueryService()
            .executeQuery(
                "cockpit.query.createTable",
                new QueryParameters<>());
    }

    @Test
    public void testAddResourceIds() {
        getQueryService()
            .executeQuery(
                "cockpit.query.addResourceIds",
                new QueryParameters<>());
    }
    @Test
    public void testdeleteResourceIds() {
        getQueryService()
            .executeQuery(
                "cockpit.query.deleteResourceIds",
                new QueryParameters<>());
    }

    @Test
    public void testSelectUsers() {
        List<UserDto> result =
            getQueryService()
                .executeQuery(
                    "cockpit.query.selectUsers",
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
                "cockpit.query.updateActive",
                parameters);
    }

    @Test
    public void testSelectAssigned() {
        List<AssigneeDto> result =
            getQueryService()
                .executeQuery(
                    "cockpit.query.selectAssigned",
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
                "cockpit.query.updateAssigned",
                    parameters);
    }
}
