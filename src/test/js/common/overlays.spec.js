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

describe('Common overlay tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/overlays'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should not have util undefined', function() {
        expect(util).to.exist;
    });

    describe('addTextElement tests', function() {
        var stub, overlays;
        var elementId = 1;
        var html = document.createElement('ul');
        var out;

        beforeEach(function() {
            stub = sinon.stub().returns(2);
            overlays = {add: stub};

            out = util.addTextElement(overlays, elementId, html);
        });

        it('should add element with corresponding id and object', function() {
            expect(stub.calledWith(elementId)).to.eql(true);
            expect(stub.firstCall.args[1]).to.be.an('object');
            expect(stub.firstCall.args[1].html).to.eql(html);
        });

        it('should return id of 2', function() {
            expect(out).to.eql(2);
        });
    });

    describe('clearOverlays tests', function() {
        var spy, overlays;
        var overlayIds = {'a': [1], 'b': [-2], 'c': [3]};

        beforeEach(function() {
            spy = sinon.spy();
            overlays = {remove: spy};

            util.clearOverlays(overlays, overlayIds, 'a');
            util.clearOverlays(overlays, overlayIds, 'b');
        });

        it('should call remove for all ids', function() {
            expect(spy.calledWith(1)).to.eql(true);
            expect(spy.calledWith(-2)).to.eql(true);
        });

        it('should return overlayIds empty', function() {
            expect(overlayIds['a']).to.be.empty;
            expect(overlayIds['b']).to.be.empty;
            expect(overlayIds['c']).to.be.not.empty;
        });
    });
});