/* eslint-disable */

/**
 * This is unit testing class using the Javascript testing framework
 * Chapter 6 for aura testing: https://mohan-chinnappan-n.github.io/books/lx/docs/aura_oss.pdf
 *
 * How to run the (in web browser- you may be prompted to login)
 * - Test suite: localhost:6109/builder_platform_interaction/recordDetails.cmp?aura.mode=jstest
 * - Single test: localhost:6109/builder_platform_interaction/recordDetails.cmp?aura.mode=jstest&test=testName
 */
({
    mocks: [],

    browsers: ['GOOGLECHROME', 'FIREFOX', 'SAFARI'],

    /** Test Cases **/

    testEditingFormRenderShouldRender: {
        attributes: {
            showDetails: 'true'
        },
        test: function (cmp) {
            $A.test.assertNotNull(
                cmp.find('recordEditForm'),
                'Record edit form does not show up when showDetails is true'
            );
        }
    },
    testEditingFormRenderShouldNotRender: {
        attributes: {
            showDetails: 'false'
        },
        test: function (cmp) {
            cmp.set('v.showDetails', 'false');
            $A.test.assertUndefinedOrNull(
                cmp.find('recordEditForm'),
                'Should not show edit form when showDetails is false'
            );
        }
    }
});
