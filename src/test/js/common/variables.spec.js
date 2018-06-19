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

    describe('addVariables tests', function() {
        var sandbox = sinon.createSandbox();
        var stub1, stub2;
        var spy1;
        var http;

        beforeEach(function() {
            spy1 = sandbox.spy();
            stub1 = sandbox.stub(util);
            util.addVariables.restore();
            util.handleVariableData.restore();
            util.handleVariableData = function(data, localStorage, html) { html.appendChild(document.createElement('UL'))};
            stub1.createVariableDiv.returns(document.createElement('DIV'));
            util.procDefId = "asdf1234";
            util.commonOptions = {getOption: sinon.stub().returns("true"), getOption: sinon.spy()};
            util.commonOverlays = {clearOverlays: spy1, setOffset: sinon.spy()};

            stub2 = sandbox.stub().returns({success: function(x) {
                    var instances = [{id: "test"}, {id: "hello"}];
                    x(instances);}
            });
            http = {get: stub2};
            var request1 = function() {return "x"};
            var request2 = function() {return "y"};

            var $q = {all: function() { return {then: function(x) { x();}}}};

            var viewer = {get: function(x) {
                if(x === 'elementRegistry') return [{businessObject: {id: 1}}];
                else return {};
            }};
            var control = {getViewer: function() {return viewer}};
            util.addVariables({}, $q, http, control,
                {bpmnElements: [{}, {}, {id: 2}]}, request1, request2, util);
        });
        afterEach(function () {
            sandbox.restore();
        });

        it('should call htpp get three times', function() {
            expect(stub2.callCount).to.eql(3);
        });
        it('should call createVariableDiv', function() {
            expect(stub1.createVariableDiv.callCount).to.eql(1);
        });
        it('should call clearOverlays', function() {
            expect(spy1.callCount).to.eql(1);
        });
        it('should call finishData', function() {
            expect(stub1.finishElement.callCount).to.eql(1);
        })
    });

    describe('createVariableDiv tests', function() {
        var out;

        beforeEach(function() {
            out = util.createVariableDiv();
        });

        it('should be a div item', function() {
            expect(out.nodeName).to.eql("DIV");
        });
        it('should return a variableTextSmall', function() {
            expect(out.classList.contains("variableTextSmall")).to.eql(true);
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
            util.commonOverlays = {addTextElement: stub2, addDraggableFunctionality: spy, setOffset: sinon.spy()};
            util.finishElement.restore();
            util.finishElement({}, {}, {}, '3', util);
        });

        afterEach(function() {
            sandbox.restore();
        });

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
            expect(out.children[0].nodeName).to.eql("LI");
            expect(out.children[1].nodeName).to.eql("LI");
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

    describe('filterVariables tests', function() {
        var data = {'a': 'tmp', 'b': 5}, out;
        var optionUtil, prefix = "var_", procDefId = "test";
        var stub;

        beforeEach(function() {
            stub = sinon.stub();
            var localStorage = {};
            stub.withArgs(localStorage, procDefId, "true", prefix, 'a').returns("true");
            stub.withArgs(localStorage, procDefId, "true", prefix, 'b').returns("false");
            optionUtil = {getOption: stub};
            out = util.filterVariables(data, localStorage, procDefId, prefix, optionUtil);
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