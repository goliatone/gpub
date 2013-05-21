/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': '../lib/jquery/jquery',
        'gpub': '../src/gpub'
    }
});

define(['gpub', 'jquery'], function (Gpub, $) {
    console.log('Loading');
	var gpub = new Gpub();
	gpub.init();
});