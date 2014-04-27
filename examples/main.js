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
		window.gevent = event;
		console.debug(event);
		console.log('The property',
					event.property,
					'changed from',
					event.old,
					'to', event.value,
					'event topic', event.topic,
					'target is', event.target.get('name'));
	});

	pepe.on('change:name', function(event){
		console.log('Key event, change:name', event.value);
	});

	var pipo = new User('pipo');

	pipo.on('change', function(event){
		console.log('Hello, Im', this.get('name'));
		console.log(event);
	});

	pepe.set('name', 'Pepe')
		.set('age', 23)
		.set('email', 'peperone@gmail.com')
		.set('email', 'peperone@dot.com');


	pepe.on('update', function(e){
		e.unregister();
		console.log('We got an update event', e);
	});

	pepe.emit('update', {property:'something', value:23});
	pepe.emit('update', {property:'not-fired', value:0});

/************************************************
 * We can stop propagation of an event by returning
 * false.
 * Also, the event is mutable and subsequent handlers
 * will get the modified object.
*************************************************/
	pepe.on('filter', function(e){
		if(e.value === 'old'){
			console.log('Filtering value', e.value);
			return false;
		}
		//If we change value, the other event handlers
		//will get the modified object, since we are not
		//cloning.
		//e.value = 'something';
		console.log('We do not filter');
	});

	pepe.on('filter', function(e){
		if(e.value === 'new'){
			console.log('Filtering value', e.value, e);
			return false;
		}
		console.warn('We should have filtered, if we see this, event changed');
	}, pepe, {constant: 'this value is always here'});

	pepe.on('filter', function(e){
		console.error('WE SHOULD NOT REACH THIS HANDLER');
	});

	pepe.emit('filter', {value:'new'});

/************************************************
 * We can add "once" handlers
************************************************/
	pepe.once('once.event', function(e){
		console.log('This event  handler should execute once', e);
	});
	pepe.emit('once.event').emit('once.event').emit('once.event');

/************************************************
 * We can debounce handlers
************************************************/
	var count = 0, start = new Date();
	pepe.debounce('debouncing', function(e){
		console.log('on debouncing', ++count, (new Date() - start));
	}, 1000, pepe, {ops:23});

	function interval(func, wait, times, now){
	    var interv = (function(w, t){
	        return function(){
	            if(typeof t === 'undefined' || t-- > 0){
	                setTimeout(interv, w);
	                try{
	                    func.call(null);
	                }
	                catch(e){
	                    t = 0;
	                    throw e.toString();
	                }
	            }
	        };
	    })(wait, times);

	    if(now === true) interv();
	    else setTimeout(interv, wait);
	}

	// interval(function(){
	// 	console.log('Interval');
	// 	pepe.emit('debouncing');
	// }, 20, 1200, true);

	window.Gpub = Gpub;
	window.User = User;
	window.pepe = pepe;
	window.pipo = pipo;

});