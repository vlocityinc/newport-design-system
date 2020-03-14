({
    KEY_COMBO_BUFFER_MAX_SIZE: 2,
    keyComboBuffer: [],
    lastKeyTime: 0,
    handleKeydown: function(component, event) {
        var currentTime = Date.now();
        this.lastKeyTime = this.lastKeyTime ? this.lastKeyTime : currentTime;
        if (currentTime - this.lastKeyTime > Number.MAX_SAFE_INTEGER) {
            this.keyComboBuffer = [];
            return;
        }
        this.lastKeyTime = currentTime;
        this.keyComboBuffer.push(event.key);
        if (this.keyComboBuffer.length > this.KEY_COMBO_BUFFER_MAX_SIZE) {
            this.keyComboBuffer.shift();
        }
        if (this.keyComboBuffer.length === 2 && this.keyComboBuffer[0] === 'g' && this.keyComboBuffer[1] === 'd') {
            var editor = document.querySelector('builder_platform_interaction-editor');
            editor.handleFocusOnToolbox();
        }
    }
});
