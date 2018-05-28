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
    requirejs(['main/resources/plugin-webapp/centaur/app/diagram/instanceVar/util'], function(utl) {
        util = utl;
        done();
    });
});

it('should find util for instanceVar', function() {
    expect(util).to.exist;
});

describe('createDOMElement tests', function() {
    var spy;
    var data = [{id: 1, name: 'amount', data: '500', clickable: false},
        {id: 2, name: 'docu', data: 'test', clickable: true}];
    var uri;
    var out;

    beforeEach(function() {
        spy = sinon.spy();
        uri = {appUri: spy};

        out = util.createDOMElement(uri, data);
    });

    it('it should call uri once with id 2', function() {
        expect(spy.calledOnce).to.eql(true);
        expect(spy.calledWith("engine://engine/:engine/variable-instance/2/data")).to.eql(true);
    });

    it('should return a DOM element', function() {
        expect(out).to.be.an.instanceOf(window.Element);
    });

    it('should contain 2 children', function() {
        expect(out.children).to.have.lengthOf.at.least(2)
    });

    it('should have first child with data[0]', function() {
        expect(out.firstChild).to.be.an.instanceOf(window.Element);
        expect(out.firstChild.innerHTML).to.contain(data[0].name);
        expect(out.firstChild.innerHTML).to.contain(data[0].data);
    });

    it('should have second child with data[1]', function() {
        expect(out.children[1]).to.be.an.instanceOf(window.Element);
        expect(out.children[1].innerHTML).to.contain(data[1].name);
        expect(out.children[1].innerHTML).to.contain(data[1].data);
        expect(out.children[1].innerHTML).to.contain("<a");
    });
});

describe('isSelectedVariable tests', function() {
    it('should return true', function() {
        var stub = sinon.stub().returns('true');
        var localStorage = {getItem: stub};
        var out = util.isSelectedVariable(localStorage, 'a');
        expect(out).to.eql(true);
        expect(stub.calledOnce).to.eql(true);
    });

    it('should return false', function() {
        var stub = sinon.stub().returns('false');
        var localStorage = {getItem: stub};
        var out = util.isSelectedVariable(localStorage, 'a');
        expect(out).to.eql(false);
        expect(stub.calledOnce).to.eql(true);
    });
});

describe('transformVariableData tests', function() {
    it('should set id to data id', function() {
        var out = util.transformVariableData({id: 123});
        expect(out.id).to.eql(123);
    });

    it('should give correct name to output', function() {
        var out = util.transformVariableData({name: "-$%^#qwérty"});
        expect(out.name).to.eql("-$%^#qwérty");
    });

    it('should return a string', function() {
        var out = util.transformVariableData({type: "string", text: "test&*(@3"});
        expect(out.data).to.eql("test&*(@3");
    });

    it('should return string value of double', function() {
        var out = util.transformVariableData({type: "double", double_: 0.5});
        expect(out.data).to.eql("0.5");
    });

    it('should return string value of int', function() {
        var out = util.transformVariableData({type: "integer", long_: 420});
        expect(out.data).to.eql("420");
    });

    it('should show text2 for files', function() {
        var out = util.transformVariableData({type: "file", text2: "abc.pdf"});
        expect(out.data).to.eql("abc.pdf");
    });

    it('should set clickable only for files', function() {
        var out = util.transformVariableData({type: "file", text2: "abc.pdf"});
        expect(out.clickable).to.eql(true);
        out = util.transformVariableData({type: "string", text: "hello"});
        expect(out.clickable).to.eql(false);
    });

    it('should return a boolean string of true/false', function() {
        var out = util.transformVariableData({name: "b", type: "boolean", long_: 1});
        expect(out.data).to.eql("true");
        out = util.transformVariableData({name: "b", type: "boolean", long_: 0});
        expect(out.data).to.eql("false");
    });
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
    var overlayIds = [1, 2, -3];

    beforeEach(function() {
        spy = sinon.spy();
        overlays = {remove: spy};

        util.clearOverlays(overlays, overlayIds);
    });

    it('should call remove for all ids', function() {
        expect(spy.calledWith(1)).to.eql(true);
        expect(spy.calledWith(2)).to.eql(true);
        expect(spy.calledWith(-3)).to.eql(true);
    });

    it('should return overlayIds empty', function() {
        expect(overlayIds).to.be.empty;
    })
});