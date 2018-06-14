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
        var tr1, tr2;

        beforeEach(function() {
            // create html
            var table = document.createElement('TABLE');
            table.className = "process-definitions-list";
            var thead = document.createElement('THEAD');
            var tbody = document.createElement('TBODY');
            tr1 = document.createElement('TR');
            tr2 = document.createElement('TR');

            // append html
            thead.appendChild(tr1);
            tbody.appendChild(tr2);
            table.appendChild(thead);
            table.appendChild(tbody);
            document.body.append(table);

            util.putCheckboxes();
        });
        it('should add title to thead', function() {
            expect(tr1.childElementCount).to.eql(1);
            expect(tr1.firstChild.nodeName).to.eql("TH");
        });
        it('should add checkboxes to tbody', function() {
            expect(tr2.childElementCount).to.eql(1);
            expect(tr2.firstChild.nodeName).to.eql("TD");
            expect(tr2.firstChild.firstChild.nodeName).to.eql("INPUT");
            expect(tr2.firstChild.firstChild.getAttribute("type")).to.eql("checkbox");
        });
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

    /*describe('getSelectedIds tests', function() {
        var out;

        beforeEach(function() {
            // create html
            var table = document.createElement('TABLE');
            table.className = "process-definitions-list";
            var tbody = document.createElement('TBODY');
            var tr = document.createElement('TR');
            var td1 = document.createElement('TD');
            td1.className = "name";
            var link = document.createElement('A');
            link.setAttribute("href", "#/test/test_process:1");
            var td2 = document.createElement('TD');
            var input = document.createElement('INPUT');
            input.setAttribute("checked", "true");

            // append html
            td1.appendChild(link);
            td2.appendChild(input);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
            table.appendChild(tbody);
            document.body.append(table);

            out = util.getSelectedIds();
        });
        it('should return array of size 1', function() {
            expect(out).to.have.lengthOf(1);
        });
        it('should return test_process:1', function() {
            expect(out[0]).to.eql("test_process:1");
        });
    });*/

    describe('deleteProcessDefinition tests', function() {
        var http, Uri, q, ids = ["asad", "hello"];
        var spy, stub1, stub2;
        beforeEach(function() {
            spy = sinon.spy();
            Uri = {appUri: spy};
            stub1 = sinon.stub().returns(new Promise(function() {}));
            http = {delete: stub1};
            stub2 = sinon.stub().returns(new Promise(function() {}));
            q = {all: stub2};
            util.deleteProcessDefinition(http, q, Uri, ids);
        });
        it('should call uri twice', function() {
            expect(spy.callCount).to.eql(2);
        });
        it('should call http delete twice', function() {
            expect(stub1.callCount).to.eql(2);
        });
        it('should call q.all once with one argument', function() {
            expect(stub2.callCount).to.eql(1);
            expect(stub2.args).to.have.lengthOf(1);
        });
        it('should call q.all with two promises', function() {
            expect(stub2.firstCall.args[0]).to.have.lengthOf(2);
            expect(stub2.firstCall.args[0][0]).to.be.instanceOf(Promise);
        });
    });
});