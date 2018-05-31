'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs = require('requirejs');
requirejs.config({
  baseUrl: '.'
});

var util;

before(function(done) {
  requirejs(['main/resources/plugin-webapp/centaur/app/diagram/counter/util'], function(utl) {
    util = utl;
    done();
  });
});

it('should find duration util file', function() {
  expect(util).to.not.be.undefined;
});

describe('addText to process ID test', function() {

  var spy;
  var overlays;
  var elementID, text, shape;

  describe('test if the overlays is assigned', function() {

    beforeEach(function() {
      spy = sinon.spy();
      overlays = {
        add: spy
      };
      elementID = 12;
      shape = {
        width: 1,
        height: 2
      };

      util.addTextToId(elementID, text, shape, overlays);
    });

    it('test if the overlays reference variable is assigned the value', function() {
      expect(spy.calledWith(elementID, {
        position: {
          top: -40,
          left: -40
        },
        show: {
          minZoom: -Infinity,
          maxZoom: +Infinity
        }
      })).to.eql(true);
    });

  });


});


// describe('testing compose html', function() {
//
//   var spy;
//   var minDuration, avgDuration, maxDuration, curDuration, elementID, shape;
//
//
//
//   describe('check if the composeHTML assigns text values', function() {
//
//     beforeEach(function() {
//       spy = sinon.spy();
//       elementID = 12;
//       shape = {
//         width: 7,
//         height: 6
//       };
//       minDuration = 2000;
//       maxDuration = 4;
//       avgDuration = 3;
//       curDuration = null;
//       elementID = 45;
//     });
//
//     it('test if the minduration datatype is changed to string', function() {
//       expect(util.composeHTML(minDuration, avgDuration, maxDuration, curDuration, elementID, shape)).to.eql('-');
//     });
//
//   });
//
//
// });
