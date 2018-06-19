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
        var http, uri;

        beforeEach(function() {
            spy = sandbox.spy();
            stub1 = sandbox.stub(util, "setCounter");
            util.commonOptions = {getOption: sinon.stub().returns("true")};
            util.commonOverlays = {clearOverlays: spy};

            stub2 = sandbox.stub().returns({success: function(x) {
                    var instances = [{}, {}];
                    x(instances);}
            });
            http = {get: stub2};
            uri = {appUri: sinon.spy()};

            var viewer = {get: function(x) {
                    if(x === 'elementRegistry') return [{businessObject: {id: 1}}];
                    else return {};
                }};
            var control = {getViewer: function() {return viewer}};
            util.getCounterData({}, http, uri, control,
                {bpmnElements: [{}, {$type: 'bpmn:CallActivity'}]}, util);
        });
        afterEach(function () {
            sandbox.restore();
        });

        it('should call clearOverlays', function() {
            expect(spy.callCount).to.eql(1);
        });
        it('should make 1 http request', function() {
            expect(stub2.callCount).to.eql(1);
        });
        it('should call setCounter', function() {
            expect(stub1.callCount).to.eql(1);
        });
    });

    describe('setCounter tests', function() {
        var spy, obj;

        beforeEach(function() {
            spy = sinon.spy();
            var element1 = {activityId: 1, name: "nrOfInstances", counter: 3};
            var element2 = {activityId: 1, name: "nrOfCompletedInstances", counter: 1};
            var element3 = {activityId: 1, name: "somethingElse", counter: -1};
            var element4 = {activityId: 2, name: "nrOfInstances", counter: 6};
            var data = [element1, element2, element3, element4];
            util.setCounter(data, {id: 1}, spy);
            obj = spy.args[0][0];
        });

        it('should return an object', function() {
            expect(obj).to.exist;
        });
        it('should call the callback', function() {
            expect(spy.callCount).to.eql(1);
        });
        it('should return one object with 2 keys', function() {
            expect(Object.keys(obj)).to.have.lengthOf(2);
        });
        it('should return sequenceCounter 3', function() {
            expect(obj.sequenceCounter).to.eql(3);
        });
        it('should return completed 1', function() {
            expect(obj.completedCounter).to.eql(1);
        });
    });

    describe('addOverlay tests', function() {
        var spy1, spy2;
        var sandbox = sinon.createSandbox();

        beforeEach(function() {
            spy1 = sandbox.spy(util, "createHTML");
            spy2 = sandbox.spy();
            util.commonOverlays = {setOffset: sandbox.spy(), addDraggableFunctionality: sandbox.spy(), addTextElement: spy2};
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
    });

    describe('createHTML tests', function () {
        var counter, html;

        beforeEach(function () {
            counter = 6000;
            html = util.createHTML({sequenceCounter: counter});
        });

        it('should return a div', function () {
            expect(html.nodeName).to.eql('DIV');
        });
        it('should have counter-text class', function() {
            expect(html.classList.contains("counter-text")).to.eql(true);
        });
        it('should contain counter', function() {
            expect(html.innerHTML).to.contain(counter);
        });
    });
});