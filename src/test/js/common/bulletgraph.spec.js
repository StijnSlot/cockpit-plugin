describe('Common bulletgraph tests', function () {
    var util;

    before(function (done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/bulletgraph'], function (utl) {
            util = utl;
            done();
        });
    });
    
    it('should find common duration util', function() {
        expect(util).to.exist;
    });

    describe('bulletgraph tests', function() {
        var sandbox = sinon.createSandbox();
        var spy1, spy2;
        var stub1, stub2;

        describe('selected in options', function() {
            beforeEach(function() {
                spy1 = sandbox.spy();
                spy2 = sandbox.spy();
                stub1 = sandbox.stub(util);
                stub2 = sandbox.stub().returns(2);

                util.procDefId = "asdf1234";
                util.commonOptions = {getOption: sinon.stub().returns("true")};
                util.commonConversion = {calculateAvgCurDuration: stub2};

                var http = {get: sinon.spy()};
                var uri = {appUri: spy2};
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

                util.bulletgraph.restore();
                util.bulletgraph(stub1, http, {}, uri, $q, control,
                    {bpmnElements: [{}, {id: 1}]});
            });
            afterEach(function() {
                sandbox.restore();
            });

            it('should call calculateAvgCurDuration once', function() {
                expect(stub2.callCount).to.eql(1);
            });
            it('should call combineBulletgraphElements once', function() {
                expect(stub1.combineBulletgraphElements.callCount).to.eql(1);
            })
        });

        describe('bulletgraph not selected', function() {
            beforeEach(function() {
                spy1 = sandbox.spy();
                stub1 = sandbox.stub(util);

                util.procDefId = "asdf1234";
                util.commonOptions = {getOption: sinon.stub().returns("false")};
                util.commonOverlays = {clearOverlays: spy1};

                var viewer = {get: function(x) {
                        if(x === 'elementRegistry') return [{businessObject: {id: 1}}];
                        else return {};
                    }};
                var control = {getViewer: function() {return viewer}};

                util.bulletgraph.restore();
                util.bulletgraph(stub1, {}, {}, {}, {}, control,
                    {bpmnElements: [{id: 99}, {id: 1}]});
            });
            afterEach(function() {
                sandbox.restore();
            });

            it('should call clearOverlays once', function() {
                expect(spy1.callCount).to.eql(1);
            });
        });
    });

    describe('combineBulletgraphElements tests', function() {
        var sandbox = sinon.createSandbox();
        var spy1, spy2, spy3;
        var stub1;
        var avg = 1, max = 2, cur = 3000;
        var cssName = "test";

        beforeEach(function() {
            spy1 = sandbox.spy();
            spy2 = sandbox.spy();
            spy3 = sandbox.spy();
            stub1 = sandbox.stub(util);
            stub1.checkConditions.returns(true);
            stub1.createHTML.returns(document.createElement('DIV'));

            util.procDefId = "asdf1234";

            util.commonConversion = {checkTimeUnit: sinon.spy(), convertTimes: spy3};
            util.commonOverlays = {addTextElement: spy1, clearOverlays: spy2, getOffset: sinon.spy(),
                setOffset: sinon.spy(), addDraggableFunctionality: sinon.spy()};

            util.combineBulletgraphElements.restore();
            util.combineBulletgraphElements(stub1, {}, avg, max, cur, 'a', {}, cssName, "overlay", true);
        });
        afterEach(function() {
            sandbox.restore();
        });

        it('should call calculateAvgCurDuration once', function() {
            expect(spy1.callCount).to.eql(1);
        });
        it('should call clearOverlays once', function() {
            expect(spy2.callCount).to.eql(1);
        });
        it('should call createHTML with className', function() {
            expect(stub1.createHTML.args[0][0]).to.eql(cssName);
        });
        it('should call convertTimes three times with all durations', function() {
            expect(spy3.calledWith(avg)).to.eql(true);
            expect(spy3.calledWith(max)).to.eql(true);
            expect(spy3.calledWith(cur)).to.eql(true);
        });
    });

    /*describe('setGraphSettings tests', function() {
        var className = "test";
        var spy;
        before(function(done) {
            var div = document.createElement('DIV');
            div.className = className;
            document.body.appendChild(div);
            spy = sinon.spy();
            requirejs(['main/resources/plugin-webapp/centaur/app/common/bulletlibraries'], function () {
                util.setGraphSettings(1, 2, 3, 4, className, true);
                done();
            });
        });
        it('should find libraries', function() {
            expect(div).to.exist;
        });
    });*/

    describe('checkConditions tests', function () {
        var curDuration, avgDuration, maxDuration;
    
        describe('check if bgraph conditions are correct', function () {
            beforeEach(function () {
                curDuration = 6000;
                avgDuration = 4200;
                maxDuration = 10000;
            });

            it('should returns true when arguments are correct values', function () {
                expect(util.checkConditions(curDuration, avgDuration, maxDuration)).to.eql(true);
            });
            it('should returns false when arguments are incorrect',function () {
                curDuration = null;
                expect(util.checkConditions(curDuration, avgDuration, maxDuration)).to.eql(false);
            });
            it('should returns false when arguments are incorrect',function () {
                avgDuration = null;
                expect(util.checkConditions(curDuration, avgDuration, maxDuration)).to.eql(false);
            });
            it('should returns false when arguments are incorrect',function () {
                maxDuration = null;
                expect(util.checkConditions(curDuration, avgDuration, maxDuration)).to.eql(false);
            });
            it('should returns false when avgDuration is 0',function () {
                avgDuration = 0;
                expect(util.checkConditions(avgDuration, maxDuration, curDuration)).to.eql(false);
            });
        });
    });
    
    describe('determineColor tests', function () {
        var avgDuration, maxDuration, curDuration;
    
        describe('check if determineColor gets the right values', function () {

            it('should green is returned  correct values', function () {
                avgDuration = 45;
                maxDuration = 50;
                curDuration = 20;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.eql('green');
    
                curDuration = 60;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.not.eql('green');
            });
            it('should orange is returned correctly', function(){
                avgDuration = 10;
                maxDuration = 50;
                curDuration = 20;
               expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.eql('orange');
    
               avgDuration = 20;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.not.eql('orange');
            });
            it('should red is returned correctly', function(){
                avgDuration = 10;
                maxDuration = 50;
                curDuration = 60;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.eql('red');
    
                curDuration = 20;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.not.eql('red');
            });
        });
    });

    describe('createHTML tests', function() {
        var html, cssClass = "test";
        beforeEach(function() {
            html = util.createHTML(cssClass);
        });

        it('should return a div', function() {
            expect(html.nodeName).to.eql("DIV");
        });
        it('should set className to cssClass', function() {
            expect(html.className).to.contain(cssClass);
        });
    });
    
    describe('checkIfCurBiggerMax tests', function () {
        var curDuration;
        var maxDuration;
        var returnValue;
    
        describe('check if cur bigger max', function () {

            it('should returns correct values', function () {
                curDuration = 1000;
                maxDuration = 1000;
                returnValue = util.checkIfCurBiggerMax(curDuration, maxDuration);
                expect(returnValue).to.eql(1000);
            });
            it('should returns correct values', function () {
                curDuration = 1200;
                maxDuration = 1000;
                returnValue = util.checkIfCurBiggerMax(curDuration, maxDuration);
                expect(returnValue).to.eql(1000);
            });
            it('should returns correct values', function () {
                curDuration = 1000;
                maxDuration = 1300;
                returnValue = util.checkIfCurBiggerMax(curDuration, maxDuration);
                expect(returnValue).to.eql(1000);
            });
        });
    });
});
