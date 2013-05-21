/*
 * gpub
 * https://github.com/goliatone/gpub
 *
 * Copyright (c) 2013 goliatone
 * Licensed under the MIT license.
 */
/*global define:true*/
/* jshint strict: false */
define('gpub', ['jquery'], function($) {

    var Gpub = function(config){
        console.log('Gpub: Constructor!');
    };

    Gpub.prototype.init = function(){
        console.log('Gpub: Init!');
        return 'This is just a stub!';
    };

    return Gpub;
});