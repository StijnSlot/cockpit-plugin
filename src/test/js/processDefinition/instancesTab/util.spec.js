describe('instancesTab tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/processDefinition/instancesTab/util'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should fine util', function() {
        expect(util).to.exist;
    });

    describe('getData tests', function() {
        var stub2, stub1;
        var scope = {}, procDefKey = "key";

        beforeEach(function() {
            stub1 = sinon.stub().returns("test/" + procDefKey);
            stub2 = sinon.stub().returns({success: function(x) {x(["instance"]);}});
            var Uri = {appUri: stub1};
            var http = {get: stub2};
            util.getData(scope, http, Uri, procDefKey);
        });

        it('should call Uri once with procDefKey', function() {
            expect(stub1.callCount).to.eql(1);
            expect(stub1.args[0][0]).to.contain(procDefKey);
        });
        it('should call http once with test/ procDefKey', function() {
            expect(stub2.callCount).to.eql(1);
            expect(stub2.args[0][0]).to.eql("test/" + procDefKey);
        });
        it('should set scope.instances to the returned data', function() {
            expect(scope.instances).to.eql(["instance"]);
        });
    });

    describe('deleteIds tests', function() {
        var spy1, spy2, stub1, stub2;
        var ids = ["a", "2"];

        beforeEach(function() {
            spy1 = sinon.spy();
            spy2 = sinon.spy();
            stub1 = sinon.stub().returns("test/123");
            stub2 = sinon.stub().returns({then: function(x) {x();}});

            var Uri = {appUri: stub1};
            var http = {delete: spy1};
            var q = {all: stub2};
            util.deleteIds(http, q, Uri, ids, spy2);
        });

        it('should call Uri twice with ids', function() {
            expect(stub1.args[0][0]).to.contain(ids[0]);
            expect(stub1.args[1][0]).to.contain(ids[1]);
        });
        it('should call http twice with test/123', function() {
            expect(spy1.callCount).to.eql(2);
            expect(spy1.args[0][0]).to.eql("test/123");
        });
        it('should call the callback function once', function() {
            expect(spy2.callCount).to.eql(1);
        });
    });

    describe('getSelectedIds tests', function() {
        var out;

        beforeEach(function() {
            var tr1 = document.createElement('TR');
            var td = document.createElement('TD');
            td.className = "instance-id";
            td.innerHTML = "123";
            tr1.appendChild(td);

            out = util.getSelectedIds($(tr1));
        });
        it('should return array of size 1', function() {
            expect(out).to.have.lengthOf(1);
        });
        it('should return 123', function() {
            expect(out[0]).to.eql("123");
        });
    });

});