describe('Common conversion tests', function () {
    var util;

    before(function (done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/conversion'], function (utl) {
            util = utl;
            done();
        });
    });

    it('should find common conversion util', function() {
        expect(util).to.exist;
    });

    describe('check Time Unit', function () {
        var duration;
        describe('check if time units are calculated correctly (short time unit)', function () {
           it('test seconds', function () {
               duration = 5000;
               expect(util.checkTimeUnit(duration, false)).to.eql('s');
           });
    
           it('test minutes', function(){
               duration = 100000;
               expect(util.checkTimeUnit(duration, false)).to.eql('m');
            });
    
            it('test hours', function(){
                duration = 3700001
                expect(util.checkTimeUnit(duration, false)).to.eql('h');
            });
    
            it('test days', function(){
                duration = 90400001;
                expect(util.checkTimeUnit(duration, false)).to.eql('d');
            });
    
            it('test weeks', function(){
                duration = 605800001;
                    expect(util.checkTimeUnit(duration, false)).to.eql('w');
            });
    
        });

        describe('check if time units are calculated correctly (long time unit)', function () {
            it('test seconds', function () {
                duration = 5000;
                expect(util.checkTimeUnit(duration, true)).to.eql('seconds');
            });
     
            it('test minutes', function(){
                duration = 100000;
                expect(util.checkTimeUnit(duration, true)).to.eql('minutes');
             });
     
             it('test hours', function(){
                 duration = 3700001
                 expect(util.checkTimeUnit(duration, true)).to.eql('hours');
             });
     
             it('test days', function(){
                 duration = 90400001;
                 expect(util.checkTimeUnit(duration, true)).to.eql('days');
             });
     
             it('test weeks', function(){
                 duration = 605800001;
                     expect(util.checkTimeUnit(duration, true)).to.eql('weeks');
             });
     
         });
    
    
    });

    describe('check times conversion test', function () {

        var duration;
        var choice;
        describe('check duration format is correct', function () {
    
    
            it('test for duration to be in seconds', function () {
                duration = 1000*2;
                choice = 's';
                expect(util.convertTimes(duration, choice)).to.eql(2);
                duration = 1000*60;
                choice = 's';
                expect(util.convertTimes(duration, choice)).to.eql(60);
                duration = 1000*145;
                choice = 's';
                expect(util.convertTimes(duration, choice)).to.eql(145);
                duration = 1000*145;
                choice = 'seconds';
                expect(util.convertTimes(duration, choice)).to.eql(145);
            });
    
            it('test for duration to be in minutes', function(){
                duration = 60001;
                choice = 'm';
                expect(util.convertTimes(duration, choice)).to.eql(1);
                duration = 60000*24;
                choice = 'm';
                expect(util.convertTimes(duration, choice)).to.eql(24);
                duration = 60000*124;
                choice = 'm';
                expect(util.convertTimes(duration, choice)).to.eql(124);
                duration = 60000*124;
                choice = 'minutes';
                expect(util.convertTimes(duration, choice)).to.eql(124);
            });
    
            it('test for duration to be in hours', function(){
                duration = 3600001;
                choice = 'h';
                expect(util.convertTimes(duration, choice)).to.eql(1);
                duration = 3600000*75;
                choice = 'h';
                expect(util.convertTimes(duration, choice)).to.eql(75);
                duration = 3600000*75;
                choice = 'hours';
                expect(util.convertTimes(duration, choice)).to.eql(75);
            });
    
            it('test for duration to be in days', function(){
                duration = 86400001;
                choice = 'd';
                expect(util.convertTimes(duration, choice)).to.eql(1);
                duration = 86400001*10;
                choice = 'd';
                expect(util.convertTimes(duration, choice)).to.eql(10);
                duration = 86400001*10;
                choice = 'days';
                expect(util.convertTimes(duration, choice)).to.eql(10);
            });
    
            it('test for duration to be in weeks', function(){
                duration = 604800001;
                choice = 'w';
                expect(util.convertTimes(duration, choice)).to.eql(1);
                duration = 604800000*2;
                choice = 'w';
                expect(util.convertTimes(duration, choice)).to.eql(2);
                duration = 604800000*5;
                choice = 'w';
                expect(util.convertTimes(duration, choice)).to.eql(5);
                duration = 604800000*5;
                choice = 'weeks';
                expect(util.convertTimes(duration, choice)).to.eql(5);
            });
    
        });
    
    });
          
    describe('calculate average current duration tests', function() {
        var instance;
        var elementID;

        describe('average duration', function() {

            beforeEach(function() {
                instance = [{activityId: 'An activity', startTime: 0}, {activityId: 'An activity2', startTime: 0}];
                elementID = 'An activity';
            });

            it('check if it returns a number', function() {
                var computerTime = new Date().getTime();
                expect(computerTime - util.calculateAvgCurDuration(util, instance, elementID)).to.be.a('number');
            });

            it('check if it returns null', function() {
                elementID = 'Another not existing activity';
                expect(util.calculateAvgCurDuration(util, instance, elementID)).to.be.null;
            });
        });
    });
          
    describe('check calculate time difference test', function () {

        var startTime;
    
        describe('test if the current time is returned correctly', function(){
            it('test for startTime to be within a  100ms range', function () {
                startTime = 0;
                var computerTime = new Date().getTime();
                expect(computerTime - util.calculateTimeDifference(startTime)).to.be.lessThan(10);
    
            });
    
        })
    
    
    });
});

