'use strict';
/* global sofa */


describe('sofa.checkout.FlowRouter', function () {

    var flowRouter;

    beforeEach(function () {
        flowRouter = new sofa.checkout.FlowRouter();
    });

    it('should be defined', function () {
        expect(flowRouter).toBeDefined();
    });

    describe('Flow Router', function () {

        it('should match flow against checkoutModel', function () {
            var flow = new sofa.checkout.flows.Braintree();

            flowRouter.addFlow({
                flow: flow,
                predicate: function () { return true; }
            });

            var matchedFlow = flowRouter.matchFlow();

            expect(matchedFlow).toBe(flow);
        });
    });
});
