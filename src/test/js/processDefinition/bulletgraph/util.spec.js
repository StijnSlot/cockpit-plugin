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
    requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/bulletgraph/util'], function(utl) {
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




