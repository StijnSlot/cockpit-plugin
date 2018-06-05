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


describe('check checkConditions', function () {
    var spy;
    var minDuration, curDuration, avgDuration, maxDuration;

    describe('check if bgraph conditions are correct', function () {
        beforeEach(function () {
            spy = sinon.spy();
            minDuration = 7000;
            curDuration = 6000;
            avgDuration = 4200;
            maxDuration = 10000;


        });
        it('check if returns true when arguments are correct values', function () {
            expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(true);
        });

        it('check if returns false when arguments are incorrect',function () {

            minDuration = null;
            expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(false);
        });

        it('check if returns false when arguments are incorrect',function () {

            curDuration = null;
            expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(false);
        });

        it('check if returns false when arguments are incorrect',function () {

            avgDuration = null;
            expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(false);
        });

        it('check if returns false when arguments are incorrect',function () {

            maxDuration = null;
            expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(false);
        });

        it('check if returns false when avgDuration is 0',function () {

            avgDuration = 0;
            expect(util.checkConditions(minDuration, avgDuration, maxDuration, curDuration)).to.eql(false);
        });

    });


});


describe('check Time Unit', function () {
    var duration;
    describe('check if time units are calculated correctly', function () {


       it('test seconds', function () {
           duration = 5000;
           expect(util.checkTimeUnit(duration)).to.eql('seconds');
       });

       it('test minutes', function(){
           duration = 100000;
           expect(util.checkTimeUnit(duration)).to.eql('minutes');
        });

        it('test hours', function(){
            duration = 3700001
            expect(util.checkTimeUnit(duration)).to.eql('hours');
        });

        it('test days', function(){
            duration = 90400001;
            expect(util.checkTimeUnit(duration)).to.eql('days');
        });

        it('test weeks', function(){
            duration = 605800001;
                expect(util.checkTimeUnit(duration)).to.eql('weeks');
        });

    });


});

describe('check determineColor', function () {
    var avgDuration, maxDuration, curDuration;

    describe('check if determineColor gets the right values', function () {

        it('check if green is returned  correct values', function () {
            avgDuration = 45;
            maxDuration = 50;
            curDuration = 20;
            expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.eql('green');

            curDuration = 60;
            expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.not.eql('green');

        });
        it('check if orange is returned correctly', function(){
            avgDuration = 10;
            maxDuration = 50;
            curDuration = 20;
           expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.eql('orange');

           avgDuration = 20;
            expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.not.eql('orange');
        });

        it('check if red is returned correctly', function(){
            avgDuration = 10;
            maxDuration = 50;
            curDuration = 60;
            expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.eql('red');

            curDuration = 20;
            expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.not.eql('red');
        });

    });

    // describe('check createHTML', function () {
    //     var elementID;
    //     var returnValue;

    //     describe('check create HTML', function () {
    //         beforeEach(function () {
    //             elementID = 'thisIsAnElement'

    //             returnValue = util.createHTML(elementID);
    //         });
    //         it('check if returns correct values', function () {
    //             expect(returnValue).to.eql('<div class="bullet-duration-thisIsAnElement"> </div>');
    //         });

    //     });


    // });

    describe('check if current duration is bigger or equal to the maximum duration', function () {
        var curDuration;
        var maxDuration;
        var returnValue;

        describe('check if cur bigger max', function () {


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
    describe('check times conversion test', function () {

        var duration;
        var choice;
        describe('check duration format is correct', function () {


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

});
