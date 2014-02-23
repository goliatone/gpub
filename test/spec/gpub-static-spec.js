/*global define:true*/
/*global describe:true */
/*global it:true */
/*global expect:true */
/*global beforeEach:true */
/*global sinon:true */
/* jshint strict: false */
define(['gpub'], function(Gpub) {

    describe('just checking', function() {

        it('Gpub should be loaded', function() {
            expect(Gpub).toBeTruthy();
            var gpub = new Gpub();
            expect(gpub).toBeTruthy();
        });
    });
    var item;
    beforeEach(function(){
        item = new Gpub();
    });

    describe('gpub', function(){
//////////////////////////////////////////////////////
/// STATIC METHODS
//////////////////////////////////////////////////////
        it('mixin should extend a target object with Gpub methods',function(){
            var target = {};
            Gpub.observable(target);
            var methods = Object.keys(Gpub.prototype);
            expect(target).toHaveMethods(methods);
        });

        it('mixin objects should get notified of publisehd topics',function(){
            var spy = sinon.spy();
            var options = {options:true};
            console.log('PROTOTPYE: ', Gpub);
            var Target = function(){};
            // var target = new Target();
            var target = {};
            Gpub.observable(target);

            target.on('topic', spy);
            target.emit('topic', options);
            expect(spy).toHaveBeenCalledWith(options);
            expect(spy).not.toHaveBeenCalledWith({});
        });

        it('should make a passed object bindable', function(){
            /*var M = function(){this.data={}};
            M.prototype.set = function(key, value){ this.data[key] = value; return this;};
            M.prototype.get = function(key,def){ return this.data[key] || def; };

            M.prototype = new Gpub();
            Gpub.bindable(M.prototype, 'set', 'get');
            var model = new M();

            model.set('test', 23).on('change', function(e, p){
                console.log('change: old %s new %s', p.old, p.value);
            }).on('change:test', function(e, p){
                console.log('change.test: old %s new %s', p.old, p.value);
            }).set('test',44);
            */
        });



    });
});