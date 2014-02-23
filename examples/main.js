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



	var User = function(name){
		this.data = {};
		this.data['name'] = name;
	};
	User.prototype.set = function(key, value){ this.data[key] = value; return this;};
    User.prototype.get = function(key, def){ return this.data[key] || def; };
            
	Gpub.observable(User);
	Gpub.bindable(User.prototype, 'set', 'get');

	var pepe = new User('pepe');

	pepe.on('change', function(event){
		console.log('Hello, Im', this.get('name'));
		console.log(event);
	});

	pepe.on('change:name', function(event){
		console.log('I have a new name', event.value);
	});

	var pipo = new User('pipo');

	pipo.on('change', function(event){
		console.log('Hello, Im', this.get('name'));
		console.log(event);
	});

	pepe.emit('change');


	window.Gpub = Gpub;
	window.User = User;
	window.pepe = pepe;
	window.pipo = pipo;

});