/*global define:true*/
/*global describe:true */
/*global it:true */
/*global expect:true */
/*global beforeEach:true */
/*global sinon:true */
/* jshint strict: false */
define(['gpub', 'jquery'], function(Gpub, $) {

    describe('just checking', function() {

        it('Gpub should be loaded', function() {
            expect(Gpub).toBeTruthy();
            var gpub = new Gpub();
            expect(gpub).toBeTruthy();
        });
    });
    var item;
    beforeEach(function(){
        item = new Gpub();
    });

    describe('gpub', function(){
        it('We can extend simple objects with pubsub cap.',function(){
            expect(item).toBeTruthy();
            expect(item).toHaveMethods('publish','unsubscribe','subscribe');
        });

        it('objects can subscribe to a pubsub instance',function(){
            var subscriber = function(){};
            item.subscribe('topic',subscriber);
            expect(item.subscribers('topic')).toBeTruthy();
            expect(item.subscribers('non-topic')).toBeFalsy();
        });

        it('objects can unsubscribe from a pubsub instance',function(){
            var subscriber = function subscriber(){};
            item.subscribe('topic',subscriber);
            item.subscribe('topic-two',subscriber);
            expect(item.subscribers('topic')).toBeTruthy();
            item.unsubscribe('topic',subscriber);
            expect(item.subscribers('topic')).toBeFalsy();
        });

        it('objects get notified of publisehd topics',function(){
            var spy = sinon.spy();
            item.subscribe('topic',spy);
            item.publish('topic');
            expect(spy).toHaveBeenCalled();
        });

        it('objects get notified of publisehd topics',function(){
            var spy = sinon.spy();
            var options = {options:true};
            item.subscribe('topic',spy);
            item.publish('topic',options);
            expect(spy).toHaveBeenCalledWith(options);
            expect(spy).not.toHaveBeenCalledWith({});
        });

        it('a handler can abort the publish loop',function(){
            var test = {};
            test.handler = function(){return false;};

            var spyB = sinon.spy();
            var spyC = sinon.spy();
            var spyA = sinon.spy(test, 'handler');

            //here it works cose we have the same order.
            item.subscribe('topic',spyA);
            item.subscribe('topic',spyB);
            item.subscribe('topic',spyC);

            item.publish('topic');
            expect(spyA).toHaveBeenCalled();
            expect(spyB).not.toHaveBeenCalled();
            expect(spyC).not.toHaveBeenCalled();
        });

        it('should route all notices to a single handler if subscribed to the * channel',function(){
            var single   = sinon.spy();
            var multiple = sinon.spy();

            var options = {options:true};
            item.subscribe('all',multiple);
            item.subscribe('topic',single);

            item.publish('topic',options);
            item.publish('topic2',options);
            item.publish('topic3',options);

            expect(single).toHaveBeenCalledOnce();
            // expect(single).toHaveBeenCalledWith(options);

            var callbackArguments = multiple.args[0];
            expect(multiple).toHaveBeenCalledThrice();
            expect(callbackArguments[0]).toBe('topic');
            expect(callbackArguments[1]).toHaveProperties('event','options');
        });

        it('should have a fluid interface',function(){
            var single   = sinon.spy();
            var multiple = sinon.spy();
            var opt = {options:true};
            item.subscribe('all',multiple).subscribe('t2',single);

            item.publish('t1',opt).publish('t2',opt).publish('t3',opt);

            expect(single).toHaveBeenCalledOnce();
            expect(single).toHaveBeenCalledWith(opt);

            expect(multiple).toHaveBeenCalledThrice();
            expect(multiple.args[0]).toIncludeObject(['t1',opt]);
        });

        it('should execute in the context of the publisher',function(){
            var test = {};
            test.handler = function(){return this;};
            var spy = sinon.spy(test,'handler');
            item.subscribe('topic',test.handler);

            item.publish('topic');

            expect(spy.returned(item)).toBeTruthy();
        });

        it('shoud include all event props into the options parameter',function(){

            //SHOULD WE MAKE THIS A FEATURE OR A BUG?!
            //for now, we leave it as it is.
            var handler = {};
            handler.onTopic = function(options){
                console.log('*****************');
                console.log(arguments);
                console.log('*****************');

                handler.id = this.id;
                options.age++;
                expect(options.age).toBe(2);
                return this;
            };
            handler.onTopicTwo = function(options){
                options.age++;
                expect(options.age).toBe(3);
                console.log('*****************');
                console.log(arguments);
                console.log('*****************');
            };

            var spy = sinon.spy(handler, 'onTopic');

            item.id = 23;
            item.subscribe('topic', handler.onTopic);
            item.subscribe('topic',handler.onTopicTwo);

            item.publish('topic', {age:1});

            expect(spy).toHaveBeenCalledOnce();
            expect(spy.returned(item)).toBeTruthy();
            expect(spy.args[0]).toBeTruthy();
            expect(spy.args[0]).toHaveLength(2);//we have age + event.

            expect(handler.id).toBeTruthy();
            expect(handler.id).toEqual(item.id);
            expect(spy.args[0][0]).toHaveProperties('target','event');
        });
//////////////////////////////////////////////////////
/// NEW API
//////////////////////////////////////////////////////
        it('should execute in the context of the publisher',function(){
            var test = {};
            test.handler = function(){return this;};
            var spy = sinon.spy(test,'handler');
            item.on('topic',test.handler);

            item.emit('topic');

            expect(spy.returned(item)).toBeTruthy();
        });

        it('should have a fluid interface',function(){
            var single   = sinon.spy();
            var multiple = sinon.spy();
            var opt = {options:true};
            item.on('all',multiple).on('t2',single);

            item.emit('t1',opt).emit('t2',opt).emit('t3',opt);

            expect(single).toHaveBeenCalledOnce();
            expect(single).toHaveBeenCalledWith(opt);

            expect(multiple).toHaveBeenCalledThrice();
            expect(multiple.args[0]).toIncludeObject(['t1',opt]);
        });

        it('should route all notices to a single handler if subscribed to the * channel',function(){
            var single   = sinon.spy();
            var multiple = sinon.spy();

            var options = {options:true};
            item.on('all',multiple);
            item.on('topic',single);

            item.emit('topic',options);
            item.emit('topic2',options);
            item.emit('topic3',options);

            expect(single).toHaveBeenCalledOnce();
            // expect(single).toHaveBeenCalledWith(options);

            var callbackArguments = multiple.args[0];
            expect(multiple).toHaveBeenCalledThrice();
            expect(callbackArguments[0]).toBe('topic');
            expect(callbackArguments[1]).toHaveProperties('event','options');
        });

//////////////////////////////////////////////////////
/// STATIC METHODS
//////////////////////////////////////////////////////
        it('should make a passed object bindable', function(){
            /*var M = function(){this.data={}};
            M.prototype.set = function(key, value){ this.data[key] = value; return this;};
            M.prototype.get = function(key,def){ return this.data[key] || def; };

            M.prototype = new Gpub();
            Gpub.bindable(M.prototype, 'set', 'get');
            var model = new M();

            model.set('test', 23).on('change', function(e, p){
                console.log('change: old %s new %s', p.old, p.value);
            }).on('change:test', function(e, p){
                console.log('change.test: old %s new %s', p.old, p.value);
            }).set('test',44);
            */
        });



    });
});