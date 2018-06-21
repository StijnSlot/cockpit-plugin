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
        var spy;
        var stub1, stub2;

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
                var $q = {all: function () {return {then: function (x) {
                    x([
                        {data: [{id: 1, avgDuration: 10, maxDuration: 50}]},
                        {data: [{activityId: 1}]}
                    ]);
                }}}};
                var http = {get: sinon.spy()};
                var uri = {appUri: spy};
                var viewer = {
                    get: function (x) {
                        if (x === 'elementRegistry') return [{businessObject: {id: 1}, type: "bpmn:StartEvent"}];
                        else return {};
                    }
                };
                var control = {
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
            })
        });
    });
});