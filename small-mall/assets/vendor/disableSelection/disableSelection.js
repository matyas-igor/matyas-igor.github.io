/**
 * jQuery Plugin disableSelection
 * Disable selection of text content within the set of matched elements.
 *
 * @return {Object} jQuery
 * @chainable
 */
(function ($, window, document, undefined){

    $.fn.disableSelection = function () {

        return this.bind( ($.support.selectstart ? 'selectstart' : 'mousedown') + '.disableSelection',
            function (event) {

                event.preventDefault();
            });
    };

    $.fn.enableSelection = function () {

        return this.unbind('.disableSelection');
    };
})(jQuery);/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Aug/14/13
 * Time: 5:07 AM
 * To change this template use File | Settings | File Templates.
 */
