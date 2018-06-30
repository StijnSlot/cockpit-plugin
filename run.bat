call mvn clean package || pause
call npm install-test || pause

xcopy /y "..\target\centaur-1.0.0.jar" "C:\camunda-bpm-tomcat-7.8.0\server\apache-tomcat-8.0.47\webapps\camunda\WEB-INF\lib"

cd "C:\camunda-bpm-tomcat-7.8.0"
call start-camunda.bat
exit