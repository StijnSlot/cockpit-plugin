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
    requirejs(['main/resources/plugin-webapp/centaur/app/diagram/duration/util'], function(utl) {
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

describe('addText to process ID test', function(){

    var spy;
    var overlays;
    var elementID, text, shape;



    describe('test if the overlays is assigned', function() {

        beforeEach(function() {
            spy = sinon.spy();
            overlays = {add: spy};
            elementID = 12;
            shape = {width: 1, height: 2};

            util.addTextToId(elementID, text, shape, overlays);
        });

        it('test if the overlays reference variable is assigned the value', function(){
          expect(spy.calledWith(elementID, {position:{top: -40, left: -40 },show: {minZoom: -Infinity,maxZoom: +Infinity}})).to.eql(true);
        });

    });


});


describe('testing compose html', function(){

    var spy;
    var minDuration, avgDuration, maxDuration, curDuration, elementID, shape;



    describe('check if the composeHTML assigns text values', function() {

        beforeEach(function() {
            spy = sinon.spy();
            elementID = 12;
            shape = {width:7, height: 6};
            minDuration = 2000;
            maxDuration = 4;
            avgDuration = 3;
            curDuration = null;
            elementID = 45;
        });

        it('test if the minduration datatype is changed to string', function(){
            expect( util.composeHTML(minDuration, avgDuration, maxDuration, curDuration, elementID, shape)).to.eql('-');
        });

    });


});