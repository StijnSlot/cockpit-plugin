/*
 * Loads all the modules for the processDefinition
 */
'use strict';

define(function(require) {
  var angular = require('angular');
  var refresh = require('./refresh/main');
  var duration = require('./duration/main');
  var bulletgraph = require('./bulletgraph/main');
  var counter = require('./counter/main');
  var variables = require('./variables/main');
  var optionsTab = require('./optionsTab/main');
  var historyTab = require('./historyTab/main');
  var overviewBulletgraph = require('./overview/bulletgraph/main');
  var overviewDuration = require('./overview/duration/main');
  var instancesTab = require('./instancesTab/main');
  
  return angular.module('cockpit.plugin.centaur.processDefinition', [refresh.name, counter.name, duration.name, variables.name,
      bulletgraph.name, optionsTab.name, historyTab.name, overviewBulletgraph.name, overviewDuration.name, instancesTab.name]);
});
