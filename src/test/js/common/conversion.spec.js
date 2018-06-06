'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs = require('requirejs');
requirejs.config({
    baseUrl: '.'
});

global.window = window;
global.$ = require('jquery');

describe('Common conversion tests', function () {
    var util;

    before(function (done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/conversion'], function (utl) {
            util = utl;
            done();
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

