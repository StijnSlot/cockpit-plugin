describe('Common overlay tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/overlays'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should not have util undefined', function() {
        expect(util).to.exist;
    });

    describe('addTextElement tests', function() {
        var stub, overlays;
        var elementId = 1;
        var html = document.createElement('ul');
        var out;

        beforeEach(function() {
            stub = sinon.stub().returns(2);
            overlays = {add: stub};

            out = util.addTextElement(overlays, elementId, html);
        });

        it('should add element with corresponding id and object', function() {
            expect(stub.calledWith(elementId)).to.eql(true);
            expect(stub.firstCall.args[1]).to.be.an('object');
            expect(stub.firstCall.args[1].html).to.eql(html);
        });

        it('should return id of 2', function() {
            expect(out).to.eql(2);
        });
    });

    describe('getOffset tests', function() {
        var html, procDefId = "test";
        var stub;

        beforeEach(function() {
            stub = sinon.stub();
            stub.withArgs(procDefId).returns('{"a": {"b": {"top": "5px"}}}');
            stub.onSecondCall(procDefId).returns(null);
            html = document.createElement('DIV');
            var localStorage = {getItem: stub};

            util.getOffset(html, localStorage, procDefId, "a", "b");
        });

        it('should call localStorage getItem once', function() {
            expect(stub.callCount).to.eql(1);
            expect(stub.calledWith(procDefId)).to.eql(true);
        });
        it('should set offset top of html  to 5', function() {
            expect(html.style.top).to.eql('5px');
        });
        it('should not set offset left', function() {
            expect(html.style.left).to.eql('');
        });
    });

    describe('setOffset tests', function() {
        var procDefId = "test";
        var stub, spy;

        beforeEach(function() {
            stub = sinon.stub();
            spy = sinon.spy();
            stub.withArgs(procDefId).returns('{"a": {}}');
            var localStorage = {getItem: stub, setItem: spy};
            util.setOffset(localStorage, procDefId, "a", "b", "100px", "-20px");
        });

        it('should call localStorage getItem once', function() {
            expect(stub.callCount).to.eql(1);
            expect(stub.calledWith(procDefId)).to.eql(true);
        });
        it('should call setItem once with procDefId', function() {
            expect(spy.callCount).to.eql(1);
            expect(spy.args[0][0]).to.eql(procDefId);
        });
        it('should set correct offset for activity a and overlay b', function() {
            var out = JSON.parse(spy.args[0][1]);
            expect(out['a']['b']).to.exist;
            expect(out['a']['b']['top']).to.eql("100px");
            expect(out['a']['b']['left']).to.eql("-20px");
        });
    });

    describe('addDraggableFunctionality tests', function() {
        var html;
        var spy1, spy2;

        beforeEach(function() {
            spy1 = sinon.spy();
            spy2 = sinon.spy();
            html = document.createElement('DIV');
            jQuery.fn.extend({draggable: spy1});
            util.addDraggableFunctionality(1, html, {}, true, spy2);
        });

        it('should set parent to djs-draggable', function() {
            expect(html.classList.contains("djs-draggable"));
        });
        it('should make parent draggable', function() {
            expect(spy1.called).to.eql(true);
        });
    });

    describe('clearOverlays tests', function() {
        var spy, overlays;
        var overlayIds = {'a': [1], 'b': [-2], 'c': [3]};

        beforeEach(function() {
            spy = sinon.spy();
            overlays = {remove: spy};

            util.clearOverlays(overlays, overlayIds['a']);
            util.clearOverlays(overlays, overlayIds['b']);
        });

        it('should call remove for all ids', function() {
            expect(spy.calledWith(1)).to.eql(true);
            expect(spy.calledWith(-2)).to.eql(true);
        });

        it('should return overlayIds empty', function() {
            expect(overlayIds['a']).to.be.empty;
            expect(overlayIds['b']).to.be.empty;
            expect(overlayIds['c']).to.be.not.empty;
        });
    });
});