/*
 * Loads all the modules for the diagram of our plugin.
 */
'use strict';

define(function(require) {
  var angular = require('angular');
  var color = require('./color/main');
  var duration = require('./duration/main');
  var bulletgraph = require('./bulletgraph/main');
  var counter = require('./counter/main');
  //var instanceVar = require('./instanceVar/main')
  var processInstance = require('./processInstance/main')
  return angular.module('cockpit.plugin.centaur.diagram', [color.name, counter.name, duration.name, processInstance.name, bulletgraph.name]);
});
