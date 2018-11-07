({
    onInit : function(cmp, event, helper) {
        helper.init(cmp);

        // hide the loading box
        var loadingBoxes = document.querySelectorAll('.flow-builder-loading-box');
        loadingBoxes.forEach(function(el) {
            el.style.display = 'none';
        });
    },

    createWelcomeMat : function(cmp, event, helper) {
        helper.createWelcomeMat();
    }
})
