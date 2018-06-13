package org.camunda.bpm.cockpit.plugin.centaur.db;
import org.camunda.bpm.cockpit.plugin.centaur.resources.UsersResource;

import java.sql.*;

public class MyTrigger implements org.h2.api.Trigger {
    @Override
    public void init(Connection conn, String schemaName, String triggerName, String tableName, boolean before, int type) throws SQLException {
        //not necessary right now
    }

    @Override
    public void fire(Connection conn, Object[] oldRow, Object[] newRow) throws SQLException {
        System.out.println("fired");
        (new UsersResource("default")).setAssigned();
    }

    @Override
    public void close() throws SQLException {
        throw new SQLException();
    }

    @Override
    public void remove() throws SQLException {
        throw new SQLException();
    }
}
