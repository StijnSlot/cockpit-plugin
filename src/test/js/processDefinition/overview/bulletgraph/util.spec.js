describe('bulletGraph process definition tests', function() {
    var util, common;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/overview/bulletgraph/util'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should find duration util file', function() {
        expect(util).to.exist;
    });

    describe('bulletgraph tests', function() {
        var sandbox = sinon.createSandbox();
        var spy, stub1, stub2;
        var $q, viewer, control, elementRegistry, http, uri;

        before(function(done) {
            requirejs(['main/resources/plugin-webapp/centaur/app/common/bulletgraph'], function(utl) {
                common = utl;
                done();
            });
        });

        it('should find duration util file', function() {
            expect(common).to.exist;
        });

        describe('selected in options', function () {
            beforeEach(function () {
                spy = sandbox.spy();
                stub1 = sandbox.stub(common);
                stub2 = sandbox.stub().returns(2);
                $q = {all: function () {return {then: function (x) {
                    x([
                        {data: [{id: 1, avgDuration: 10, maxDuration: 50}]},
                        {data: [{activityId: 1}]}
                    ]);
                }}}};
                http = {get: sinon.spy()};
                uri = {appUri: spy};
                elementRegistry = [{businessObject: {id: 1}, type: "bpmn:StartEvent"}];
                viewer = {
                    get: function (x) {
                        if (x === 'elementRegistry') return elementRegistry;
                        else return {};
                    }
                };
                control = {
                    getViewer: function () {
                        return viewer
                    }
                };

                common.procDefId = "asdf1234";
                common.commonOptions = {getOption: sinon.stub().returns("true")};
                common.commonConversion = {calculateAvgCurDuration: stub2};

                util.bulletgraph(stub1, http, {}, uri, $q, control,
                    {bpmnElements: [{}, {id: 1}]});
            });
            afterEach(function () {
                sandbox.restore();
            });

            it('should call appUri twice', function() {
                expect(spy.callCount).to.eql(2);
            });
            it('should call calculateAvgCurDuration once', function () {
                expect(stub2.callCount).to.eql(1);
            });
            it('should call combineBulletgraphElements once', function () {
                expect(stub1.combineBulletgraphElements.callCount).to.eql(1);
            });
            it('should not call combineBulletgraphElements if getOption is false', function() {
                stub1.combineBulletgraphElements.reset();
                common.commonOptions.getOption.returns("false");
                util.bulletgraph(stub1, http, {}, uri, $q, control,
                    {bpmnElements: [{}, {id: 1}]});
                expect(stub1.combineBulletgraphElements.callCount).to.eql(0);
            });
            it('should not call combineBulletgraphElements if shape is not startEvent', function() {
                stub1.combineBulletgraphElements.reset();
                elementRegistry = [{businessObject: {id: 1}, type: "bpmn:EndEvent"}];
                util.bulletgraph(stub1, http, {}, uri, $q, control,
                    {bpmnElements: [{}, {id: 1}]});
                expect(stub1.combineBulletgraphElements.callCount).to.eql(0);
            });
        });
    });
});