describe('check counter util', function () {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/counter/util'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should find counter util file', function() {
        expect(util).to.exist
    });

    describe('getCounterData tests', function() {
        var sandbox = sinon.createSandbox();
        var stub1, stub2;
        var spy;
        var http, uri, viewer, control, elementRegistry;

        beforeEach(function() {
            spy = sandbox.spy();
            stub1 = sandbox.stub(util, "setCounter");
            util.commonOptions = {getOption: sinon.stub().returns("true")};
            util.commonOverlays = {clearOverlays: spy};
            sandbox.stub(util, "addOverlay");

            stub2 = sandbox.stub().returns({success: function(x) {
                    var instances = [{}, {}];
                    x(instances);}
            });
            http = {get: stub2};
            uri = {appUri: sandbox.spy()};
            elementRegistry = [{businessObject: {id: 1}, type: "bpmn:CallActivity"}];
            viewer = {get: function(x) {
                    if(x === 'elementRegistry') return elementRegistry;
                    return {};
                }};
            control = {getViewer: function() {return viewer}};
            util.getCounterData({}, http, uri, control,
                {bpmnElements: [{}, {id: 1}]}, util);
        });
        afterEach(function () {
            sandbox.restore();
        });

        it('should call clearOverlays', function() {
            expect(spy.callCount).to.eql(1);
        });
        it('should call setCounter with function addOverlay', function() {
            expect(stub1.callCount).to.eql(1);
            stub1.args[0][2]();
            expect(util.addOverlay.callCount).to.eql(1);
        });
        it('should not call setCounter if getOption is false', function() {
            stub1.reset();
            util.commonOptions.getOption.returns("false");
            util.getCounterData({}, http, uri, control,
                {bpmnElements: [{}, {id: 1}]}, util);
            expect(stub1.callCount).to.eql(0);
        });
        it('should not call setCounter if type is not callActivity', function() {
            stub1.reset();
            elementRegistry = [{businessObject: {id: 1}, type: "bpmn:StartEvent"}];
            util.getCounterData({}, http, uri, control,
                {bpmnElements: [{}, {id: 1}]}, util);
            expect(stub1.callCount).to.eql(0);
        });
    });

    describe('setCounter tests', function() {
        var spy, obj;

        beforeEach(function() {
            spy = sinon.spy();
            var element1 = {activityId: 1, name: "nrOfInstances", counter: 3};
            var element2 = {activityId: 1, name: "nrOfCompletedInstances", counter: 1};
            var element3 = {activityId: 1, name: "somethingElse", counter: 100};
            var element4 = {activityId: 2, name: "nrOfInstances", counter: 6};
            var element5 = {activityId: 1, name: "nrOfInstances", counter: -6};
            var data = [element1, element2, element3, element4];
            util.setCounter(data, {id: 1}, spy);
            obj = spy.args[0][0];
        });

        it('should call the callback with an object', function() {
            expect(obj).to.exist;
            expect(spy.callCount).to.eql(1);
        });
        it('should return one object with 2 keys', function() {
            expect(Object.keys(obj)).to.have.lengthOf(2);
        });
        it('should return counters', function() {
            expect(obj.sequenceCounter).to.eql(3);
            expect(obj.completedCounter).to.eql(1);
        });
        it('should not call callback without counters', function() {
            //spy.reset();
            util.setCounter([], {id: 1}, spy);
            expect(spy.callCount).to.eql(1);
        });
    });

    describe('addOverlay tests', function() {
        var spy1, spy2;
        var sandbox = sinon.createSandbox();

        beforeEach(function() {
            spy1 = sandbox.spy(util, "createHTML");
            spy2 = sandbox.spy();
            util.commonOverlays = {getOffset: sandbox.spy(), setOffset: sandbox.spy(),
                addDraggableFunctionality: sandbox.spy(), addTextElement: spy2};
            util.addOverlay({}, util, {}, {}, 1);
        });
        afterEach(function() {
            sandbox.restore();
        });

        it('should call createHTML', function() {
            expect(spy1.callCount).to.eql(1);
        });
        it('should call addTextElement', function() {
            expect(spy2.callCount).to.eql(1);
        });
        it('should give offset function', function() {
            util.commonOverlays.addDraggableFunctionality.args[0][4]();
            expect(util.commonOverlays.setOffset.callCount).to.eql(1);
        })
    });

    describe('createHTML tests', function () {
        var html;

        beforeEach(function () {
            var counter = {sequenceCounter: 6000, completedCounter: 1234};
            html = util.createHTML(counter);
        });

        it('should return a div with class counter-text', function () {
            expect(html.nodeName).to.eql('DIV');
            expect(html.classList.contains("counter-text")).to.eql(true);
        });
        it('should contain both counters', function() {
            expect(html.innerHTML).to.contain(6000);
            expect(html.innerHTML).to.contain(1234);
        });
        it('should not set counters if not set', function() {
            html = util.createHTML({});
            expect(html.innerHTML).to.not.contain(6000);
            expect(html.innerHTML).to.not.contain(1234);
        })
    });
});