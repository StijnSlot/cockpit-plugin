'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs  = require('requirejs');
requirejs.config({
    baseUrl: '.'
});

describe('instance variables tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/diagram/instanceVar/util'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should find util for instanceVar', function() {
        expect(util).to.exist;
    });

    describe('addActivityElements tests', function() {
        var sandbox = sinon.createSandbox();
        var stub1, stub2, stub3;
        var spy;
        var comUtil;
        var http, uri;

        before(function(done) {
            requirejs(['main/resources/plugin-webapp/centaur/app/common/variableUtil'], function(utl) {
                comUtil = utl;
                done();
            });
        });

        it('should find comUtil', function() {
            expect(comUtil).to.exist;
        });

        beforeEach(function() {
            spy = sandbox.spy();
            stub1 = sandbox.stub(comUtil);
            stub1.filterVariables.returns([{}]);
            stub1.createVariableList.returns(document.createElement('div'));
            stub1.createVariableUl.returns(document.createElement('ul'));
            stub1.procDefId = "asdf1234";
            stub2 = sandbox.stub().returns({success: function(x) {
                var instances = [{}, {}];
                x(instances);}
            });
            http = {get: stub2};
            uri = {appUri: spy};

            stub3 = sinon.stub().returns(null);
            var window = {localStorage: {getItem: stub3}};


            util.addActivityElements(window, http, [{businessObject: {id: 1}}],
                {bpmnElements: [{}, {}, {id: 2}]}, {}, uri, stub1);
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('should call get three times', function() {
            expect(stub2.callCount).to.eql(3);
            expect(spy.callCount).to.eql(3);
        });

        it('should do a http request with process definition', function() {
            expect(spy.args[0][0]).to.contain(stub1.procDefId);
        });

        it('should call createVariableList', function() {
            expect(stub1.createVariableList.callCount).to.eql(1);
        });

        it('should call clearOverlays', function() {
            expect(stub1.clearOverlays.callCount).to.eql(1);
        });

        it('should call handleData', function() {
            expect(stub1.handleVariableData.callCount).to.eql(2);
        });
    });
});