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

    var defaults = {
        methodMapping:{
            publish:'publish',
            subscribe:'subscribe',
            unsubscribe:'unsubscribe'
        }
    };

    /**
     * [ description]
     * @param  {[type]} config [description]
     * @return {[type]}        [description]
     */
    var Gpub = function(config){
        this.options = _defaults((config || {}), defaults);

        this._callbacks = {};
    };

    //TODO: do we need to do deep extend?
    var _defaults = function(src, defaults) {
        for (var prop in defaults){
            if(prop in src) continue;
            src[prop] = defaults[prop];
        }
        return src;
    };

    var _publish = function(list, args, options){
        var event, i, l;
        //Invoke callbacks. We need length on each iter
        //cose it could change, unsubscribe.
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

            if(!event.callback.apply(event.scope, args)) break;
            // if(!event.callback.apply(event.scope, a)) break;
        }
    };

    var _slice = [].slice;

    /**
     * [ description]
     * @param  {[type]} $   [description]
     * @param  {[type]} src [description]
     * @param  {[type]} map [description]
     * @return {[type]}     [description]
     */
    Gpub.prototype.simple = function($, src, map){
        var o = $({});
        src = src || {};
        map = map || options.methodMapping;
        src[map['publish']] = function() { o.trigger.apply(o, arguments);};
        src[map['subscribe']] = function() { o.on.apply(o, arguments);};
        src[map['unsubscribe']] = function() { o.off.apply(o, arguments);};
    };

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
    Gpub.prototype.subscribe = function(topic, callback, scope, options){
        //Create _callbacks, unless we have it
        var topics = this._callbacks[topic] || (this._callbacks[topic] = []);

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
    Gpub.prototype.subscribers = function(topic){

        return this._callbacks.hasOwnProperty(topic) && this._callbacks[topic].length > 0;
    };

    /**
     * TODO: Add 'all' support.
     * 
     * @param  {[type]} topic   [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    Gpub.prototype.publish = function(topic, options){
        //Turn args obj into real array
        var args = _slice.call(arguments, 1);

        //get the first arg, topic name
        options = options || {};

        //include the options into the arguments, making sure that we
        //send it along if we just created it here.
        args.push(options);

        var list, calls, all;
        //return if no callback
        if(!(calls = this._callbacks)) return this;
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
    Gpub.prototype.unsubscribe = function(topic, callback/*, scope*/){

        var list, calls, i, l;

        if(!(calls = this._callbacks)) return this;

        if(!(list  = calls[topic])) return this;

        for(i = 0, l = list.length; i < l; i++){
            if(list[i].callback === callback) list.splice(i,1);
        }

        return this;
    };

    return Gpub;
});