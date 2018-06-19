describe('duration process definition tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/duration/util'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should find duration util file', function() {
        expect(util).to.exist;
    });
});




