call mvn clean package || pause

cd src
call mocha --recursive || pause

xcopy /y "C:\Users\s151914\Documents\GitHub\cockpit-plugin\target\centaur-1.0.0.jar" "C:\camunda-bpm-tomcat-7.8.0\server\apache-tomcat-8.0.47\webapps\camunda\WEB-INF\lib"

cd "C:\camunda-bpm-tomcat-7.8.0"
call start-camunda.bat
exit