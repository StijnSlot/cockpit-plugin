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
        requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/variables/util'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should find util for variables', function() {
        expect(util).to.exist;
    });

    describe('addProcessVariables tests', function() {
        var sandbox = sinon.createSandbox();
        var stub1, stub2, stub3;
        var spy1, spy2;
        var comUtil;
        var http, uri;

        before(function(done) {
            requirejs(['main/resources/plugin-webapp/centaur/app/common/variables'], function(utl) {
                comUtil = utl;
                done();
            });
        });

        it('should find comUtil', function() {
            expect(comUtil).to.exist;
        });

        beforeEach(function() {
            spy1 = sandbox.spy(); spy2 = sandbox.spy();
            stub1 = sandbox.stub(comUtil);
            stub1.filterVariables.returns([{}]);
            stub1.createVariableDiv.returns(document.createElement('div'));
            stub1.createVariableUl.returns(document.createElement('ul'));
            util.procDefId = stub1.procDefId = "asdf1234";
            util.commonVariable = stub1;
            util.commonOptions = {isSelectedOption: sinon.stub().returns(true), getVariableNum: sinon.spy()};
            util.commonOverlays = {clearOverlays: spy2, setOffset: sinon.spy()};

            stub2 = sandbox.stub().returns({success: function(x) {
                var instances = [{}, {}];
                x(instances);}
            });
            http = {get: stub2};
            uri = {appUri: spy1};

            stub3 = sinon.stub().returns(null);
            var window = {localStorage: {getItem: stub3}};

            var viewer = {get: function(x) {
                    if(x === 'elementRegistry') return [{businessObject: {id: 1}}];
                    else return {};
                }};
            var control = {getViewer: function() {return viewer}};
            util.addProcessVariables(window, http, control,
                {bpmnElements: [{}, {}, {id: 2}]}, uri, util);
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('should call get three times', function() {
            expect(stub2.callCount).to.eql(3);
            expect(spy1.callCount).to.eql(3);
        });

        it('should do a http request with process definition', function() {
            expect(spy1.args[0][0]).to.contain(stub1.procDefId);
        });

        it('should call createVariableDiv', function() {
            expect(stub1.createVariableDiv.callCount).to.eql(1);
        });

        it('should call clearOverlays', function() {
            expect(spy2.callCount).to.eql(1);
        });

        it('should call handleData', function() {
            expect(stub1.handleVariableData.callCount).to.eql(2);
        });
    });
});