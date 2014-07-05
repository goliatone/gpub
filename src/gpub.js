/**
 * @author goliatone
 * @url https://github.com/goliatone/gpub
 * @copyright (c) 2013 goliatone
 * @license MIT
 * @title Gpub: Simple pub/sub
 * @overview Gpub is an Event Dispatcher library. Or pub/sub.
 * @module Gpub
 */
/*global define:true*/
/* jshint strict: false */
define('gpub', function() {
    ////////////////////////////////////////////////////////
    /// PRIVATE METHODS
    ////////////////////////////////////////////////////////
    /*
     * TODO: Review paramters, "o" seems to be included in args!
     */
    var _publish = function(list, args, o) {
        var e, i = -1,
            l = list.length,
            a1 = args[0],
            a2 = args[1],
            a3 = args[2],
            _u = function() {
                e.target.off(e.topic, e.callback)
            },
            _a = function(e) {
                // o.event = e;
                o.topic = e.topic;
                o.target = e.target;
                o.unregister = _u;
                e.options && _mixin(o, e.options);
            };

        switch (args.length) {
            case 0:
                while (++i < l) {
                    e = list[i];
                    if (!e) continue;
                    _a(e);
                    if (e.callback.call(e.scope) === false) break;
                }
                return;
            case 1:
                while (++i < l) {
                    e = list[i];
                    if (!e) continue;
                    _a(e);
                    if (e.callback.call(e.scope, a1) === false) break;
                }
                return;
            case 2:
                while (++i < l) {
                    e = list[i];
                    if (!e) continue;
                    _a(e);
                    if (e.callback.call(e.scope, a1, a2) === false) break;
                }
                return;
            case 3:
                while (++i < l) {
                    e = list[i];
                    if (!e) continue;
                    _a(e);
                    if (e.callback.call(e.scope, a1, a2, a3) === false) break;
                }
                return;
            default:
                while (++i < l) {
                    e = list[i];
                    if (!e) continue;
                    _a(e);
                    if (e.callback.apply(e.scope, args) === false) break;
                }
                return;
        }
    };

    var _mixin = function(target, source) {

        if (typeof target === 'function') target = target.prototype;
        //TODO: Should we do Gpub.methods = ['on', 'off', 'emit', 'emits'];?
        Object.keys(source).forEach(function(method) {
            target[method] = source[method];
        });
        return target;
    };

    var _debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    /*var _debounce = function (fn, threshold, scope) {
        threshold = threshold ||  250;
        var last,
            deferTimer;
        return function () {
            var context = scope || this;

            var now = + new Date(),
            args = arguments;
            if (last && now < last + threshold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    };*/

    var _slice = [].slice;
    ////////////////////////////////////////////////////////
    /// CONSTRUCTOR
    ////////////////////////////////////////////////////////

    /**
     * Gpub is a simple pub sub library.
     * @class Gpub
     * @constructor
     */
    var Gpub = function() {};

    /**
     * Current VERSION
     */
    Gpub.VERSION = '0.3.4';


    ////////////////////////////////////////////////////////
    /// PUBLIC METHODS
    ////////////////////////////////////////////////////////

    /**
     * Register an event listener.
     * @param  {String}   topic    String indicating the event type
     * @param  {Function} callback Callback to handle event topics.
     * @param  {Object}   scope    We can dynamically change the scope of
     *                             the handler.
     * @param  {Object}   options  Options object that will be sent with the
     *                             event to all handler callbacks.
     * @return {this}
     */
    Gpub.prototype.on = function(topic, callback, scope, options) {
        //Create _callbacks, unless we have it
        var topics = this.callbacks(topic);

        //Create an array for the given topic key, unless we have it,
        //then append the callback to the array
        // topic.push(callback);
        var listener = {};
        listener.topic = topic;
        listener.callback = callback;
        listener.scope = scope || this;
        listener.target = this;
        listener.options = options;
        // event.options = options || {};//_merge((options || {}),{target:this});
        callback.__id__ = Gpub.uid();
        topics.push(listener);

        return this;
    };
    var UID = 0;
    Gpub.uid = function() {
        return ++UID;
    };

    /**
     * Checks to see if the provided topic has
     * registered listeners and thus triggering
     * and event.
     * @param  {String} topic Event type.
     * @return {this}
     */
    Gpub.prototype.emits = function(topic) {

        return this.callbacks().hasOwnProperty(topic) && this.callbacks(topic).length > 0;
    };

    /**
     * Triggers an event so all registered listeners
     * for the `topic` will be notified.
     * Optionally, we can send along an "event" object.
     *
     * @param  {String} topic   Event type.
     * @param  {Object} event   Options object, sent along
     *                          in the event to all listeners
     *                          registered with `topic`.
     * @return {this}
     */
    Gpub.prototype.emit = function(topic, event) {
        //TODO: Review WTF is going on with arguments here and _publish!!
        //Turn args obj into real array
        var args = _slice.call(arguments, 1);

        event = event || {};

        //include the options into the arguments, making sure that we
        //send it along if we just created it here.
        args.push(event);

        var list, calls, all;

        if (!(calls = this.callbacks())) return this;

        if (!(list = calls[topic]) && !calls['all']) return this;

        if ((all = calls['all'])) _publish(all.concat(), _slice.call(arguments, 0), event);

        if (list) _publish(list.concat(), args, event);

        return this;
    };

    /**
     * Unregisters the given `callback` from `topic`
     * events.
     * If called without arguments, it will remove all
     * listeners.
     * TODO: If we pass `topic` but no `callback` should we
     * remove all listeners of `topic`?
     *
     * @param  {String}   topic    Event type.
     * @param  {Function} callback Listener we want to remove.
     * @return {this}
     */
    Gpub.prototype.off = function(topic, callback /*, scope*/ ) {

        var list, calls, i, l;

        //TODO: Should we make a different Gpub::stop() method?
        if (!topic && !callback) this._callbacks = {};

        if (!(calls = this.callbacks())) return this;

        if (!(list = calls[topic])) return this;

        for (i = 0, l = list.length; i < l; i++) {
            //Remove empty refs, and our callback event listener.
            if (!list[i] || list[i].callback === callback) list.splice(i, 1);
        }

        return this;
    };

    /**
     * Returns all registered listeners for
     * a given `topic`.
     * If called without `topic` will return all
     * callbacks.
     *
     * Used internally.
     *
     * @param  {String} topic Event type.
     * @return {Object|Array}
     * @private
     */
    Gpub.prototype.callbacks = function(topic) {
        this._callbacks = this._callbacks || {};
        if (!topic) return this._callbacks;
        return this._callbacks[topic] || (this._callbacks[topic] = []);
    };

    Gpub.prototype.once = function(topic, callback, scope, options) {

        if (!callback || !topic) return this;
        scope = scope || this;

        var handler = (function() {
            arguments[0].unregister();
            callback.apply(scope, arguments);
        });

        this.on(topic, handler, scope, options);

        return this;
    };

    /**
     * Use it to discard a number of fast paced
     * events, eg if you want to listen to a
     * model's update event and trigger a render
     * method.
     *
     * TODO: Update `Gpub.observable` change with debounce.
     *
     * @param  {String}   topic    Event type.
     * @param  {Function} callback Listener we want to remove.
     * @param  {int}      wait     Miliseconds to wait.
     * @param  {Object}   scope    We can dynamically change the scope of
     *                             the handler.
     * @param  {Object}   options  Options object that will be sent with the
     *                             event to all handler callbacks.
     * @return {this}
     */
    Gpub.prototype.debounce = function(topic, callback, wait, scope, options) {
        if (wait === undefined) wait = 1;
        var handler = _debounce(callback, wait, true);
        this.on(topic, handler, scope, options);
        return this;
    };

    ////////////////////////////////////////////////////////
    /// STATIC METHODS
    ////////////////////////////////////////////////////////
    /**
     * Observable mixin. It will add `Gpub` methods
     * to the given `target`.
     * If we provide a `constructor` it will extend
     * it's prototype.
     *
     * ```javascript
     *     var Model = function(){};
     *     Gpub.observable(Model);
     *     var user = new Model();
     *     user.on('something', function(){console.log('Hola!')});
     *     user.emit('something');
     * ```
     *
     * @param  {Object|Function} target
     * @return {Object|Function} Returns the given object.
     */
    Gpub.observable = function(target) {
        return _mixin(target || {}, Gpub.prototype);
    };

    /**
     * It will create methods in `src` to register
     * handlers for all passed events.
     *
     * If we pass:
     *     var Model = function(){};
     *     var events = ['change', 'sync'];
     *     Gpub.delegable(Model.prototype, events);
     *     var user = new Model();
     *     user.onsync(function(e){console.log('sync\'d', e)});
     *     user.onchange(function(e){console.log('changed', e)});
     *     user.emit('change').emit('sync');
     *
     * By default, methods generated will be in the form
     * of **on**+**event**.
     * We can pass in a custom method name generator.
     *
     * If the passed in `src` object is not an instance
     * of `Gpub` it will be augmented with the mixin.
     *
     * @param  {Object} src          Object to extend
     *                               with methods.
     * @param  {Array|String} events       Events for which we want to
     *                                     generate delegate methods.
     * @param  {Function} eventBuilder Function to generate the delegate
     *                                 method name.
     * @param  {String} glue         If we pass in a string, this
     *                               will be used to split into different
     *                               event types.
     * @return {Object}              Returns passed in object.
     */
    Gpub.delegable = function(src, events, eventBuilder, glue) {
        //TODO: DRY, make check all methods!!
        if (!('on' in src) || !('emit' in src)) this.observable(src);

        eventBuilder || (eventBuilder = function(e) {
            return 'on' + e;
        });

        if (typeof events === 'string') events = events.split(glue || ' ');

        var method, bind = typeof src === 'function';
        events.forEach(function(event) {
            method = function(handler) {
                if (!handler) return this;
                this.on(event, handler);
                return this;
            };
            if (bind) method.bind(src);
            src[eventBuilder(event)] = method;
        });

        return src;
    };

    /**
     * It will monkey patch the given `src` setter
     * method so that it triggers a `change` and `change:<key>`
     * event on update. The event object carries the old value
     * and the current value, plus the updated property name.
     *
     * It's a quick way to generate a bindable model.
     *
     * ```javascript
     *     var Model = function(){this.data={}};
     *     Model.prototype.set = function(key, value) {
     *         this.data[key] = value;
     *         return this;
     *     };
     *     Model.prototype.get = function(key, def){
     *         return this.data.hasOwnProperty(key) ? this.data[key] : def;
     *     };
     *     Gpub.bindable(Model.prototype, 'set', 'get');
     * ```
     * If we don't specify a `set` or `get` value, then
     * `set` and `get` will be used by default.
     *
     * @param  {Object} src  Object to be augmented.
     * @param  {String} set  Name of `set` method in `src`
     * @param  {String} get  Name of `get` method in `src`
     * @param  {Boolean} bind Should we bind the generated method?
     * @return {Object}      Returns the passed in object.
     */
    Gpub.bindable = function(src, set, get, bind) {
        if (!src) return this.logger.warn('Gpub.bindable: src undefined');

        // var bind = (typeof src === 'function');
        // src = bind ? src.prototype : src;
        //TODO: DRY, make check all methods!!
        if (!('on' in src) || !('emit' in src)) this.observable(src);

        var _set = src[set || 'set'],
            _get = src[get || 'get'];

        var method = function(key, value) {
            var old = _get.call(this, key),
                out = _set.call(this, key, value),
                //TODO: _buildEvent({old:old, value:value, target:this});
                evt = {
                    old: old,
                    value: value,
                    property: key
                };

            if (old === value) return out;

            if (this.emits('change')) this.emit('change', evt);
            if (this.emits('change:' + key)) this.emit('change:' + key, evt);
            return out;
        };

        if (bind) method.bind(src);

        src[set] = method;

        return src;
    };

    /**
     * Logger stub method.
     * Console might need to be shimmed.
     */
    Gpub.prototype.logger = console;

    ////////////////////////////////////////////////////////
    /// LEGACY METHODS: This will be removed soon.
    ////////////////////////////////////////////////////////
    /*
     * This is so that we can keep backwards compatibility
     * with old API. It will be removed soon!
     */
    /**@deprecated*/
    Gpub.prototype.publish = Gpub.prototype.emit;
    /**@deprecated*/
    Gpub.prototype.subscribe = Gpub.prototype.on;
    /**@deprecated*/
    Gpub.prototype.unsubscribe = Gpub.prototype.off;
    /**@deprecated*/
    Gpub.prototype.subscribers = Gpub.prototype.emits;



    return Gpub;
});