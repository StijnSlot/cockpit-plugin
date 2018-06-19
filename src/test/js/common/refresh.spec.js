describe('Common refresh tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/refresh'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should not have util undefined', function() {
        expect(util).to.exist;
    });

    describe('setInterval tests', function() {
        var spy1, spy2;
        var stub1;
        var clock;
        var unregister;

        beforeEach(function() {
            spy1 = sinon.spy();
            spy2 = sinon.spy();

            util.refreshRate = 1000;
            util.poll = null;
            clock = sinon.useFakeTimers();
            stub1 = sinon.stub().returns({success: function(x) {
                    x([{}]);}
            });
            var scope = {$on: function(x, y) {unregister = y;}};
            var http = {get: stub1};
            var uri = {appUri: spy2};
            util.setInterval(scope, http, uri, util, spy1);

            clock.tick(1000);
        });
        afterEach(function() {
            unregister();
            clock.restore();
        });

        it('should call callback spy2', function() {
            expect(spy1.callCount).to.be.eql(1);
        });
        it('should correctly unregister', function() {
            unregister();
            clock.tick(1000);
            expect(spy1.callCount).to.not.be.above(1);
        })
    });
});