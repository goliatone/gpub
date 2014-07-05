/*global define:true*/
/*global describe:true */
/*global it:true */
/*global expect:true */
/*global beforeEach:true */
/*global sinon:true */
/* jshint strict: false */
define(['gpub'], function(Gpub) {

    var item;
    beforeEach(function() {
        item = new Gpub();
    });

    describe('gpub', function() {
        //////////////////////////////////////////////////////
        /// STATIC METHODS
        //////////////////////////////////////////////////////
        it('mixin should extend a target object with Gpub methods', function() {
            var target = {};
            Gpub.observable(target);
            var methods = Object.keys(Gpub.prototype);
            // expect(target).toHaveMethods(methods);
        });

        it('mixin objects should get notified of publisehd topics', function() {
            var spy = sinon.spy();
            var options = {
                options: true
            };
            var Target = function() {};
            // var target = new Target();
            var target = {};
            Gpub.observable(target);

            target.on('topic', spy);
            target.emit('topic', options);
            expect(spy).toHaveBeenCalledWith(options);
            expect(spy).not.toHaveBeenCalledWith({});
        });

        it('should make a passed object bindable', function() {
            var spy = sinon.spy();

            var M = function() {
                this.data = {}
            };
            M.prototype.set = function(key, value) {
                this.data[key] = value;
                return this;
            };
            M.prototype.get = function(key, def) {
                return this.data[key] || def;
            };

            Gpub.bindable(M.prototype, 'set', 'get');
            var model = new M();

            var event = {
                old: 'oldValue',
                value: 'newValue'
            };
            model.set('test', event.old)
                .on('change', spy)
                .on('change:test', spy)
                .set('test', event.value);

            expect(spy).toHaveBeenCalledTwice();
        });

        it('should make a passed object bindable', function() {
            var spy = sinon.spy();

            var M = function() {
                this.data = {}
            };
            M.prototype.set = function(key, value) {
                this.data[key] = value;
                return this;
            };
            M.prototype.get = function(key, def) {
                return this.data[key] || def;
            };

            Gpub.bindable(M.prototype, 'set', 'get');
            var model = new M();

            var data = {
                old: 'oldValue',
                value: 'newValue'
            };

            model.set('test', 'oldValue').on('change', function(event) {
                expect(event.old).toBe('oldValue');
                expect(event.value).toBe('newValue');
            }).on('change:test', function(event) {
                expect(event.old).toBe('oldValue');
                expect(event.value).toBe('newValue');
            }).set('test', 'newValue');
        });

        it('should create delegated methods to register callback style', function() {
            var events = ['change', 'sync'];
            var M = function() {};
            var user = new M();

            Gpub.delegable(M.prototype, events);
            expect(user).toHaveMethods(['onchange', 'onsync']);

        });

        it('should create delegated methods to register callback style', function() {
            var events = ['change', 'sync'];

            var M = function() {};
            Gpub.delegable(M.prototype, events);

            var user = new M();

            expect(user.emits('sync')).toBeFalsy();
            expect(user.emits('change')).toBeFalsy();

            user.onchange(null);
            user.onsync(null);

            expect(user.emits('sync')).toBeFalsy();
            expect(user.emits('change')).toBeFalsy();

            var spy = sinon.spy();

            user.onchange(spy);
            user.onsync(spy);

            expect(user.emits('sync')).toBeTruthy();
            expect(user.emits('change')).toBeTruthy();

        });

        it('should trigger delegated methods on emit for registered events', function() {
            var events = ['change', 'sync'];

            var M = function() {};
            Gpub.delegable(M.prototype, events);

            var user = new M();

            var spy = sinon.spy();

            user.onchange(spy);
            user.onsync(spy);

            user.emit('sync').emit('change');

            expect(spy).toHaveBeenCalledTwice();

        });
    });
});