

<!-- Start src/gpub.js -->

Gpub: Simple pub/sub
======================

Gpub is an Event Dispatcher library. Or pub/sub. But
with class, suckers.

[Gitter](https://gitter.im/goliatone/gpub#) here you can ask questions when you need help.

Author: goliatone <hello@goliatone.com>

Version: 0.3.0

## _publish(list, args, options)
       

Publish method.

### Params: 

* **Array** *list* List of event objects

* **Array** *args* Arguments for callback

* **Object** *options* Options object

### Return:

* **Boolean|undefined** If callback returns false

```javascript
var _publish = function(list, args, options){
        var event, i, l;
        //Invoke callbacks. We need length on each iter
        //cose it could change, off.
        // args = _slice.call(arguments, 1);
        //var o;
        for(i = 0, l = list.length; i &lt; l; i++){
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
```

## _mixin(target, source)
       

Mixin util.

### Params: 

* **Object|Function** *target* Object to be extended

* **Object|Function** *source* Object that lends props.

### Return:

* **Object|Function** Rerutn target object.

```javascript
var _mixin = function(target, source){
        
        if(typeof target === &#39;function&#39;) target = target.prototype;
        //TODO: Should we do Gpub.methods = [&#39;on&#39;, &#39;off&#39;, &#39;emit&#39;, &#39;emits&#39;];?
        Object.keys(source).forEach(function(method){
            target[method] = source[method];
        });
        return target;
    };

    var _slice = [].slice;
```

## Gpub
       

Gpub is a simple pub sub library.

## on(topic, callback, scope, options)
       

Register an event listener.

### Params: 

* **String** *topic* String indicating the event type

* **Function** *callback* Callback to handle event topics.

* **Object** *scope* We can dynamically change the scope of 

* **Object** *options* Options object that will be sent with the

### Return:

* **this** 

```javascript
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
```

## emits(topic)
       

Checks to see if the provided topic has
registered listeners and thus triggering
and event.

### Params: 

* **String** *topic* Event type.

### Return:

* **this** 

```javascript
Gpub.prototype.emits = function(topic){

        return this.callbacks().hasOwnProperty(topic) &amp;&amp; this.callbacks(topic).length &gt; 0;
    };
```

## emit(topic, options)
       

Triggers an event so all registered listeners
for the `topic` will be notified.
Optionally, we can send along an options object.

### Params: 

* **String** *topic* Event type.

* **Object** *options* Options object, sent along

### Return:

* **this** 

```javascript
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
        if(!(list = calls[topic]) &amp;&amp; !calls[&#39;all&#39;]) return this;
        //if global handlers, append to list.
        //if((all = calls[&#39;all&#39;])) list = (list || []).concat(all);

        if((all = calls[&#39;all&#39;])) _publish.call(this, all, _slice.call(arguments, 0), options);
        // if((all = calls[&#39;all&#39;])) _publish.call(this, all, [topic].concat(args));
        if(list) _publish.call(this,list, args, options);

        return this;
    };
```

## off(topic, callback)
       

Unregisters the given `callback` from `topic`
events.

If called without arguments, it will remove all 
listeners.

TODO: If we pass `topic` but no `callback` should we
remove all listeners of `topic`?

### Params: 

* **String** *topic* Event type.

* **Function** *callback* Listener we want to remove.

### Return:

* **this** 

```javascript
Gpub.prototype.off = function(topic, callback
```

scope

## callbacks(topic)
       

Returns all registered listeners for
a given `topic`.
If called without `topic` will return all
callbacks.

Used internally.

### Params: 

* **String** *topic* Event type.

### Return:

* **Object|Array** 

```javascript
Gpub.prototype.callbacks = function(topic){
        this._callbacks = this._callbacks || {};
        if(!topic) return this._callbacks;
        return this._callbacks[topic] || (this._callbacks[topic] = []);
    };
```

## observable(target)
       

Observable mixin. It will add `Gpub` methods
to the given `target`.
If we provide a `constructor` it will extend
it&#39;s prototype.

### Params: 

* **Object|Function** *target* 

### Return:

* **Object|Function** Returns the given object.

```javascript
Gpub.observable = function(target){
        return _mixin(target || {}, Gpub.prototype);
    };
```

## delegable(src, events, eventBuilder, glue)
       

It will create methods in `src` to register
handlers for all passed events.

If we pass:

    var Model = function(){};
    var events = [&quot;change&quot;, &quot;sync&quot;];
    Gpub.delegable(Model.prototype, events);
    var user = new Model();
    user.onsync(function(e){console.log(&quot;syncd&quot;, e)});
    user.onchange(function(e){console.log(&quot;changed&quot;, e)});
    user.emit(&quot;change&quot;).emit(&quot;sync&quot;);

By default, methods generated will be in the form
of **on**+**event**.
We can pass in a custom method name generator.

If the passed in `src` object is not an instance
of `Gpub` it will be augmented with the mixin.

### Params: 

* **Object** *src* Object to extend

* **Array|String** *events* Events for which we want to

* **Function** *eventBuilder* Function to generate the delegate

* **String** *glue* If we pass in a string, this

### Return:

* **Object** Returns passed in object.

```javascript
Gpub.delegable = function(src, events, eventBuilder, glue){
        //TODO: DRY, make check all methods!!
        if(!(&#39;on&#39; in src) || !(&#39;emit&#39; in src)) this.observable(src);

        eventBuilder || (eventBuilder = function(e){ return &#39;on&#39;+e;});
            
        if(typeof events === &#39;string&#39;) events = events.split(glue || &#39; &#39;);

        var method, bind = typeof src === &#39;function&#39;;
        events.forEach(function(event){
            method = function(handler){
                if(!handler) return this;
                this.on(event, handler);
                return this;
            };
            if(bind) method.bind(src);
            src[eventBuilder(event)] = method;
        });

        return src;
    };
```

## bindable(src, set, get, bind)
       

It will monkey patch the given `src` setter
method so that it triggers a `change` and `change:&lt;key&gt;` 
event on update. The event object carries the old value
and the current value, plus the updated property name.

It&#39;s a quick way to generate a bindable model.

    var Model = function(){this.data={}};
    Model.prototype.set = function(key, value) {
        this.data[key] = value;
        return this;
    };
    Model.prototype.get = function(key, def){
        return this.data[key] || def;
    };
    Gpub.bindable(Model.prototype, &#39;set&#39;, &#39;get&#39;);

If we don&#39;t specify a `set` or `get` value, then
`set` and `get` will be used by default.

### Params: 

* **Object** *src* Object to be augmented.

* **String** *set* Name of `set` method in `src`

* **String** *get* Name of `get` method in `src`

* **Boolean** *bind* Should we bind the generated method?

### Return:

* **Object** Returns the passed in object.

```javascript
Gpub.bindable = function(src, set, get, bind){
        // var bind = (typeof src === &#39;function&#39;);
        // src = bind ? src.prototype : src;
        //TODO: DRY, make check all methods!!
        if(!(&#39;on&#39; in src) || !(&#39;emit&#39; in src)) this.observable(src);

        var _set = src[set || &#39;set&#39;], _get = src[get || &#39;get&#39;];

        var method = function(key, value){
            var old = _get.call(this, key),
                out = _set.call(this, key, value),
                //TODO: _buildEvent({old:old, value:value, target:this});
                evt = {old:old, value:value, property:key};

            if (this.emits(&#39;change&#39;)) this.emit(&#39;change&#39;, evt);
            if (this.emits(&#39;change:&#39; + key)) this.emit(&#39;change:&#39;+key, evt);
            return out;
        };

        if(bind) method.bind(src);

        src[set] = method;

        return src;
    };
```

## publish
       

@method

**Deprecated**

## subscribe
       

@function

**Deprecated**

## unsubscribe
       

@function

**Deprecated**

## subscribers
       

@function

**Deprecated**

<!-- End src/gpub.js -->

