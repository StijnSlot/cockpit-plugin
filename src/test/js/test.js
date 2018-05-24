'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs  = require('requirejs');
requirejs.config({
    baseUrl: '../..'
});
//var options = require('../../main/resources/plugin-webapp/centaur/app/bottomTabs/options/util');

describe('testestest', function() {
    it('heck', function() {
        expect(420).to.eql(420);
    });
});

describe('options', function() {
    var options;

    before(function(done) {
        console.log('fired');
        requirejs(['main/resources/plugin-webapp/centaur/app/bottomTabs/options/util'], function(util) {
            options = util;
            done();
        });
    });

    it('should return 1 for test', function() {
        expect(options.test()).to.eql(1);
    });
});

