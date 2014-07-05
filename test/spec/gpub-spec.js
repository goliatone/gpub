/*global define:true*/
/*global describe:true */
/*global it:true */
/*global expect:true */
/*global beforeEach:true */
/*global sinon:true */
/* jshint strict: false */
define(function(require) {
    var Gpub = require('gpub');
    describe('just checking', function() {

        it('Gpub should be loaded', function() {
            expect(Gpub).toBeTruthy();
            var gpub = new Gpub();
            expect(gpub).toBeTruthy();
        });
    });
    var item;
    beforeEach(function() {
        item = new Gpub();
    });

    describe('gpub', function() {
        it('We can extend simple objects with pubsub cap.', function() {
            expect(item).toBeTruthy();
            expect(item).toHaveMethods('publish', 'unsubscribe', 'subscribe');
        });

        it('objects can subscribe to a pubsub instance', function() {
            var subscriber = function() {};
            item.subscribe('topic', subscriber);
            expect(item.subscribers('topic')).toBeTruthy();
            expect(item.subscribers('non-topic')).toBeFalsy();
        });

        it('objects can unsubscribe from a pubsub instance', function() {
            var subscriber = function subscriber() {};
            item.subscribe('topic', subscriber);
            item.subscribe('topic-two', subscriber);
            expect(item.subscribers('topic')).toBeTruthy();
            item.unsubscribe('topic', subscriber);
            expect(item.subscribers('topic')).toBeFalsy();
        });

        it('objects get notified of published topics', function() {
            var spy = sinon.spy();
            item.subscribe('topic', spy);
            item.publish('topic');
            expect(spy).toHaveBeenCalled();
        });

        it('objects get notified of published topics', function() {
            var spy = sinon.spy();
            var event = {
                options: true
            };
            item.subscribe('topic', spy);
            item.publish('topic', event);
            expect(spy).toHaveBeenCalledWith(event);
            expect(spy).not.toHaveBeenCalledWith({});
        });

        it('a handler can abort the publish loop', function() {
            var test = {};
            test.handler = function() {
                return false;
            };

            var spyB = sinon.spy();
            var spyC = sinon.spy();
            var spyA = sinon.spy(test, 'handler');

            //here it works cose we have the same order.
            item.subscribe('topic', spyA);
            item.subscribe('topic', spyB);
            item.subscribe('topic', spyC);

            item.publish('topic');
            expect(spyA).toHaveBeenCalled();
            expect(spyB).not.toHaveBeenCalled();
            expect(spyC).not.toHaveBeenCalled();
        });

        it('should route all notices to a single handler if subscribed to the * channel', function() {
            var single = sinon.spy();
            var multiple = sinon.spy();

            var event = {
                options: true
            };
            item.subscribe('all', multiple);
            item.subscribe('topic', single);

            item.publish('topic', event);
            item.publish('topic2', event);
            item.publish('topic3', event);

            expect(single).toHaveBeenCalledOnce();
            // expect(single).toHaveBeenCalledWith(event);

            var callbackArguments = multiple.args[0];
            expect(multiple).toHaveBeenCalledThrice();
            expect(callbackArguments[0]).toBe('topic');
        });

        it('should have a fluid interface', function() {
            var single = sinon.spy();
            var multiple = sinon.spy();
            var opt = {
                options: true
            };
            item.subscribe('all', multiple).subscribe('t2', single);

            item.publish('t1', opt).publish('t2', opt).publish('t3', opt);

            expect(single).toHaveBeenCalledOnce();
            expect(single).toHaveBeenCalledWith(opt);

            expect(multiple).toHaveBeenCalledThrice();
            expect(multiple.args[0]).toIncludeObject(['t1', opt]);
        });

        it('should execute in the scope of the publisher by default', function() {
            var spy = sinon.spy();
            item.subscribe('topic', spy);
            item.publish('topic');
            expect(spy.calledOn(item)).toBeTruthy();
        });

        it('should execute in the scope provided', function() {
            var scope = function() {};
            var spy = sinon.spy();
            item.on('topic', spy, scope);
            item.emit('topic');
            expect(spy.calledOn(scope)).toBeTruthy();
        });

        it('should include all event props into the event parameter', function() {
            //SHOULD WE MAKE THIS A FEATURE OR A BUG?!
            //for now, we leave it as it is.
            var handler = {},
                expectedID = 'someID';
            handler.onTopic = function(event) {
                handler.id = expectedID;
                event.age++;
                expect(event.age).toBe(2);
                return this;
            };
            handler.onTopicTwo = function(event) {
                event.age++;
                expect(event.age).toBe(3);
            };

            var spy = sinon.spy(handler, 'onTopic');

            item.subscribe('topic', handler.onTopic);
            item.subscribe('topic', handler.onTopicTwo);

            item.publish('topic', {
                age: 1
            });

            expect(spy).toHaveBeenCalledOnce();
            expect(spy.returned(item)).toBeTruthy();
            expect(spy.args[0]).toBeTruthy();
            expect(spy.args[0]).toHaveLength(2); //we have age + event.

            expect(handler.id).toBeTruthy();
            expect(handler.id).toEqual(expectedID);
        });

        it('emits should let you know if a topic is registered', function() {
            var spy = sinon.spy();
            item.on('topic', spy);
            expect(item.emits('topic')).toBeTruthy();
            expect(item.emits('NOTHING')).toBeFalsy();
        });

        it('emits should let you know if a topic is registered once', function() {
            var spy = sinon.spy();
            item.once('topic', spy);
            expect(item.emits('topic')).toBeTruthy();
            expect(item.emits('NOTHING')).toBeFalsy();
        });

        it('emits should let you know if a topic is registered after once', function() {
            var spy = sinon.spy();
            item.once('topic', spy);
            expect(item.emits('topic')).toBeTruthy();
            item.emit('topic');
            expect(item.emits('topic')).toBeFalsy();
        });

        it('emits should work with unregister', function() {
            item.on('topic', function(e) {
                e.unregister();
            });
            expect(item.emits('topic')).toBeTruthy();
            item.emit('topic');
            expect(item.emits('topic')).toBeFalsy();
        });

        //////////////////////////////////////////////////////
        /// NEW API
        //////////////////////////////////////////////////////
        it('event paramter should include the options object passed during registration', function() {
            var options = {
                foo: 'baz'
            };
            var event = {
                bar: 'lorem'
            };
            var spy = function(e) {
                expect(e).toHaveProperties('foo', 'bar');
                expect(e.bar).toMatch(event.bar);
                expect(e.foo).toMatch(options.foo);
            };
            item.on('topic', spy, spy, options);
            item.emit('topic', event);
        });

        it('should execute in the context of the publisher', function() {
            var test = {};
            test.handler = function() {
                return this;
            };
            var spy = sinon.spy(test, 'handler');
            item.on('topic', test.handler);

            item.emit('topic');

            expect(spy.returned(item)).toBeTruthy();
        });

        it('should have a fluid interface', function() {
            var single = sinon.spy();
            var multiple = sinon.spy();
            var event = {
                options: true
            };
            item.on('all', multiple).on('t2', single);

            item.emit('t1', event).emit('t2', event).emit('t3', event);

            expect(single).toHaveBeenCalledOnce();
            expect(single).toHaveBeenCalledWith(event);

            expect(multiple).toHaveBeenCalledThrice();
            expect(multiple.args[0]).toIncludeObject(['t1', event]);
        });

        it('should route all notices to a single handler if subscribed to the * channel', function() {
            var single = sinon.spy();
            var multiple = sinon.spy();

            var event = {
                options: true
            };
            item.on('all', multiple);
            item.on('topic', single);

            item.emit('topic', event);
            item.emit('topic2', event);
            item.emit('topic3', event);

            expect(single).toHaveBeenCalledOnce();
            expect(single).toHaveBeenCalledWith(event);

            var callbackArguments = multiple.args[0];
            expect(multiple).toHaveBeenCalledThrice();
            expect(callbackArguments[0]).toBe('topic');
        });

        it('topics for handlers registered with the once method should only be triggered once', function() {
            var single = sinon.spy(),
                multiple = sinon.spy();

            item.on('update', multiple).once('update', single);

            item.emit('update').emit('update').emit('update');

            expect(single).toHaveBeenCalledOnce();
            expect(multiple).toHaveBeenCalledThrice();
        });

        it('unregistering topics for once and on methods should not interfere', function() {
            var once = sinon.spy(),
                one = sinon.spy(),
                two = sinon.spy();

            item.on('update', one)
            item.once('update', once);
            item.on('update', two)

            item.emit('update');

            expect(once).toHaveBeenCalledOnce();
            expect(one).toHaveBeenCalledOnce();
            expect(two).toHaveBeenCalledOnce();
        });

        it('once handlers should retain the dispatchers scope by default', function() {
            var single = sinon.spy(),
                multiple = sinon.spy();

            item.on('update', multiple).once('update', single);

            item.emit('update').emit('update').emit('update');

            expect(single.calledOn(item)).toBeTruthy();
        });

        it('once handlers should retain the dispatchers scope provided as an argument', function() {
            var single = sinon.spy(),
                multiple = sinon.spy(),
                Model = function() {},
                source = new Model();

            item.on('update', multiple).once('update', single, source);

            item.emit('update').emit('update').emit('update');

            expect(single.calledOn(source)).toBeTruthy();
        });

        it('should debounce multiple events triggered in rapid succession', function() {
            var single = sinon.spy(),
                multiple = sinon.spy();

            item.on('update', multiple).debounce('update', single);

            item.emit('update').emit('update').emit('update');

            expect(single).toHaveBeenCalledOnce();
            expect(multiple).toHaveBeenCalledThrice();
        });

        it('event payload should provide a unregister method', function() {
            var handler = sinon.spy();
            item.on('topic', handler);
            item.emit('topic');
            expect(handler).toHaveBeenCalled();
            var event = handler.args[0][0];
            expect(event).toHaveMethods('unregister');
        });

        it('event unregister method should unregister handler', function() {
            var called = 0;
            item.on('topic', function(e) {
                called++;
                e.unregister();
            });
            item.emit('topic').emit('topic').emit('topic');
            expect(called).toBe(1);
        });
    });
});