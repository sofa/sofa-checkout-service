'use strict';
/* global sofa */
/**
 * @sofadoc class
 * @name sofa.Util.FormatUtils
 * @namespace sofa.Util
 * @package sofa-checkout-service
 * @distFile dist/sofa.checkoutService.js
 * @static
 *
 *
 * @description
 * The `sofa.utils.FormatUtils` provides methods to convert various kinds of data into
 * other formats used throughout the API and backend.
 */
sofa.define('sofa.utils.FormatUtils', {
    /**
     * @sofadoc method
     * @name sofa.Util.FormatUtils#zeroFill
     * @memberof sofa.Utils.FormatUtils
     *
     * @description
     * Turns any number into a string with a specified amount of leading zeros.
     *
     * @example
     * zeroFill(64, 4)
     * => "0064"
     *
     * @return {string} Number with leading zeros
     */
    zeroFill: function (number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + '';
    }
});
