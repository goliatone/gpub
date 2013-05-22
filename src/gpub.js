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

    var options = {
        methodMapping:{
            publish:'publish',
            subscribe:'subscribe',
            unsubscribe:'unsubscribe'
        }
    };

    var Gpub = function(config){

    };


    Gpub.prototype.simple = function($, src, map){
        var o = $({});
        src = src || {};
        map = map || options.methodMapping;
        src[map['publish']] = function() { o.trigger.apply(o, arguments);};
        src[map['subscribe']] = function() { o.on.apply(o, arguments);};
        src[map['unsubscribe']] = function() { o.off.apply(o, arguments);};
    };

    return Gpub;
});