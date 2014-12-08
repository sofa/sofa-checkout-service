'use strict';
/* global sofa, document */

sofa.define('sofa.checkout.FlowRouter', function () {

    var self = {},
        flows = [];

    // { flow: flow, predicate: function(checkoutModel) { return true } }
    self.addFlow = function (flow) {
        flows.push(flow);
    };

    self.addFlows = function (flows) {
        //TODO: implement in a way that keeps the original instance
        flows = flows;
    };

    self.matchFlow = function (checkoutModel) {
        var flowRoute = sofa.Util.find(flows, function(flowRoute) {
           return flowRoute.predicate(checkoutModel); 
        });

        return flowRoute.flow;
    };

    return self;
});
