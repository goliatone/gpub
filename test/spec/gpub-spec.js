/*global define:true*/
/*global describe:true */
/*global it:true */
/*global expect:true */
/*global beforeEach:true */
/*global sinon:true */
/* jshint strict: false */
define(['gpub'], function(Gpub) {

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
            var options = {
                options: true
            };
            item.subscribe('topic', spy);
            item.publish('topic', options);
            expect(spy).toHaveBeenCalledWith(options);
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

            var options = {
                options: true
            };
            item.subscribe('all', multiple);
            item.subscribe('topic', single);

            item.publish('topic', options);
            item.publish('topic2', options);
            item.publish('topic3', options);

            expect(single).toHaveBeenCalledOnce();

            var callbackArguments = multiple.args[0];
            var e = callbackArguments[0];
            expect(multiple).toHaveBeenCalledThrice();
            expect(e.topic).toBe('all');
            expect(e).toHaveProperties('event', 'options');
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
        });

        it('should execute in the context of the publisher', function() {
            var test = {};
            test.handler = function() {
                return this;
            };
            var spy = sinon.spy(test, 'handler');
            item.subscribe('topic', test.handler);

            item.publish('topic');

            expect(spy.returned(item)).toBeTruthy();
        });

        it('should include all event props into the options parameter', function() {

            //SHOULD WE MAKE THIS A FEATURE OR A BUG?!
            //for now, we leave it as it is.
            var handler = {};
            handler.onTopic = function(options) {
                // console.log('*****************');
                // console.log(arguments);
                // console.log('*****************');

                handler.id = this.id;
                options.age++;
                expect(options.age).toBe(2);
                return this;
            };
            handler.onTopicTwo = function(options) {
                options.age++;
                expect(options.age).toBe(3);
                // console.log('*****************');
                // console.log(arguments);
                // console.log('*****************');
            };

            var spy = sinon.spy(handler, 'onTopic');

            item.id = 23;
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
            expect(handler.id).toEqual(item.id);
            expect(spy.args[0][0]).toHaveProperties('target', 'event');
        });
        //////////////////////////////////////////////////////
        /// NEW API
        //////////////////////////////////////////////////////
        it('should handle once and on events simultaneously', function() {
            var once = sinon.spy(),
                on = sinon.spy();

            item.on('topic', on);
            item.once('topic', once);
            item.on('topic', on);

            item.emit('topic');
            expect(once).toHaveBeenCalledOnce();
            expect(on).toHaveBeenCalledTwice();
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
            var opt = {
                options: true
            };
            item.on('all', multiple).on('t2', single);

            item.emit('t1', opt).emit('t2', opt).emit('t3', opt);

            expect(single).toHaveBeenCalledOnce();
            expect(single).toHaveBeenCalledWith(opt);

            expect(multiple).toHaveBeenCalledThrice();
        });

        it('should route all notices to a single handler if subscribed to the * channel', function() {
            var single = sinon.spy();
            var multiple = sinon.spy();

            var options = {
                options: true
            };
            item.on('all', multiple);
            item.on('topic', single);

            item.emit('topic', options);
            item.emit('topic2', options);
            item.emit('topic3', options);

            expect(single).toHaveBeenCalledOnce();
            // expect(single).toHaveBeenCalledWith(options);

            var callbackArguments = multiple.args[0];
            var e = callbackArguments[0];
            expect(multiple).toHaveBeenCalledThrice();
            expect(e.topic).toBe('all');
            expect(e).toHaveProperties('event', 'options');
        });

        it('topics for handlers registered with the once method should only be triggered once', function() {
            var single = sinon.spy(),
                multiple = sinon.spy();

            item.on('update', multiple).once('update', single);

            item.emit('update').emit('update').emit('update');

            expect(single).toHaveBeenCalledOnce();
            expect(multiple).toHaveBeenCalledThrice();
        });

        it('once handlers should retain the dispatchers scope', function() {
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

        it('should register any of the topics passed in as an array', function(){
            var handler = sinon.spy();
            var types = ['topic0', 'topic1', 'topic2'];

            item.multi(types, handler);

            types.forEach(function(type){
                item.emit(type);
            });

            expect(handler).toHaveBeenCalledThrice();
        });

        it('should register any of the topics passed in as a string', function(){
            var handler = sinon.spy();
            var types = ['topic0', 'topic1', 'topic2'];

            item.multi(types.join(' '), handler);

            types.forEach(function(type){
                item.emit(type);
            });

            expect(handler).toHaveBeenCalledThrice();
        });

        it('it should unregister listeners with "off"', function(done) {
            var called = 0;
            function handler(){
                called++;
                item.off('update', handler);
            }

            item.on('update', handler);

            runs(function(){
                item.emit('update').emit('update').emit('update');
                expect(called).toEqual(1);
            });
        });

        it('it should unregister listeners with the event unregister method', function(done) {
            var called = 0;
            function handler(e){
                called++;
                e.unregister();
            }

            item.on('update', handler);

            runs(function(){
                item.emit('update').emit('update').emit('update');
                expect(called).toEqual(1);
            });
        });
    });

    describe('event payload', function(){
        it('should have a "topic" property matching event type', function(){
            var eventType = 'eventType';
            item.on(eventType, function(e){
                expect(e.topic).toEqual(eventType);
            });
            item.emit(eventType);
        });

        it('should have an "unregister" function', function(){
            var eventType = 'eventType';
            item.on(eventType, function(e){
                expect(e.unregister).toBeOfType('function');
            });
            item.emit(eventType);
        });

        it('should have a "target" property', function(){
            var eventType = 'eventType';

            item.on(eventType, function(e){
                expect(e.target).toBeTruthy();
            });

            item.emit(eventType);
        });
    });
});