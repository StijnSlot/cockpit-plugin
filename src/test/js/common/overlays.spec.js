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

    describe('setOffset tests', function() {
        var parent, html, prefix = "test";
        var stub;

        beforeEach(function() {
            stub = sinon.stub();
            stub.withArgs(prefix + "_offset_top").returns(5);
            stub.onSecondCall(prefix + "_offset_left").returns(null);
            parent = document.createElement('DIV');
            html = document.createElement('DIV');
            parent.appendChild(html);
            var localStorage = {getItem: stub};
            util.setOffset(html, localStorage, prefix);
        });

        it('should call localStorage getItem twice with prefix test', function() {
            expect(stub.callCount).to.eql(2);
            expect(stub.calledWith(prefix + "_offset_top")).to.eql(true);
            expect(stub.calledWith(prefix + "_offset_left")).to.eql(true);
        });
        it('should set offset top of html  to 5', function() {
            expect(parent.style.top).to.eql('5px');
        });
        it('should not set offset left', function() {
            expect(parent.style.left).to.eql('');
        });
    });

    describe('addDraggableFunctionality tests', function() {
        var parent, html;
        var spy;

        beforeEach(function() {
            spy = sinon.spy();
            parent = document.createElement('DIV');
            html = document.createElement('DIV');
            parent.appendChild(html);
            jQuery.fn.extend({draggable: spy});
            util.addDraggableFunctionality({}, "", 1, html, {});
        });

        it('should set parent to djs-draggable', function() {
            expect(parent.classList.contains("djs-draggable"));
        });
        it('should make parent draggable', function() {
            expect(spy.called).to.eql(true);
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