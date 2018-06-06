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

describe('Common variables tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/variables'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should not have util undefined', function() {
        expect(util).to.exist;
    });

    describe('createVariableDiv tests', function() {
        var out;

        beforeEach(function() {
            out = util.createVariableDiv({getItem: function(){}}, "");
        });

        it('should be a div item', function() {
            expect(out.nodeName).to.eql("DIV");
        });

        it('should return a variableTextSmall', function() {
            expect(out.className).to.eql("variableTextSmall");
        });
    });

    describe('finishElement tests', function() {
        var sandbox, stub1, stub2, spy;

        beforeEach(function() {
            sandbox = sinon.createSandbox();
            stub1 = sandbox.stub(util);
            stub2 = sandbox.stub();
            stub2.returns(4);
            spy = sandbox.spy();
            util.overlayActivityIds['3'] = [];
            util.commonOverlays = {addTextElement: stub2, addDraggableFunctionality: spy};
            util.finishElement.restore();
            util.finishElement({}, {}, {}, '3', util);
        });

        afterEach(function() {
            sandbox.restore();
        });

        /*it('should create id in overlayActivityId', function() {
            expect(stub1.overlayActivityIds['3']).to.have.lengthOf(1);
            expect(stub1.overlayActivityIds['3']).to.have.members([4]);
        });*/

        it('should call addDots', function() {
            expect(stub1.addDots.callCount).to.eql(1);
        });

        it('should call addHoverFunctionality', function() {
            expect(stub1.addHoverFunctionality.callCount).to.eql(1);
        });

        it('should call addTextElement', function() {
            expect(stub2.callCount).to.eql(1);
        });

        it('should call addDraggableFunctionality', function() {
            expect(spy.callCount).to.eql(1);
        });


    });

    describe('createVariableUl tests', function() {
        var out;

        beforeEach(function() {
            var data = {"a": {value: 1, valueInfo: {fileName: null}},
                "b": {value: null, valueInfo: {fileName: "tmp.pdf"}}};
            out = util.createVariableUl(data);
        });

        it('should return a ul', function() {
            expect(out.nodeName).to.eql("UL");
        });

        it('should have two list items as children', function() {
            expect(out.childElementCount).to.eql(2);
            expect(out.children[0].nodeName).to.eql("LI")
            expect(out.children[1].nodeName).to.eql("LI")
        });

        it('should contain the name of variables', function() {
            expect(out.children[0].innerHTML).to.contain("a");
            expect(out.children[1].innerHTML).to.contain("b");
        });

        it('should contain the value or filename of variables', function() {
            expect(out.children[0].innerHTML).to.contain(1);
            expect(out.children[1].innerHTML).to.contain("tmp.pdf");

        });
    });

    describe('isSelectedVariable tests', function() {
        var data = {'a': 'tmp', 'b': 5}, out;
        var localStorage, prefix = "var_", stub;

        beforeEach(function() {
            stub = sinon.stub();
            stub.withArgs(prefix + 'a').returns('true');
            stub.withArgs(prefix + 'b').returns('false');
            localStorage = {getItem: stub};
            out = util.filterVariables(localStorage, data, prefix);
        });

        it('should return out with only a', function() {
            expect(out).to.have.property('a');
            expect(out).to.not.have.property('b');
        });

        it('should call getItem twice', function() {
            expect(stub.calledTwice).to.eql(true);
        });
    });

    describe('addDots tests', function() {
        var html;

        beforeEach(function() {
            html = document.createElement('div');
            var child1 = document.createElement('ul');
            var child2 = document.createElement('ul');
            for(var i = 0; i < 3; i++) {
                var li = document.createElement('li');
                li.innerHTML = i;
                child1.appendChild(li);
            }
            html.append(child1);
            html.append(child2);
            util.variableNum = 2;
            util.addDots(html, util);
        });

        it('should have added one li to child 0', function() {
            expect(html.children[0].childElementCount).to.eql(4);
            expect(html.children[1].childElementCount).to.eql(0);
        });

        it('should have third item dots', function() {
            expect(html.children[0].children[2].className).to.eql("dots");
        });
    });

    describe('createDots tests', function() {
        var out, number = 4;

        beforeEach(function() {
            out = util.createDots(number);
        });

        it('should be a list item', function() {
            expect(out).to.be.an.instanceOf(window.Element);
            expect(out.nodeName).to.eql('LI');
        });

        it('should return (number) spa', function() {
            expect(out.children).to.have.length(number);
            expect(out.children[0].className).to.eql('dot');
        });
    });
});