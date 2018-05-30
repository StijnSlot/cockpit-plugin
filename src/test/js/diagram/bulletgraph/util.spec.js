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
    requirejs(['main/resources/plugin-webapp/centaur/app/diagram/bulletgraph/util'], function(utl) {
        util = utl;
        done();
    });
});

it('should find duration util file', function() {
    expect(util).to.not.be.undefined;
});

describe('calculate current duration test', function(){

    var spy;
    var instance;
    var elementID;
    describe('check if time difference is correct', function () {
        beforeEach(function () {
            spy = sinon.spy();
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

describe('check times conversion test', function () {

    var spy;
    var duration;
    describe('check duration format is correct', function () {
        beforeEach(function() {
            spy = sinon.spy();
        });

        it('test for duration to be in seconds', function () {
            duration = 2000;
            expect(util.checkTimes(duration)).to.eql('2 seconds');
            duration = 60000;
            expect(util.checkTimes(duration)).to.eql('60 seconds');
            duration = 61000;
            expect(util.checkTimes(duration)).to.not.eql('61 seconds');
        });

        it('test for duration to be in minutes', function(){
            duration = 60001;
            expect(util.checkTimes(duration)).to.eql('1 minutes');
            duration = 1440000;
            expect(util.checkTimes(duration)).to.eql('24 minutes');
            duration = 3600001;
            expect(util.checkTimes(duration)).to.not.eql('60 minutes');
        });

        it('test for duration to be in hours', function(){
            duration = 3600001;
            expect(util.checkTimes(duration)).to.eql('1 hours');
            duration = 86400000;
            expect(util.checkTimes(duration)).to.eql('24 hours');
        });

        it('test for duration to be in days', function(){
            duration = 86400001;
            expect(util.checkTimes(duration)).to.eql('1 days');
            duration = 604800000;
            expect(util.checkTimes(duration)).to.eql('7 days');
        });

        it('test for duration to be in weeks', function(){
            duration = 604800001;
            expect(util.checkTimes(duration)).to.eql('1 weeks');
            duration = 604800001*2;
            expect(util.checkTimes(duration)).to.eql('2 weeks');
            duration = 604800001*5;
            expect(util.checkTimes(duration)).to.eql('5 weeks');

        });

    });

});


describe('check Conditions', function () {
    var spy;
    var avgDuration, maxDuration;
    var returnValue;
    describe('check if conditions are checked correctly', function () {

       beforeEach(function () {
           spy = sinon.spy();
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
    var spy;
    var curDuration;
    var returnValue;
    describe('check if curDuration has the right value', function () {
        beforeEach(function () {
            spy = sinon.spy();
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

describe('check createHTML', function () {
    var spy;
    var curDurationHTML, avgDurationHTML, maxDurationHTML, returnValue;

    describe('check create HTML', function () {
        beforeEach(function () {
            spy = sinon.spy();
            curDurationHTML = '6000';
            avgDurationHTML = '4200';
            maxDurationHTML = '10000';

            returnValue = util.createHTML(curDurationHTML, avgDurationHTML, maxDurationHTML);
        });
        it('check if returns correct values', function () {
            expect(returnValue).to.eql('<div class="durationText"> Cur: 6000 <br> Avg: 4200 <br> Max: 10000</div>');
        });

    });


});