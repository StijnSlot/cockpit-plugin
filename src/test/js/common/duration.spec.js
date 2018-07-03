describe('Common duration tests', function () {
    var util;
    var http, uri, control, viewer, $q

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

            http = {get: sinon.spy()};
            uri = {appUri: spy};
            $q = {all: function() { return {then: function(x) {
                x([
                    {data: [{id: 1, avgDuration: 10, maxDuration: 50}]},
                    {data: [{activityId: 1}]}
                ]);
            }}}};

            viewer = {get: function(x) {
                if(x === 'elementRegistry') return [{businessObject: {id: 1}}];
                else return {};
            }};
            control = {getViewer: function() {return viewer}};

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
        });
        it('should not call addOverlay if activity is null or !checkConditions', function() {
            stub1.addOverlay.reset();
            util.duration(stub1, http, {}, uri, $q, control,
                {bpmnElements: [{}, {id: -1}]});
            stub1.checkConditions.returns(false);
            util.duration(stub1, http, {}, uri, $q, control,
                {bpmnElements: [{}, {id: 1}]});
            expect(stub1.addOverlay.callCount).to.eql(0);
        });
    });

    describe('addOverlay tests', function() {
        var sandbox = sinon.createSandbox();
        var stub;

        before(function(done) {
            requirejs(['main/resources/plugin-webapp/centaur/app/common/overlays'], function (utl) {
                stub = util.commonOverlays = sandbox.stub(utl);
                util.addOverlay(util, {}, {}, "a", {}, "b", "c");
                util.addOverlay(util, {}, {}, "a", {}, "b", "c");   // for coverage purposes
                done();
            });
        });
        after(function() {
            sandbox.restore();
        });

        it('should call initialise functions', function() {
            expect(stub.clearOverlays.callCount).to.eql(2);
            expect(stub.addTextElement.callCount).to.eql(2);
            expect(stub.addDraggableFunctionality.callCount).to.eql(2);
            expect(stub.getOffset.callCount).to.eql(2);
        });
        it('should give correct setOffset function', function() {
            stub.addDraggableFunctionality.args[0][4]();
            expect(stub.setOffset.callCount).to.eql(1);
        })
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

        describe('do set properties', function() {
            beforeEach(function() {
                stub = sinon.stub().returns("true");
                util.commonOptions.getOption = stub;
                out = util.createHTML(util, {}, cur, avg, max, className, category);
            });

            it('should return a div with class test', function() {
                expect(out.nodeName).to.eql('DIV');
                expect(out.className).to.contain(className);
            });
            it('should set all properties', function() {
                expect(out.firstChild.children).to.have.lengthOf(3);
                expect(out.firstChild.children[0].innerHTML).to.contain(cur);
                expect(out.firstChild.children[1].innerHTML).to.contain(avg);
                expect(out.firstChild.children[2].innerHTML).to.contain(max);
            })
        });

        describe('do not set properties', function() {
            beforeEach(function() {
                stub = sinon.stub().returns("false");
                util.commonOptions.getOption = stub;
                out = util.createHTML(util, {}, cur, avg, max, className, category);
            });

            it('should set all properties', function() {
                expect(out.firstChild.children).to.have.lengthOf(0);
            });
        });
    });
});