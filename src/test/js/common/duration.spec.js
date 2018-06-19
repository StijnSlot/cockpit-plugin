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
    
    describe('check Conditions', function () {
        var avgDuration, maxDuration;
        var returnValue;
        describe('check if conditions are checked correctly', function () {
    
           beforeEach(function () {
               avgDuration = '4';
               maxDuration = '12';
               returnValue = util.checkConditions(avgDuration, maxDuration);
           });
    
           it('test if condition is true when arguments are valid', function () {
               expect(returnValue).to.eql(true);
           });
           it('test if condition is false when arguments are invalid', function(){
               maxDuration = null;
               expect(util.checkConditions(avgDuration, maxDuration)).to.eql(false);
            });
            it('test if condition is false when arguments are invalid', function(){
                avgDuration = null;
                expect(util.checkConditions(avgDuration, maxDuration)).to.eql(false);
            });
            it('test if condition is false when arguments are invalid', function(){
                avgDuration = '0';
                expect(util.checkConditions(avgDuration, maxDuration)).to.eql(false);
            });
        });
    });
    
    describe('check checkIfCurValid', function () {
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

            it('check if returns correct values', function () {
                expect(returnValue).to.eql('6 seconds');
            });
            it('check if returns nothing when null', function(){
                curDuration = null;
               expect(util.checkIfCurValid(util, curDuration)).to.eql('-');
            });
        });
    });

});
