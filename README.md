# Gpub

[![Build Status](https://secure.travis-ci.org/goliatone/gpub.png)](http://travis-ci.org/goliatone/gpub)

Tiny PubSub module.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/goliatone/gpub/master/dist/gpub.min.js
[max]: https://raw.github.com/goliatone/gpub/master/dist/gpub.js


## Documentation

To generate documentation, run:

`jsdox --output docs src/`


Gpub: Simple pub/sub
====================
*(c) 2013 goliatone*

**Author:** goliatone

**Overview:** Gpub is an Event Dispatcher library. Or pub/sub.

Gpub.on(topic, callback, scope, options)
----------------------------------------
Register an event listener.
the handler.
event to all handler callbacks.


**Parameters**

**topic**:  *String*,  String indicating the event type

**callback**:  *Function*,  Callback to handle event topics.

**scope**:  *Object*,  We can dynamically change the scope of

**options**:  *Object*,  Options object that will be sent with the

Gpub.emits(topic)
-----------------
Checks to see if the provided topic has
registered listeners and thus triggering
and event.


**Parameters**

**topic**:  *String*,  Event type.

Gpub.emit(topic, options)
-------------------------
Triggers an event so all registered listeners
for the `topic` will be notified.
Optionally, we can send along an options object.

in the event to all listeners
registered with `topic`.


**Parameters**

**topic**:  *String*,  Event type.

**options**:  *Object*,  Options object, sent along

Gpub.off(topic, callback)
-------------------------
Unregisters the given `callback` from `topic`
events.
If called without arguments, it will remove all
listeners.
TODO: If we pass `topic` but no `callback` should we
remove all listeners of `topic`?



**Parameters**

**topic**:  *String*,  Event type.

**callback**:  *Function*,  Listener we want to remove.

Gpub.callbacks(topic)
---------------------
Returns all registered listeners for
a given `topic`.
If called without `topic` will return all
callbacks.

Used internally.



**Parameters**

**topic**:  *String*,  Event type.

Gpub.observable(target)
-----------------------
Observable mixin. It will add `Gpub` methods
to the given `target`.
If we provide a `constructor` it will extend
it's prototype.

```javascript
var Model = function(){};
Gpub.observable(Model);
var user = new Model();
user.on('something', function(){console.log('Hola!')});
user.emit('something');
```



**Parameters**

**target**:  *Object|Function*,  


**Returns**

*Object|Function*,  Returns the given object.

Gpub.delegable(src, events, eventBuilder, glue)
-----------------------------------------------
It will create methods in `src` to register
handlers for all passed events.

If we pass:
var Model = function(){};
var events = ['change', 'sync'];
Gpub.delegable(Model.prototype, events);
var user = new Model();
user.onsync(function(e){console.log('sync\'d', e)});
user.onchange(function(e){console.log('changed', e)});
user.emit('change').emit('sync');

By default, methods generated will be in the form
of **on**+**event**.
We can pass in a custom method name generator.

If the passed in `src` object is not an instance
of `Gpub` it will be augmented with the mixin.

with methods.
generate delegate methods.
method name.
will be used to split into different
event types.


**Parameters**

**src**:  *Object*,  Object to extend

**events**:  *Array|String*,  Events for which we want to

**eventBuilder**:  *Function*,  Function to generate the delegate

**glue**:  *String*,  If we pass in a string, this

**Returns**

*Object*,  Returns passed in object.

Gpub.bindable(src, set, get, bind)
----------------------------------
It will monkey patch the given `src` setter
method so that it triggers a `change` and `change:<key>`
event on update. The event object carries the old value
and the current value, plus the updated property name.

It's a quick way to generate a bindable model.

```javascript
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
If we don't specify a `set` or `get` value, then
`set` and `get` will be used by default.



**Parameters**

**src**:  *Object*,  Object to be augmented.

**set**:  *String*,  Name of `set` method in `src`

**get**:  *String*,  Name of `get` method in `src`

**bind**:  *Boolean*,  Should we bind the generated method?

**Returns**

*Object*,  Returns the passed in object.

## Examples
You can check out the contents of the examples folder.

## Release History

* `v0.3.0`: Added mixin.
* `v0.2.0`: Update API.
* `v0.1.0`: Initial release.
