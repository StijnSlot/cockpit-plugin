'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs  = require('requirejs');
requirejs.config({
    baseUrl: '.'
});

var util;

before(function(done) {
    requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/duration/util'], function(utl) {
        util = utl;
        done();
    });
});

it('should find duration util file', function() {
    expect(util).to.not.be.undefined;
});



// describe('check createHTML', function () {
//     var curDurationHTML, avgDurationHTML, maxDurationHTML, returnValue;

//     describe('check create HTML', function () {
//         beforeEach(function () {
//             curDurationHTML = '6000';
//             avgDurationHTML = '4200';
//             maxDurationHTML = '10000';

//             returnValue = util.createHTML(curDurationHTML, avgDurationHTML, maxDurationHTML);
//         });
//         it('check if returns correct values', function () {
//             expect(returnValue).to.eql('<div class="durationText"> Cur: 6000 <br> Avg: 4200 <br> Max: 10000</div>');
//         });

//     });


// });