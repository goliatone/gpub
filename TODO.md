## TODO

## Event object
Refactor payloads. Right now we pass an object with an "event" property, this is redundant.

## Remove "scope" argument from API signature

Currently we have:
```javascript
Gpub.prototype.on = function(topic, callback, scope, options)
```

Should be:
```javascript
Gpub.prototype.on = function(topic, callback, options)
```
`options` should have a `scope` property which should be set to `this` by default.

### Mixin
~Provide a mixin. How do we enable passing in an object and extending it to have capabilities?~

### Factory method
~Extend the passed in element and apply mixin~

### Utils:
~Make observable~
- ~get/set~