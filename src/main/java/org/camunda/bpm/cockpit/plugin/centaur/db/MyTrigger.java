package org.camunda.bpm.cockpit.plugin.centaur.db;
import org.h2.api.Trigger;
import java.sql.*;


public class MyTrigger implements Trigger {


    public void init(Connection conn, String schemaName, String triggerName,
                     String tableName, boolean before, int type)  {
        // initialize the trigger object is necessary
    }

    public void fire(Connection conn,
                     Object[] oldRow, Object[] newRow)
            throws SQLException {

        System.out.print("The trigger fires");

        //throw new SQLException();
    }


    public void close() throws SQLException {
        // the database is closed
        throw new SQLException();
    }

    public void remove() throws SQLException{
        // the trigger was dropped
        throw new SQLException();
    }




}
