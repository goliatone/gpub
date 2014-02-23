/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'gpub': 'gpub'
    }
});

define(['gpub'], function (Gpub) {
    console.log('Loading ');
	var gpub = new Gpub();
	window.Gpub = Gpub;

	var User = function(){};
	Gpub.observable(User);
	var pepe = new User();
	pepe.on('change', function(){
		console.log('We are here');
	});

	pepe.emit('change');
});