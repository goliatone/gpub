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

	

	var User = function(name){this.name = name;};
	Gpub.observable(User);
	
	var pepe = new User('pepe');

	pepe.on('change', function(){
		console.log('Hello, Im', this.name);
	});

	var pipo = new User('pipo');

	pipo.on('change', function(){
		console.log('Hello, Im', this.name);
	});

	pepe.emit('change');


	window.Gpub = Gpub;
	window.User = User;
	window.pepe = pepe;
	window.pipo = pipo;

});