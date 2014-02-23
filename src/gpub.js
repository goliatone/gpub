/*
 * gpub
 * https://github.com/goliatone/gpub
 *
 * Copyright (c) 2013 goliatone
 * Licensed under the MIT license.
 */
/*global define:true*/
/* jshint strict: false */
define('gpub', function($) {

   /**
    * Gpub is a simple pub sub library.
    */
    var Gpub = function(){};


    var _publish = function(list, args, options){
        var event, i, l;
        //Invoke callbacks. We need length on each iter
        //cose it could change, off.
        // args = _slice.call(arguments, 1);
        //var o;
        for(i = 0, l = list.length; i < l; i++){
            event = list[i];
            if(!event) continue;

            //We want to have a dif. options object
            //for each callback;
            options.event  = event;
            options.target = event.target;//shortcut to access target.
            // o = $.extend({},options);

            if(event.callback.apply(event.scope, args) === false) break;
            // if(!event.callback.apply(event.scope, a)) break;
        }
    };

    var _mixin = function(target, source){
        
        if(typeof target === 'function') target = target.prototype;
        //TODO: Should we do Gpub.methods = ['on', 'off', 'emit', 'emits'];?
        Object.keys(source).forEach(function(method){
            target[method] = source[method];
        });
        return target;
    };

    var _slice = [].slice;

    

    /**
     * PubSub mixin.
     * TODO: Handle scope!!! <= DONE
     * TODO: Handle options! <= WE NEED TO CLONE THEM!
     *
     * Use:
     * Module.include(PubSub);
     * If we need more complex stuff:
     * 
     */
    Gpub.prototype.on = function(topic, callback, scope, options){
        //Create _callbacks, unless we have it
        var topics = this.callbacks(topic);

        //Create an array for the given topic key, unless we have it,
        //then append the callback to the array
        // topic.push(callback);
        var event = {};
        event.topic = topic;
        event.callback = callback;
        event.scope = scope || this;
        event.target = this;
        // event.options = options || {};//_merge((options || {}),{target:this});

        topics.push(event);

        return this;
    };

    /**
     * [ description]
     * @param  {[type]} topic [description]
     * @return {[type]}       [description]
     */
    Gpub.prototype.emits = function(topic){

        return this.callbacks().hasOwnProperty(topic) && this.callbacks(topic).length > 0;
    };

    /**
     * TODO: Add 'all' support.
     * 
     * @param  {[type]} topic   [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    Gpub.prototype.emit = function(topic, options){
        //Turn args obj into real array
        var args = _slice.call(arguments, 1);

        //get the first arg, topic name
        options = options || {};

        //include the options into the arguments, making sure that we
        //send it along if we just created it here.
        args.push(options);

        var list, calls, all;
        //return if no callback
        if(!(calls = this.callbacks())) return this;
        //get listeners, if none and no global handlers, return.
        if(!(list = calls[topic]) && !calls['all']) return this;
        //if global handlers, append to list.
        //if((all = calls['all'])) list = (list || []).concat(all);

        if((all = calls['all'])) _publish.call(this, all, _slice.call(arguments, 0), options);
        // if((all = calls['all'])) _publish.call(this, all, [topic].concat(args));
        if(list) _publish.call(this,list, args, options);

        return this;
    };

    /**
     * [ description]
     * @param  {[type]}   topic    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    Gpub.prototype.off = function(topic, callback/*, scope*/){

        var list, calls, i, l;

        //TODO: Should we make a different Gpub::stop() method?
        if(!topic && !callback) this._callbacks = {};

        if(!(calls = this.callbacks())) return this;

        if(!(list  = calls[topic])) return this;

        for(i = 0, l = list.length; i < l; i++){
            if(list[i].callback === callback) list.splice(i,1);
        }

        return this;
    };

    Gpub.prototype.callbacks = function(topic){
        this._callbacks = this._callbacks || {};
        if(!topic) return this._callbacks;
        return this._callbacks[topic] || (this._callbacks[topic] = []);
    };

    

    

    Gpub.observable = function(target){
        return _mixin(target || {}, Gpub.prototype);
    };

    Gpub.delegable = function(src, events, eventBuilder, glue){
        //TODO: DRY, make check all methods!!
        if(!('on' in src) || !('emit' in src)) this.observable(src);

        eventBuilder || (eventBuilder = function(e){ return 'on'+e;});
            
        if(typeof events === 'string') events = events.split(glue || ' ');

        var method, bind = typeof src === 'function';
        events.forEach(function(event){
            method = function(handler){
                if(!handler) return this;
                this.on(event, handler);
                return this;
            };
            if(bind) method.bind(src);
            src[eventBuilder(event)] = method;
        });
    };

    Gpub.bindable = function(src, set, get, bind){
        // var bind = (typeof src === 'function');
        // src = bind ? src.prototype : src;
        //TODO: DRY, make check all methods!!
        if(!('on' in src) || !('emit' in src)) this.observable(src);

        var _set = src[set], _get = src[get];

        var method = function(key, value){
            var old = _get.call(this, key),
                out = _set.call(this, key, value),
                //TODO: _buildEvent({old:old, value:value, target:this});
                evt = {old:old, value:value, property:key};

            if (this.emits('change')) this.emit('change', evt);
            if (this.emits('change:' + key)) this.emit('change:'+key, evt);
            return out;
        };

        if(bind) method.bind(src);

        src[set] = method;
    };

    /**
     * This is so that we can keep backwards compatibility
     * with old API. It will be removed soon!
     */
    Gpub.prototype.publish     = Gpub.prototype.emit;
    Gpub.prototype.subscribe   = Gpub.prototype.on;
    Gpub.prototype.unsubscribe = Gpub.prototype.off;
    Gpub.prototype.subscribers = Gpub.prototype.emits;
    


    return Gpub;
});