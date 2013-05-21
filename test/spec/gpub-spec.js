/*global define:true*/
/*global describe:true */
/*global it:true */
/*global expect:true */
/*global beforeEach:true */
/* jshint strict: false */
define(['gpub', 'jquery'], function(Gpub, $) {

    describe('just checking', function() {

        it('Gpub shold be loaded', function() {
            expect(Gpub).toBeTruthy();
            var gpub = new Gpub();
            expect(gpub).toBeTruthy();
        });

        it('Gpub shold initialize', function() {
            var gpub = new Gpub();
            var output   = gpub.init();
            var expected = 'This is just a stub!';
            expect(output).toEqual(expected);
        });
        
    });

});