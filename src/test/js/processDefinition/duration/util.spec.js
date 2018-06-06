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

describe('calculate current duration test', function(){

    var instance;
    var elementID;
    describe('check if time difference is correct', function () {
        beforeEach(function () {
            instance = [{activityId: 12, startTime: 0}, {activityId:14, startTime: 2}];
        });

        it('test if the time difference is returned at all', function () {
            elementID = 14;
            expect(util.calculateCurDuration(instance, elementID)).to.be.a('number');
            elementID = 16;
            expect(util.calculateCurDuration(instance, elementID)).to.be.null;
        });

    });
    


});


describe('check Conditions', function () {
    var avgDuration, maxDuration;
    var returnValue;
    describe('check if conditions are checked correctly', function () {

       beforeEach(function () {
           avgDuration = '4';
           maxDuration = '12';
           returnValue = util.checkConditions(avgDuration, maxDuration);
       });

       it('test if condition is true when arguments are valid', function () {
           expect(returnValue).to.eql(true);
       });

       it('test if condition is false when arguments are invalid', function(){
           maxDuration = null;
           expect(util.checkConditions(avgDuration, maxDuration)).to.eql(false);
        });

        it('test if condition is false when arguments are invalid', function(){
            avgDuration = null;
            expect(util.checkConditions(avgDuration, maxDuration)).to.eql(false);
        });

        it('test if condition is false when arguments are invalid', function(){
            avgDuration = '0';
            expect(util.checkConditions(avgDuration, maxDuration)).to.eql(false);
        });

    });


});

describe('check checkIfCurValid', function () {
    var curDuration;
    var returnValue;
    describe('check if curDuration has the right value', function () {
        beforeEach(function () {
            curDuration = 6000;
            returnValue = util.checkIfCurValid(util, curDuration);
        });
        it('check if returns correct values', function () {
            expect(returnValue).to.eql('6 seconds');
        });
        it('check if returns nothing when null', function(){
            curDuration = null;
           expect(util.checkIfCurValid(util, curDuration)).to.eql('-');
        });

    });


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