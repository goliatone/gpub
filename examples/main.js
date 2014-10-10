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

	var events = 'change update sync';
	Gpub.delegable(User.prototype, events);

	var pepe = new User('pepe');

	pepe.on('change', function(event){
		console.log('The property',
					event.property,
					'changed from',
					event.old,
					'to', event.value,
					'event topic', event.event.topic,
					'target is', event.target.get('name'));
	});

	pepe.on('change:name', function(event){
		console.log('Key event, change:name', event.value);
	});

	pepe.multi('change change:name change:age change:email', function(e){
		console.log('Changed any:', e.event.topic)
	});

	var pipo = new User('pipo');

	pipo.on('change', function(event){
		console.log('Hello, Im', this.get('name'));
		console.log(event);
	});




	pepe.set('name', 'Pepe')
		.set('age', 23)
		.set('email', 'peperone@dot.com');

	window.Gpub = Gpub;
	window.User = User;
	window.pepe = pepe;
	window.pipo = pipo;

});