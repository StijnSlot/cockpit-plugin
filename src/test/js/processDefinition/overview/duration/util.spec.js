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
        var spy;
        var stub1, stub2;

        beforeEach(function() {
            spy = sandbox.spy();
            stub1 = sandbox.stub(common);
            stub2 = sandbox.stub().returns(5);

            var http = {get: sinon.spy()};
            var uri = {appUri: spy};

            common.procDefId = "dasfkl";
            common.checkConditions.returns(true);
            common.commonConversion = {checkTimeUnit: sinon.spy(), calculateAvgCurDuration: stub2,
                convertTimes: sinon.stub().returns(1)};

            var viewer = {get: function(x) {
                if(x === 'elementRegistry') return [{businessObject: {id: 1}, type: "bpmn:StartEvent"}];
                else return {};
            }};
            var control = {getViewer: function() {return viewer}};

            var $q = {all: function() { return {then: function(x) {
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
        it('should call appUri twice', function() {
            expect(spy.callCount).to.eql(2);
        });
        it('should call calculateAvgCurDuration once', function() {
            expect(stub2.callCount).to.eql(1);
        });
    });
});




