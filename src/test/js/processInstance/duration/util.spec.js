describe('duration process instance tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/processInstance/duration/util'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should find duration util file', function() {
        expect(util).to.exist;
    });
});

