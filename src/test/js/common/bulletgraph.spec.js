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

    describe('check checkConditions', function () {
        var minDuration, curDuration, avgDuration, maxDuration;
    
        describe('check if bgraph conditions are correct', function () {
            beforeEach(function () {
                minDuration = 7000;
                curDuration = 6000;
                avgDuration = 4200;
                maxDuration = 10000;
            });

            it('check if returns true when arguments are correct values', function () {
                expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(true);
            });
    
            it('check if returns false when arguments are incorrect',function () {
                minDuration = null;
                expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(false);
            });
    
            it('check if returns false when arguments are incorrect',function () {
                curDuration = null;
                expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(false);
            });
    
            it('check if returns false when arguments are incorrect',function () {
                avgDuration = null;
                expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(false);
            });
            it('check if returns false when arguments are incorrect',function () {
                maxDuration = null;
                expect(util.checkConditions(minDuration, curDuration, avgDuration, maxDuration)).to.eql(false);
            });
            it('check if returns false when avgDuration is 0',function () {
                avgDuration = 0;
                expect(util.checkConditions(minDuration, avgDuration, maxDuration, curDuration)).to.eql(false);
            });
    
        });
    
    
    });
    
    
    
    
    describe('check determineColor', function () {
        var avgDuration, maxDuration, curDuration;
    
        describe('check if determineColor gets the right values', function () {

            it('check if green is returned  correct values', function () {
                avgDuration = 45;
                maxDuration = 50;
                curDuration = 20;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.eql('green');
    
                curDuration = 60;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.not.eql('green');
    
            });
            it('check if orange is returned correctly', function(){
                avgDuration = 10;
                maxDuration = 50;
                curDuration = 20;
               expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.eql('orange');
    
               avgDuration = 20;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.not.eql('orange');
            });
            it('check if red is returned correctly', function(){
                avgDuration = 10;
                maxDuration = 50;
                curDuration = 60;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.eql('red');
    
                curDuration = 20;
                expect(util.determineColor(avgDuration, maxDuration, curDuration)).to.not.eql('red');
            });
        });
    });
    
    describe('check if current duration is bigger or equal to the maximum duration', function () {
        var curDuration;
        var maxDuration;
        var returnValue;
    
        describe('check if cur bigger max', function () {

            it('check if returns correct values', function () {
                curDuration = 1000;
                maxDuration = 1000;
                returnValue = util.checkIfCurBiggerMax(curDuration, maxDuration);
                expect(returnValue).to.eql(1000);
            });
    
            it('check if returns correct values', function () {
                curDuration = 1200;
                maxDuration = 1000;
                returnValue = util.checkIfCurBiggerMax(curDuration, maxDuration);
                expect(returnValue).to.eql(1000);
            });
            it('check if returns correct values', function () {
                curDuration = 1000;
                maxDuration = 1300;
                returnValue = util.checkIfCurBiggerMax(curDuration, maxDuration);
                expect(returnValue).to.eql(1000);
            });
        });
    });
});
