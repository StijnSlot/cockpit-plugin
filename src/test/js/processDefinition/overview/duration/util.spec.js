describe('duration process definition tests', function() {
    var util, common;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/overview/duration/util',
            'main/resources/plugin-webapp/centaur/app/common/duration'], function(utl1, utl2) {
            util = utl1;
            common = utl2;
            done();
        });
    });

    it('should find duration util file', function() {
        expect(util).to.exist;
        expect(common).to.exist;
    });

    describe('duration tests', function() {
        var sandbox = sinon.createSandbox();
        var elementRegistry, viewer, control, http, uri, $q;
        var stub1, stub2;

        beforeEach(function() {
            spy = sandbox.spy();
            stub1 = sandbox.stub(common);
            stub2 = sandbox.stub().returns(5);

            http = {get: sinon.spy()};
            uri = {appUri: sinon.spy()};

            common.procDefId = "dasfkl";
            common.checkConditions.returns(true);
            common.commonConversion = {checkTimeUnit: sinon.spy(), calculateAvgCurDuration: stub2,
                convertTimes: sinon.stub().returns(1)};

            elementRegistry = [{businessObject: {id: 1}, type: "bpmn:StartEvent"}];
            viewer = {get: function(x) {
                if(x === 'elementRegistry') return elementRegistry;
                else return {};
            }};
            control = {getViewer: function() {return viewer}};

            $q = {all: function() { return {then: function(x) {
                x([
                    {data: [{id: 1, avgDuration: 10, maxDuration: 50}]},
                    {data: [{activityId: 1}]}
                ]);
            }}}};

            util.duration(stub1, http, {}, uri, $q, control,
                {bpmnElements: [{}, {id: 1}]});
        });
        afterEach(function() {
            sandbox.restore();
        });

        it('should call addOverlay once', function() {
            expect(stub1.addOverlay.callCount).to.eql(1);
        });
        it('should call calculateAvgCurDuration once', function() {
            expect(stub2.callCount).to.eql(1);
        });
        it('should not call addOverlay if shape type is not startevent', function() {
            stub1.addOverlay.reset();
            elementRegistry = [{businessObject: {id: 1}, type: "bpmn:EndEvent"}];
            util.duration(stub1, http, {}, uri, $q, control,
                {bpmnElements: [{}, {id: 1}]});
            expect(stub1.addOverlay.callCount).to.eql(0);
        });
        it('should not call addOverlay if checkConditions is false', function() {
            stub1.addOverlay.reset();
            common.checkConditions.returns(false);
            util.duration(stub1, http, {}, uri, $q, control,
                {bpmnElements: [{}, {id: 1}]});
            expect(stub1.addOverlay.callCount).to.eql(0);
        });
    });
});




