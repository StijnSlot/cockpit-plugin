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
        var stub1, stub2, spy1;
        var http, $q, viewer, control, req1, req2;

        beforeEach(function() {
            spy1 = sandbox.spy();
            stub1 = sandbox.stub(util);
            util.addVariables.restore();
            util.handleVariableData.restore();
            util.handleVariableData = function(data, localStorage, html) {html.appendChild(document.createElement('UL'))};
            stub1.createVariableDiv.returns(document.createElement('DIV'));
            util.procDefId = "asdf1234";
            util.commonOptions = {getOption: sinon.stub().returns("true")};
            util.commonOverlays = {clearOverlays: spy1, getOffset: sinon.spy()};

            stub2 = sandbox.stub().returns({success: function(x) {
                    var instances = [{id: "test"}, {id: "hello"}];
                    x(instances);}
            });
            http = {get: stub2};
            req1 = function() {return "x"};
            req2 = function() {return "y"};

            $q = {all: function() { return {then: function(x) { x();}}}};

            viewer = {get: function(x) {
                if(x === 'elementRegistry') return [{businessObject: {id: 1}}];
                else return {};
            }};
            control = {getViewer: function() {return viewer}};
            util.addVariables({}, $q, http, control,
                {bpmnElements: [{}, {}, {id: 2}]}, req1, req2, util);
        });
        afterEach(function () {
            sandbox.restore();
        });

        it('should call createVariableDiv', function() {
            expect(stub1.createVariableDiv.callCount).to.eql(1);
        });
        it('should call clearOverlays', function() {
            expect(spy1.callCount).to.eql(1);
        });
        it('should call finishData', function() {
            expect(stub1.finishElement.callCount).to.eql(1);
        });
        it('should not call finishElement if getOption is false', function() {
            stub1.finishElement.reset();
            util.commonOptions.getOption.returns("false");
            util.addVariables({}, $q, http, control,
                {bpmnElements: [{}, {}, {id: 2}]}, req1, req2, util);
            expect(stub1.finishElement.callCount).to.eql(0);
        });
        it('should not call finishElement if no variables in html', function() {
            stub1.finishElement.reset();
            stub1.createVariableDiv.returns(document.createElement('DIV'));
            util.handleVariableData = sandbox.spy();
            util.addVariables({}, $q, http, control,
                {bpmnElements: [{}, {}, {id: 2}]}, req1, req2, util);
            expect(stub1.finishElement.callCount).to.eql(0);
        })
    });

    describe('handleVariableData tests', function() {
        var html;

        beforeEach(function() {
            html = document.createElement('DIV');
            var utl = {filterVariables: sinon.spy(),
                createVariableUl: sinon.stub().returns(document.createElement('UL'))};
            util.handleVariableData([], {}, html, utl);
        });

        it('should add UL to html', function() {
            expect(html.childElementCount).to.eql(1);
            expect(html.children[0].nodeName).to.eql('UL');
        });
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
            util.commonOverlays = {addTextElement: stub2, addDraggableFunctionality: spy,
                getOffset: sinon.spy(), setOffset: sinon.spy()};
            util.finishElement.restore();
            util.finishElement({}, {}, {}, '3', util);
            spy.args[0][4]();
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('should call addDots', function() {
            expect(stub1.addDots.callCount).to.eql(1);
        });
        it('should add hover and drag functionality', function() {
            expect(stub1.addHoverFunctionality.callCount).to.eql(1);
            expect(spy.callCount).to.eql(1);
        });
        it('should call addTextElement', function() {
            expect(stub2.callCount).to.eql(1);
        });
    });

    describe('createVariableUl tests', function() {
        var out;

        beforeEach(function() {
            var data = {"a": {value: 1, valueInfo: {fileName: null}},
                "b": {value: null, valueInfo: {fileName: "tmp.pdf"}}};
            out = util.createVariableUl(data);
        });

        it('should return a ul with two children', function() {
            expect(out.nodeName).to.eql("UL");
            expect(out.childElementCount).to.eql(2);
            expect(out.children[0].nodeName).to.eql("LI");
            expect(out.children[1].nodeName).to.eql("LI");
        });
        it('should contain the values of variables', function() {
            expect(out.children[0].innerHTML).to.contain("a");
            expect(out.children[1].innerHTML).to.contain("b");
            expect(out.children[0].innerHTML).to.contain(1);
            expect(out.children[1].innerHTML).to.contain("tmp.pdf");
        });
        it('should return * no variables * if no variable data', function() {
            out = util.createVariableUl({});
            expect(out.children[0].innerHTML).to.contain("no variables");
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
                child1.appendChild(li);
                li = document.createElement('li');
                child2.appendChild(li);
            }
            html.append(child1);
            html.append(child2);
            util.variableNum = 4;
            util.addDots(html, util);
        });

        it('should have added one dots to child 1', function() {
            expect(html.children[0].childElementCount).to.eql(3);
            expect(html.children[1].childElementCount).to.eql(4);
            expect(html.children[1].children[1].className).to.eql("dots");
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

    describe('addHoverFunctionality tests', function() {
        var html, ul, ul2, li1, li2, li3;
        var spy;

        beforeEach(function() {
            spy = sinon.spy();
            jQuery.fn.extend({hover: spy});

            html = document.createElement('DIV');
            ul = document.createElement('UL');
            ul2 = document.createElement('UL');
            li1 = document.createElement('LI');
            li2 = document.createElement('LI');
            li3 = document.createElement('LI');
            li2.className = "dots";
            ul.appendChild(li1);
            ul2.appendChild(li2);
            ul2.appendChild(li3);
            html.appendChild(ul);
            html.appendChild(ul2);

            util.addHoverFunctionality(html);
        });

        it('should call hover', function() {
            expect(spy.callCount).to.eql(1);
        });
        it('should set className variableTextFull upon hover and unhide below dots', function() {
            spy.args[0][0]();
            expect(html.className).to.contain("variableTextFull");
            expect(html.className).to.not.contain("variableTextSmall");
            expect(li3.style.display).to.not.eql("none");
        });
        it('should set className variableTextSmall upon hover', function() {
            spy.args[0][1]();
            expect(html.className).to.not.contain("variableTextFull");
            expect(html.className).to.contain("variableTextSmall");
            expect(li3.style.display).to.eql("none");
        });
        it('should only display li1 and li2', function() {
            expect(li1.style.display).to.not.eql("none");
            expect(li2.style.display).to.not.eql("none");
            expect(li3.style.display).to.eql("none");
        });
    });
});