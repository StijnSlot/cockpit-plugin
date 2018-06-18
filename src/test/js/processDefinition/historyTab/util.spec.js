describe('instance history tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/historyTab/util'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should find util for variables', function() {
        expect(util).to.exist;
    });

    describe('flipSortOrder tests', function() {
        var spy;
        before(function() {
            spy = sinon.spy(util, "setSortingArrows");
            util.flipSortOrder("endTime", util);
            util.flipSortOrder("duration", util);
            util.flipSortOrder("endTime", util);
        });
        after(function() {
            spy.restore();
        });
        it('should flip endTime twice to desc', function() {
            expect(util.order["endTime"]).to.eql("desc");
        });
        it('should flip duration to asc', function() {
            expect(util.order["duration"]).to.eql("asc");
        });
        it('should call setSortingArrows three times', function() {
            expect(spy.callCount).to.eql(3);
        });
    });

    describe('setSortingArrows tests', function() {
        var i1, i2;
        before(function() {
            i1 = document.createElement('I');
            i2 = document.createElement('I');
            i1.classList.add("sortingArrows", "glyphicon-menu-down");
            i2.classList.add("sortingArrows", "glyphicon-menu-up");
            i1.id = "endTime";
            i2.id = "duration";
            document.body.append(i1);
            document.body.append(i2);
            util.setSortingArrows("endTime", "asc");
        });
        it('should remove other sorting arrows', function() {
            expect(i1.classList.contains("glyphicon-menu-down")).to.eql(false);
            expect(i2.classList.contains("glyphicon-menu-up")).to.eql(false);
            expect(i2.classList.contains("glyphicon-menu-down")).to.eql(false);
        });
        it('should give endTime an up arrow', function() {
            expect(i1.classList.contains("glyphicon-menu-up")).to.eql(true);
        });
    });

    describe('getData tests', function() {
        var spy, stub;
        var data = [123, "dsads"];
        var out;
        beforeEach(async function() {
            spy = sinon.spy();
            stub = sinon.stub().returns({success: function(x) {x(data);}});
            var uri = {appUri: spy};
            var http = {get: stub};
            out = await util.getData(http, uri, "endTime", "asc", "test:123");
        });
        it('should call uri once', function() {
            expect(spy.callCount).to.eql(1);
        });
        it('should call http get once', function() {
            expect(stub.callCount).to.eql(1);
        });
        it('should call uri with endTime, asc and test:123', function() {
            expect(spy.args[0][0]).to.contain("endTime");
            expect(spy.args[0][0]).to.contain("asc");
            expect(spy.args[0][0]).to.contain("test:123");
        });
        it('should return data', function() {
            expect(out).to.eql(data);
        });
    });
});