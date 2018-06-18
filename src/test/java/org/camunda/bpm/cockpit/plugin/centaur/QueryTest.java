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
        parameters.setParameter("test");

        List<ProcessActivityDto> result =
            getQueryService()
            .executeQuery(
                "cockpit.query.selectProcessActivityStatistics",
                parameters);

        Assert.assertEquals(0, result.size());
    }

    @Test
    public void testInstanceVariablesQueryWorks() {
        QueryParameters<InstanceVariablesDto> parameters = new QueryParameters<>();
        HashMap<String, String> param = new HashMap<>();
        param.put("procDefId", "");
        param.put("actId", "");
        parameters.setParameter(param);

        List<InstanceVariablesDto> result =
            getQueryService()
                .executeQuery(
                    "cockpit.query.selectInstanceVariables",
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
}
