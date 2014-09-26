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
    },
    toBackendAddress: function (sofaAddress) {
        // we currently work around non-null strictness by setting empty strings.
        // Should be fixed soon.
        return sofaAddress && {
            company: sofaAddress.company || '',
            salutation: sofaAddress.salutation || '',
            firstName: sofaAddress.name || '',
            lastName: sofaAddress.surname || '',
            street: sofaAddress.street || '',
            streetNumber: sofaAddress.streetnumber || '',
            streetAdditional: sofaAddress.streetextra || '',
            city: sofaAddress.city || '',
            zipCode: sofaAddress.zip || '',
            country: sofaAddress.country && sofaAddress.country.value,
            email: sofaAddress.email || '',
            phone: sofaAddress.telephone || '',
            vatId: 0
        };
    },
    toSofaAddress: function (backendAddress) {
        return backendAddress && {
            company: backendAddress.company,
            salutation: backendAddress.salutation,
            name: backendAddress.firstName,
            surname: backendAddress.lastName,
            street: backendAddress.street,
            streetnumber: backendAddress.streetNumber,
            streetextra: backendAddress.streetAdditional,
            city: backendAddress.city,
            zip: backendAddress.zipCode,
            country: {
                value: backendAddress.country
            },
            email: backendAddress.email,
            telephone: backendAddress.phone
        };
    },
    toSofaPaymentMethods: function (paymentMethods) {
        return paymentMethods.map(function (method) {
            method.surcharge = method.surcharge / 100;
            return method;
        });
    },
    toSofaShippingMethods: function (shippingMethods) {
        return shippingMethods.map(function (method) {
            method.price = method.price / 100;
            method.taxAmount = method.taxAmount / 100;
            return method;
        });
    },
    toSofaQuoteOrOrder: function (quoteOrOrder) {
        quoteOrOrder.shippingAddress = sofa.utils.FormatUtils.toSofaAddress(quoteOrOrder.shippingAddress);
        quoteOrOrder.billingAddress = sofa.utils.FormatUtils.toSofaAddress(quoteOrOrder.billingAddress);

        if (quoteOrOrder.allowedPaymentMethods) {
            quoteOrOrder._allowedPaymentMethods = quoteOrOrder.allowedPaymentMethods;
            quoteOrOrder.allowedPaymentMethods = sofa.utils.FormatUtils.toSofaPaymentMethods(quoteOrOrder.allowedPaymentMethods);
        }

        if (quoteOrOrder.allowedShippingMethods) {
            quoteOrOrder._allowedShippingMethods = quoteOrOrder.allowedShippingMethods;
            quoteOrOrder.allowedShippingMethods = sofa.utils.FormatUtils.toSofaShippingMethods(quoteOrOrder.allowedShippingMethods);
        }

        var totals = quoteOrOrder.totals;
        quoteOrOrder._totals = totals;

        // FIXME: Temporally map the items
        quoteOrOrder._items = quoteOrOrder.items;
        quoteOrOrder.items = quoteOrOrder.items.map(function (item) {
            item.price = item.price / 100;
            item.subtotal = item.rowTotal / 100;
            item.qty = item.quantity;
            return item;
        });

        //FIXME: We just map to the old totals structure for now
        quoteOrOrder.totals = {
            total: totals.grandTotal / 100,
            sum: totals.subTotal / 100,
            shipping: totals.shippingAmount / 100,
            // FIXME
            vat: totals.taxTotals[0].taxAmount / 100
        };
        return quoteOrOrder;
    }
});
