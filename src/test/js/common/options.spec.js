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

    describe('setScopeFunctions tests', function() {
        var scope;
        beforeEach(function() {
            scope = {};
            util.setScopeFunctions(scope, {}, {}, util);
        });

        it('should set all scope functions', function() {
            var functions = ["setVariableChecked", "setKPIChecked", "setNumValue", "setRefreshRate", "setRefreshRate",
                "changeVar", "changeKPI", "changeVarNum", "changeRefreshRate"];
            functions.forEach(function(el) {
                expect(scope[el]).to.exist;
            });
        });
    });

    describe('changeOption tests', function() {
        var procDefId = "test", id = "a", value = "b", broadcast = "hello";
        var stub;
        var spy1, spy2;

        describe('no subItem', function() {
            beforeEach(function () {
                stub = sinon.stub().returns('{}');
                spy1 = sinon.spy();
                spy2 = sinon.spy();
                var localStorage = {getItem: stub, setItem: spy1};
                var rootScope = {$broadcast: spy2};
                util.changeOption(localStorage, rootScope, broadcast, procDefId, value, id, undefined);
            });

            it('should set id with value for procDefId', function () {
                expect(spy1.callCount).to.eql(1);
                expect(spy1.args[0][0]).to.eql(procDefId);
                var out = JSON.parse(spy1.args[0][1]);
                expect(out[id]).to.eql(value);
            });
            it('should give one broadcast message with hello', function () {
                expect(spy2.callCount).to.eql(1);
                expect(spy2.args[0][0]).to.contain(broadcast);
            });
        });

        describe('with subItem', function() {
            var subItem = 'c';

            beforeEach(function () {
                stub = sinon.stub().returns('{}');
                spy1 = sinon.spy();
                spy2 = sinon.spy();
                var localStorage = {getItem: stub, setItem: spy1};
                var rootScope = {$broadcast: spy2};
                util.changeOption(localStorage, rootScope, broadcast, procDefId, value, id, subItem);
            });

            it('should set id with value for procDefId', function () {
                expect(spy1.callCount).to.eql(1);
                expect(spy1.args[0][0]).to.eql(procDefId);
                var out = JSON.parse(spy1.args[0][1]);
                expect(out[id][subItem]).to.eql(value);
            });
            it('should give one broadcast message with hello', function () {
                expect(spy2.callCount).to.eql(1);
                expect(spy2.args[0][0]).to.contain(broadcast);
            });
        });
    });

    describe('getOption tests', function() {
        var procDefId = "test";
        var defaultValue = '5';
        var stub, localStorage, id = 'a', subId = 'b', out;

        describe('not in localStorage', function() {
            var spy;

            beforeEach(function() {
                stub = sinon.stub();
                stub.returns(null);
                spy = sinon.spy();
                localStorage = {getItem: stub, setItem: spy};
                out = util.getOption(localStorage, procDefId, defaultValue, id, subId);
            });

            it('should call getItem at least once', function() {
                expect(stub.calledOnce).to.eql(true);
            });
            it('should return default value', function() {
                expect(out).to.eql(defaultValue);
            });
            it('should setItem in localStorage with value and default 5', function() {
                expect(spy.calledWith(procDefId)).to.eql(true);
                var arg = JSON.parse(spy.args[0][1]);
                expect(arg[id][subId]).to.eql(defaultValue);
            });
        });

        describe('in localStorage', function() {
            var stored = '2';

            beforeEach(function() {
                stub = sinon.stub();
                stub.returns(JSON.stringify({a: {b: stored}}));
                localStorage = {getItem: stub};
                out = util.getOption(localStorage, procDefId, defaultValue, id, subId);
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
        var procDefId = "test", prefix = 'a';
        var data = [{name: 'b'}, {name: 'c'}];

        describe('localStorage is empty', function() {
            beforeEach(function() {
                stub = sinon.stub();
                spy = sinon.spy();
                stub.returns(null);
                var localStorage = {setItem: spy, getItem: stub};

                util.setChecked(localStorage, procDefId, prefix, data);
            });

            it('should set checked true', function() {
                expect(data[0].checked).to.eql(true);
                expect(data[1].checked).to.eql(true);
            });

            it('should call setItem with procDefId', function() {
                expect(spy.calledWith(procDefId)).to.eql(true);
            });
            it('should call setItem with true for both variables', function() {
                var arg = JSON.parse(spy.args[0][1]);
                expect(arg['a'][data[0].name]).to.eql("true");
                expect(arg['a'][data[1].name]).to.eql("true");
            });
        });

        describe('localStorage contains data', function() {
            beforeEach(function() {
                stub = sinon.stub();
                stub.returns('{"' + prefix + '":{"b":"true","c":"false"}}');
                spy = sinon.spy();
                var localStorage = {setItem: spy, getItem: stub};
                util.setChecked(localStorage, procDefId, prefix, data);
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
             
    describe('isSelectedInstance tests', function() {
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
    });

    describe("register tests", function() {
        var subscriptions = ['a', 'b'];
        var spy, stub;

        beforeEach(function() {
            spy = sinon.spy();
            stub = sinon.stub().returns(function(){});
            var scope = {$on: stub};
            util.register(scope, subscriptions, spy);
        });

        it('should call callback when subscription fires', function() {
            stub.args[0][1]();
            expect(spy.called).to.eql(true);
        });
        it('should call callback for a and b', function() {
            expect(stub.args[0][0]).to.eql(subscriptions[0]);
            expect(stub.args[1][0]).to.eql(subscriptions[1]);
        });
        it('should subscribe for scope destroy', function() {
            expect(stub.args[2][0]).to.eql("$destroy")
        })
    })
});