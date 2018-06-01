'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs  = require('requirejs');
requirejs.config({
    baseUrl: '.'
});

describe('Execution variables tests', function() {
    var util;

    before(function (done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/diagram/processInstance/util'], function (utl) {
            util = utl;
            done();
        });
    });

    it('should find util for instanceVar', function () {
        expect(util).to.exist;
    });

    describe('addActivityElements tests', function() {
        var sandbox = sinon.createSandbox();
        var stub1, stub2;
        var spy;
        var comUtil;
        var http, uri;

        before(function(done) {
            requirejs(['main/resources/plugin-webapp/centaur/app/common/variableUtil'], function(utl) {
                comUtil = utl;
                done();
            });
        });

        beforeEach(function() {
            spy = sandbox.spy();
            stub1 = sandbox.stub(comUtil);
            stub1.filterVariables.returns([{}]);
            stub2 = sandbox.stub().returns({success: function(x) {
                    var instances = [{}, {}];
                    x(instances);}
            });
            http = {get: stub2};
            uri = {appUri: spy};

            util.addActivityElements({}, http, [{businessObject: {id: 1}}], {bpmnElements: [{}, {}, {id: 2}]}, {}, uri, stub1);
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('should call get three times', function() {
            expect(stub2.callCount).to.eql(3);
            expect(spy.callCount).to.eql(3);
        });

        it('should call createVariableList', function() {
            expect(stub1.createVariableList.calledOnce).to.eql(true);
        });

        it('should call clearOverlays', function() {
            expect(stub1.clearOverlays.calledOnce).to.eql(true);
        });

        it('should call filterVariables with [{},{}]', function() {
            expect(stub1.filterVariables.calledTwice).to.eql(true);
            expect(stub1.filterVariables.calledWith(undefined, [{},{}])).to.eql(true);
        });

        it('should call addData with [{}]', function() {
            expect(stub1.addData.calledTwice).to.eql(true);
            expect(stub1.addData.calledWith(undefined, [{}])).to.eql(true);
        });
    });
});