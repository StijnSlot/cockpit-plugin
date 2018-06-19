describe('Common options tests', function() {
    var util;

    before(function(done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/options'], function(utl) {
            util = utl;
            done();
        });
    });

    it('should find common options util', function() {
        expect(util).to.exist;
    });

    /*describe('getVariableNum tests', function() {
        var stub, localStorage, id = 2, out;

        describe('not in localStorage', function() {
            var spy;

            beforeEach(function() {
                stub = sinon.stub();
                stub.returns(null);
                spy = sinon.spy();
                localStorage = {getItem: stub, setItem: spy};
                out = util.getVariableNum(localStorage, id);
            });

            it('should call getItem at least once', function() {
                expect(stub.calledOnce).to.eql(true);
            });

            it('should return default value 5', function() {
                expect(out).to.eql(5);
            });

            it('should setItem in localStorage with value and default 5', function() {
                expect(spy.calledWith(id, 5)).to.eql(true);
            });
        });

        describe('in localStorage', function() {
            var stored = 2;

            beforeEach(function() {
                stub = sinon.stub();
                stub.returns(stored);
                localStorage = {getItem: stub};
                out = util.getVariableNum(localStorage, id);
            });

            it('should return stored', function() {
                expect(out).to.eql(stored);
            });

            it('should call getItem at least once', function() {
                expect(stub.calledOnce).to.eql(true);
            });
        });
    });

    describe('setChecked tests', function() {
        var stub, spy;
        var prefix = 'a_';
        var data = [{name: 'b'}, {name: 'c'}];

        describe('localStorage is empty', function() {
            beforeEach(function() {
                stub = sinon.stub();
                spy = sinon.spy();
                stub.returns(null);
                var localStorage = {setItem: spy, getItem: stub};

                util.setChecked(localStorage, prefix, data);
            });

            it('should set checked true', function() {
                expect(data[0].checked).to.eql(true);
                expect(data[1].checked).to.eql(true);
            });

            it('should call setItem true for each data point', function() {
                expect(spy.calledWith(prefix + data[0].name, 'true')).to.eql(true);
                expect(spy.calledWith(prefix + data[1].name, 'true')).to.eql(true);
            });
        });

        describe('localStorage contains data', function() {
            beforeEach(function() {
                stub = sinon.stub();
                stub.onFirstCall().returns('true');
                stub.onSecondCall().returns('false');
                spy = sinon.spy();
                var localStorage = {setItem: spy, getItem: stub};
                util.setChecked(localStorage, prefix, data);
            });

            it('should set data checked', function() {
                expect(data[0].checked).to.eql(true);
                expect(data[1].checked).to.eql(false);
            });

            it('should not run setItem', function() {
                expect(spy.called).to.eql(false);
            });
        });
    });

    describe('changeVar tests', function() {
        var spy1, spy2;
        var id = 'a', check = 'true';

        beforeEach(function() {
            spy1 = sinon.spy();
            spy2 = sinon.spy();
            var localStorage = {setItem: spy1};
            var rootScope = {$broadcast: spy2};

            util.changeOption(localStorage, rootScope, id, check);
        });

        it('should call setItem with arguments a and true', function() {
            expect(spy1.calledWith(id, check)).to.eql(true);
        });

        it('should call broadcast exactly once', function() {
            expect(spy2.calledOnce).to.eql(true);
        });
    });

    describe('changeKPI tests', function() {
        var spy1, spy2;
        var id = 'a', check = 'true';

        beforeEach(function() {
            spy1 = sinon.spy();
            spy2 = sinon.spy();
            var localStorage = {setItem: spy1};
            var rootScope = {$broadcast: spy2};

            util.changeKPI(localStorage, rootScope, id, check);
        });

        it('should call setItem with arguments a and true', function() {
            expect(spy1.calledWith(id, check)).to.eql(true);
        });

        it('should call broadcast exactly once', function() {
            expect(spy2.calledOnce).to.eql(true);
        });
    });

    describe('changeVarNum tests', function() {
        var spy1, spy2;
        var id = 'a', check = 'true';

        beforeEach(function () {
            spy1 = sinon.spy();
            spy2 = sinon.spy();
            var localStorage = {setItem: spy1};
            var rootScope = {$broadcast: spy2};

            util.changeVarNum(localStorage, rootScope, id, check);
        });

        it('should call setItem with arguments a and true', function () {
            expect(spy1.calledWith(id, check)).to.eql(true);
        });

        it('should call broadcast exactly once', function () {
            expect(spy2.calledOnce).to.eql(true);
        });
    });
             
    describe('is selected instance tests', function() {
        var instance;
        var elementID;
        var instanceID;
        var out;

        describe('is selected', function() {

            beforeEach(function() {
                instance = [{activityId: 'An activity', instanceId: 123}, {activityId: 'An activity', instanceId: 124}];
                elementID = 'An activity';
                instanceID = 123;
                out = util.isSelectedInstance(instance, elementID, instanceID);
            });

            it('check if it returns true', function() {
                expect(out).to.eql(true);
            });

            it('check if it returns false', function() {
                instanceID = 125;
                out = util.isSelectedInstance(instance, elementID, instanceID);
                expect(out).to.eql(false);
            });            
        });
    });*/
});