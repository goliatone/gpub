/*global define:true*/
/*global describe:true */
/*global it:true */
/*global expect:true */
/*global beforeEach:true */
/* jshint strict: false */
define(['gpub', 'jquery'], function(Gpub, $) {

    describe('just checking', function() {

        it('Gpub should be loaded', function() {
            expect(Gpub).toBeTruthy();
            var gpub = new Gpub();
            expect(gpub).toBeTruthy();
        });

        it('Gpub should have methods', function() {
           
        });
    });
});