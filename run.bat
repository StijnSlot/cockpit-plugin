call mvn package

xcopy /y "C:\Users\s152139\OneDrive - TU Eindhoven\TUe Third Year\Software Engineering Project\cockpit-plugin\target\centaur-1.0.0.jar" "C:\Users\s152139\OneDrive - TU Eindhoven\TUe Third Year\Software Engineering Project\camunda-bpm-tomcat-7.8.0\server\apache-tomcat-8.0.47\webapps\camunda\WEB-INF\lib"

cd "C:\Users\s152139\OneDrive - TU Eindhoven\TUe Third Year\Software Engineering Project\camunda-bpm-tomcat-7.8.0"
call start-camunda.bat
exit