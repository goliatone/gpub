@author goliatone

_Source: [src/gpub.js](../src/gpub.js)_

<a name="tableofcontents"></a>

- <a name="toc_gpubprototypeontopic-callback-scope-options"></a><a name="toc_gpubprototype"></a><a name="toc_gpub"></a>[Gpub.prototype.on](#gpubprototypeontopic-callback-scope-options)
- <a name="toc_gpubprototypeemitstopic"></a>[Gpub.prototype.emits](#gpubprototypeemitstopic)
- <a name="toc_gpubprototypeemittopic-options"></a>[Gpub.prototype.emit](#gpubprototypeemittopic-options)
- <a name="toc_gpubprototypeofftopic-callback"></a>[Gpub.prototype.off](#gpubprototypeofftopic-callback)
- <a name="toc_gpubprototypecallbackstopic"></a>[Gpub.prototype.callbacks](#gpubprototypecallbackstopic)
- <a name="toc_gpubobservabletarget"></a>[Gpub.observable](#gpubobservabletarget)
- <a name="toc_gpubdelegablesrc-events-eventbuilder-glue"></a>[Gpub.delegable](#gpubdelegablesrc-events-eventbuilder-glue)
- <a name="toc_gpubbindablesrc-set-get-bind"></a>[Gpub.bindable](#gpubbindablesrc-set-get-bind)
- <a name="toc_gpubprototypepublish"></a>[Gpub.prototype.publish](#gpubprototypepublish)
- <a name="toc_gpubprototypesubscribe"></a>[Gpub.prototype.subscribe](#gpubprototypesubscribe)
- <a name="toc_gpubprototypeunsubscribe"></a>[Gpub.prototype.unsubscribe](#gpubprototypeunsubscribe)
- <a name="toc_gpubprototypesubscribers"></a>[Gpub.prototype.subscribers](#gpubprototypesubscribers)

<a name="gpubprototype"></a>

<a name="gpub"></a>

# Gpub.prototype.on(topic, callback, scope, options)

> Register an event listener.

**Parameters:**

- `{String} topic` String indicating the event type
- `{Function} callback` Callback to handle event topics.
- `{Object} scope` We can dynamically change the scope of 

the handler.

- `{Object} options` Options object that will be sent with the

event to all handler callbacks.

**Return:**

`{this}`

<sub>Go: [TOC](#tableofcontents) | [Gpub.prototype](#toc_gpubprototype)</sub>

# Gpub.prototype.emits(topic)

> Checks to see if the provided topic has
registered listeners and thus triggering
and event.

**Parameters:**

- `{String} topic` Event type.

**Return:**

`{this}`

<sub>Go: [TOC](#tableofcontents) | [Gpub.prototype](#toc_gpubprototype)</sub>

# Gpub.prototype.emit(topic, options)

> Triggers an event so all registered listeners
for the `topic` will be notified.
Optionally, we can send along an options object.

**Parameters:**

- `{String} topic` Event type.
- `{Object} options` Options object, sent along

in the event to all listeners 
registered with `topic`.

**Return:**

`{this}`

<sub>Go: [TOC](#tableofcontents) | [Gpub.prototype](#toc_gpubprototype)</sub>

# Gpub.prototype.off(topic, callback)

> Unregisters the given `callback` from `topic`
events.
If called without arguments, it will remove all 
listeners.
TODO: If we pass `topic` but no `callback` should we
remove all listeners of `topic`?

**Parameters:**

- `{String} topic` Event type.
- `{Function} callback` Listener we want to remove.

**Return:**

`{this}`

<sub>Go: [TOC](#tableofcontents) | [Gpub.prototype](#toc_gpubprototype)</sub>

# Gpub.prototype.callbacks(topic)

> Returns all registered listeners for
a given `topic`.
If called without `topic` will return all
callbacks.

Used internally.

**Parameters:**

- `{String} topic` Event type.

**Return:**

`{Object | Array}`



<sub>Go: [TOC](#tableofcontents) | [Gpub.prototype](#toc_gpubprototype)</sub>

# Gpub.observable(target)

> Observable mixin. It will add `Gpub` methods
to the given `target`.
If we provide a `constructor` it will extend
it's prototype.

```javascript
```js
var Model = function(){};
Gpub.observable(Model);
var user = new Model();
user.on('something', function(){console.log('Hola!')});
user.emit('something');
```

```

**Parameters:**

- `{Object | Function} target`

**Return:**

`{Object | Function}` Returns the given object.

<sub>Go: [TOC](#tableofcontents) | [Gpub](#toc_gpub)</sub>

# Gpub.delegable(src, events, eventBuilder, glue)

> It will create methods in `src` to register
handlers for all passed events.

If we pass:
```js
var Model = function(){};
var events = ['change', 'sync'];
Gpub.delegable(Model.prototype, events);
var user = new Model();
user.onsync(function(e){console.log('sync\'d', e)});
user.onchange(function(e){console.log('changed', e)});
user.emit('change').emit('sync');
```

By default, methods generated will be in the form
of **on**+**event**.
We can pass in a custom method name generator.

If the passed in `src` object is not an instance
of `Gpub` it will be augmented with the mixin.

**Parameters:**

- `{Object} src` Object to extend

with methods.

- `{Array | String} events` Events for which we want to

generate delegate methods.

- `{Function} eventBuilder` Function to generate the delegate

method name.

- `{String} glue` If we pass in a string, this

will be used to split into different
event types.

**Return:**

`{Object}` Returns passed in object.

<sub>Go: [TOC](#tableofcontents) | [Gpub](#toc_gpub)</sub>

# Gpub.bindable(src, set, get, bind)

> It will monkey patch the given `src` setter
method so that it triggers a `change` and `change:<key>` 
event on update. The event object carries the old value
and the current value, plus the updated property name.

It's a quick way to generate a bindable model.

```javascript
```js
var Model = function(){this.data={}};
Model.prototype.set = function(key, value) {
    this.data[key] = value;
    return this;
};
Model.prototype.get = function(key, def){
    return this.data[key] || def;
};
Gpub.bindable(Model.prototype, 'set', 'get');
```

```    
If we don't specify a `set` or `get` value, then
`set` and `get` will be used by default.

**Parameters:**

- `{Object} src` Object to be augmented.
- `{String} set` Name of `set` method in `src`
- `{String} get` Name of `get` method in `src`
- `{Boolean} bind` Should we bind the generated method?

**Return:**

`{Object}` Returns the passed in object.

<sub>Go: [TOC](#tableofcontents) | [Gpub](#toc_gpub)</sub>

# Gpub.prototype.publish()

> @deprecated

<sub>Go: [TOC](#tableofcontents) | [Gpub.prototype](#toc_gpubprototype)</sub>

# Gpub.prototype.subscribe()

> @deprecated

<sub>Go: [TOC](#tableofcontents) | [Gpub.prototype](#toc_gpubprototype)</sub>

# Gpub.prototype.unsubscribe()

> @deprecated

<sub>Go: [TOC](#tableofcontents) | [Gpub.prototype](#toc_gpubprototype)</sub>

# Gpub.prototype.subscribers()

> @deprecated

<sub>Go: [TOC](#tableofcontents) | [Gpub.prototype](#toc_gpubprototype)</sub>

_&mdash;generated by [apidox](https://github.com/codeactual/apidox)&mdash;_
