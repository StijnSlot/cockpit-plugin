describe('Common duration tests', function () {
    var util;

    before(function (done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/duration'], function (utl) {
            util = utl;
            done();
        });
    });

    it('should find common duration util', function() {
        expect(util).to.exist;
    });

    describe('duration tests', function() {
        var sandbox = sinon.createSandbox();
        var spy;
        var stub1, stub2;

        beforeEach(function() {
            spy = sandbox.spy();
            stub1 = sandbox.stub(util);
            stub2 = sandbox.stub().returns(2);

            util.procDefId = "asdf1234";
            util.checkConditions.returns(true);
            util.commonConversion = {checkTimeUnit: sinon.spy(), calculateAvgCurDuration: stub2,
                                convertTimes: sinon.stub().returns(1)};

            var http = {get: sinon.spy()};
            var uri = {appUri: spy};
            var $q = {all: function() { return {then: function(x) {
                x([
                    {data: [{id: 1, avgDuration: 10, maxDuration: 50}]},
                    {data: [{activityId: 1}]}
                ]);
            }}}};

            var viewer = {get: function(x) {
                if(x === 'elementRegistry') return [{businessObject: {id: 1}}];
                else return {};
            }};
            var control = {getViewer: function() {return viewer}};

            util.duration.restore();
            util.duration(stub1, http, {}, uri, $q, control,
                {bpmnElements: [{}, {id: 1}]});
        });
        afterEach(function() {
            sandbox.restore();
        });

        it('should call calculateAvgCurDuration once', function() {
            expect(stub2.callCount).to.eql(1);
        });
        it('should call addOverlay once', function() {
            expect(stub1.addOverlay.callCount).to.eql(1);
        })
    });

    describe('addOverlay tests', function() {
        var sandbox = sinon.createSandbox();
        var stub;

        before(function(done) {
            requirejs(['main/resources/plugin-webapp/centaur/app/common/overlays'], function (utl) {
                stub = util.commonOverlays = sandbox.stub(utl);
                util.addOverlay(util, {}, {}, "a", {}, "b", "c");
                done();
            });
        });
        after(function() {
            sandbox.restore();
        });

        it('should call clearOverlays', function() {
            expect(stub.clearOverlays.callCount).to.eql(1);
        });
        it('should call addTextElement', function() {
            expect(stub.addTextElement.callCount).to.eql(1);
        });
        it('should call addDraggableFunctionality', function() {
            expect(stub.addDraggableFunctionality.callCount).to.eql(1);
        });
        it('should call getOffset', function() {
            expect(stub.getOffset.callCount).to.eql(1);
        });
    });

    describe('checkConditions tests', function () {
        var avgDuration, maxDuration;
        var returnValue;
        describe('check if conditions are checked correctly', function () {
    
           beforeEach(function () {
               avgDuration = '4';
               maxDuration = '12';
               returnValue = util.checkConditions(avgDuration, maxDuration);
           });
    
           it('should condition is true when arguments are valid', function () {
               expect(returnValue).to.eql(true);
           });
           it('should condition is false when arguments are invalid', function(){
               maxDuration = null;
               expect(util.checkConditions(maxDuration)).to.eql(false);
            });
            it('should condition is false when arguments are invalid', function(){
                avgDuration = null;
                expect(util.checkConditions(maxDuration)).to.eql(false);
            });
            it('should condition is false when average is invalid', function(){
                avgDuration = 0;
                expect(util.checkConditions(maxDuration)).to.eql(false);
            });
        });
    });

    describe('checkIfCurValid tests', function () {
        var curDuration;
        var returnValue;

        describe('check if curDuration has the right value', function () {
            before(function(done) {
                requirejs(['main/resources/plugin-webapp/centaur/app/common/conversion'], function(utl) {
                    util.commonConversion = utl;
                    done();
                });
            });
            beforeEach(function () {
                curDuration = 6000;
                returnValue = util.checkIfCurValid(util, curDuration);
            });

            it('should returns correct values', function () {
                expect(returnValue).to.eql('6 s');
            });
            it('should returns nothing when null', function(){
                curDuration = null;
               expect(util.checkIfCurValid(util, curDuration)).to.eql('-');
            });
        });
    });

    describe('createHTML tests', function() {
        var stub;
        var cur = "cur", avg = "avg", max = "max";
        var className = "test", category = "test";
        var out;

        beforeEach(function() {
            stub = sinon.stub().returns("true");
            stub.onSecondCall().returns("false");
            util.commonOptions.getOption = stub;
            out = util.createHTML(util, {}, cur, avg, max, className, category);
        });

        it('should return a div', function() {
            expect(out.nodeName).to.eql('DIV');
        });
        it('should return className test', function() {
            expect(out.className).to.contain(className);
        });
        it('should not set avg', function() {
            expect(out.firstChild.children).to.have.lengthOf(2);
            expect(out.firstChild.children[1].innerHTML).to.not.contain(avg);
        })
    });
});