/**
 * jQuery Plugin disableSelection
 * Disable selection of text content within the set of matched elements.
 *
 * @return {Object} jQuery
 * @chainable
 */
define(['jquery'], function() {
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
})(window.jQuery, window, document);

});
