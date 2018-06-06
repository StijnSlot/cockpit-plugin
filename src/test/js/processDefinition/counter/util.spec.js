'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs = require('requirejs');
requirejs.config({
  baseUrl: '.'
});

var util;

before(function(done) {
  requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/counter/util'], function(utl) {
    util = utl;
    done();
  });
});

it('should find counter util file', function() {
  expect(util).to.not.be.undefined;
});

describe('check createHTML', function () {
    var executionSequenceCounter, html;

    describe('check create HTML', function () {
        beforeEach(function () {
            executionSequenceCounter = '6000';

            html = util.createHTML(executionSequenceCounter);
        });
        it('should return a div', function () {
            expect(html.nodeName).to.eql('DIV');
        });
        it('should contain executionSequenceCounter', function() {
            expect(html.innerText).to.contain(executionSequenceCounter);
        });
    });


});