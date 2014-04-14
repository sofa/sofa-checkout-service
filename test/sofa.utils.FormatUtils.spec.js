'use strict';

describe('sofa.utils', function () {

    describe('sofa.utils.FormatUtils', function () {

        var formatUtils;

        beforeEach(function () {
            formatUtils = sofa.utils.FormatUtils;
        });

        describe('sofa.utils.FormatUtils#zeroFill', function () {

            it('should be a function', function () {
                expect(typeof formatUtils.zeroFill).toBe('function');
            });

            it('should return a string', function () {
                expect(typeof formatUtils.zeroFill(64, 4)).toBe('string');
            });

            it('should fill a number with zeros', function () {
                expect(formatUtils.zeroFill(64, 4)).toEqual('0064');
            });
        });

    });
});
