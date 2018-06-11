'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs  = require('requirejs');
requirejs.config({
    baseUrl: '.'
});

global.window = window;
global.$ = require('jquery');

describe('Common options tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/options'], function(utl) {
            util = utl;
            done();
        });
    });

    describe('getVariableNum tests', function() {
        var stub, localStorage, id = 2, out;

        describe('not in localStorage', function() {
            var spy;

            beforeEach(function() {
                stub = sinon.stub();
                stub.returns(null);
                spy = sinon.spy();
                localStorage = {getItem: stub, setItem: spy};
                out = util.getVariableNum(localStorage, id);
            });

            it('should call getItem at least once', function() {
                expect(stub.calledOnce).to.eql(true);
            });

            it('should return default value 5', function() {
                expect(out).to.eql(5);
            });

            it('should setItem in localStorage with value and default 5', function() {
                expect(spy.calledWith(id, 5)).to.eql(true);
            });
        });

        describe('in localStorage', function() {
            var stored = 2;

            beforeEach(function() {
                stub = sinon.stub();
                stub.returns(stored);
                localStorage = {getItem: stub};
                out = util.getVariableNum(localStorage, id);
            });

            it('should return stored', function() {
                expect(out).to.eql(stored);
            });

            it('should call getItem at least once', function() {
                expect(stub.calledOnce).to.eql(true);
            });
        });
    });

    describe('is selected instance tests', function() {
        var instance;
        var elementID;
        var instanceID;
        var out;

        describe('is selected', function() {

            beforeEach(function() {
                instance = [{activityId: 'An activity', instanceId: 123}, {activityId: 'An activity', instanceId: 124}];
                elementID = 'An activity';
                instanceID = 123;
                out = util.isSelectedInstance(instance, elementID, instanceID);
            });

            it('check if it returns true', function() {
                expect(out).to.eql(true);
            });

            it('check if it returns false', function() {
                instanceID = 125;
                out = util.isSelectedInstance(instance, elementID, instanceID);
                expect(out).to.eql(false);
            });            
        });
    });
});