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

describe('processes selection tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/processes/selection/util'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should find util for selection', function() {
        expect(util).to.exist;
    });

    describe('putCheckboxes tests', function() {

    });

    describe('putDeleteButton tests', function() {
        var out;
        beforeEach(function() {
            out = util.putDeleteButton();
        });
        it('should return a button', function() {
            expect(out.nodeName).to.eql('BUTTON');
        })

    });

    describe('getSelectedIds tests', function() {
        var out;
        var td = document.createElement('TD');
        var link = document.createElement('A');
        link.setAttribute("href", "#/test/test_process:1");
        td.appendChild(link);
        var sandbox, stub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            //var stub = sandbox.stub($);
            //stub.returns($(td));
            out = util.getSelectedIds();
        });
        afterEach(function() {
            sandbox.restore();
        });
        it('should return array of size 1', function() {
            expect(out).to.have.lengthOf(1);
        });
        it('should return itetest_process:1', function() {
            expect(out[0]).to.eql("test_process:1");
        });
    });

    describe('deleteProcessDefinition tests', function() {

    });
});