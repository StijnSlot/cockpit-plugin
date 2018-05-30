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
    var choice;
    describe('check duration format is correct', function () {
        beforeEach(function() {
            spy = sinon.spy();
        });

        it('test for duration to be in seconds', function () {
            duration = 1000*2;
            choice = 'seconds';
            expect(util.convertTimes(duration, choice)).to.eql(2);
            duration = 1000*60;
            choice = 'seconds';
            expect(util.convertTimes(duration, choice)).to.eql(60);
            duration = 1000*145;
            choice = 'seconds';
            expect(util.convertTimes(duration, choice)).to.eql(145);
        });

        it('test for duration to be in minutes', function(){
            duration = 60001;
            choice = 'minutes';
            expect(util.convertTimes(duration, choice)).to.eql(1);
            duration = 60000*24;
            choice = 'minutes';
            expect(util.convertTimes(duration, choice)).to.eql(24);
            duration = 60000*124;
            choice = 'minutes';
            expect(util.convertTimes(duration, choice)).to.eql(124);
        });

        it('test for duration to be in hours', function(){
            duration = 3600001;
            choice = 'hours';
            expect(util.convertTimes(duration, choice)).to.eql(1);
            duration = 3600000*75;
            choice = 'hours';
            expect(util.convertTimes(duration, choice)).to.eql(75);
        });

        it('test for duration to be in days', function(){
            duration = 86400001;
            choice = 'days';
            expect(util.convertTimes(duration, choice)).to.eql(1);
            duration = 86400001*10;
            choice = 'days';
            expect(util.convertTimes(duration, choice)).to.eql(10);
        });

        it('test for duration to be in weeks', function(){
            duration = 604800001;
            choice = 'weeks';
            expect(util.convertTimes(duration, choice)).to.eql(1);
            duration = 604800000*2;
            choice = 'weeks';
            expect(util.convertTimes(duration, choice)).to.eql(2);
            duration = 604800000*5;
            choice = 'weeks';
            expect(util.convertTimes(duration, choice)).to.eql(5);

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
    var elementID;
    var returnValue;

    describe('check create HTML', function () {
        beforeEach(function () {
            spy = sinon.spy();
            elementID = 'thisIsAnElement'

            returnValue = util.createHTML(elementID);
        });
        it('check if returns correct values', function () {
            expect(returnValue).to.eql('<div class="bullet-duration-thisIsAnElement"> </div>');
        });

    });


});

describe('check if current duration is bigger or equal to the maximum duration', function () {
    var spy;
    var curDuration;
    var maxDuration;
    var returnValue;

    describe('check if cur bigger max', function () {
        beforeEach(function () {
            spy = sinon.spy();
            
        });

        it('check if returns correct values', function () {
            curDuration = 1000;
            maxDuration = 1000;
            returnValue = util.checkIfCurBiggerMax(curDuration, maxDuration);
            expect(returnValue).to.eql(1000);
        });

        it('check if returns correct values', function () {
            curDuration = 1200;
            maxDuration = 1000;
            returnValue = util.checkIfCurBiggerMax(curDuration, maxDuration);
            expect(returnValue).to.eql(1000);
        });

        it('check if returns correct values', function () {
            curDuration = 1000;
            maxDuration = 1300;
            returnValue = util.checkIfCurBiggerMax(curDuration, maxDuration);
            expect(returnValue).to.eql(1000);
        });

    });


});