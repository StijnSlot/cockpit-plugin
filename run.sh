#!/bin/bash

mvn clean install

cp ./target/cockpit-plugin-1.0.0.jar ../camunda-bpm-tomcat-7.8.0/server/apache-tomcat-8.0.47/webapps/camunda/WEB-INF/lib/

cd ../camunda-bpm-tomcat-7.8.0

./start-camunda.sh