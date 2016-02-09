var MediumEditorToolbarStates = MediumEditor.Extension.extend({
    name: 'toolbar_states',

    init: function () {
        this.subscribe('positionToolbar', this.handlePositionToolbar.bind(this));
        this.hideClass = this.hideClass || 'hide';
    },

    destroy: function () {

    },

    handlePositionToolbar: function (data, editor) {
        var state;
        if (this.getStateName && typeof this.getStateName === 'function') {
            var stateName = this.getStateName(editor);
            state = this.states[stateName];
        } else if (this.getState && typeof this.getState === 'function') {
            state = this.getState(editor);
        }
        if (state) {
            this.updateToolbarState(state);
        }
    },

    updateToolbarState: function (state) {
        var toolbar = this.base.getExtensionByName('toolbar'),
            that = this,
            firstButton, lastButton;

        toolbar.forEachExtension(function (extension) {
            var button;
            if (typeof extension.getButton === 'function') {
                if (state.buttons.indexOf(extension.name) != -1) {
                    button = extension.getButton();
                    button.classList.remove(that.hideClass);
                    firstButton = firstButton || button;
                    lastButton = button;
                } else {
                    button = extension.getButton();
                    button.classList.add(that.hideClass);
                }
                button.classList.remove(toolbar.firstButtonClass);
                button.classList.remove(toolbar.lastButtonClass);
            }
        });

        if (firstButton && lastButton) {
            firstButton.classList.add(toolbar.firstButtonClass);
            lastButton.classList.add(toolbar.lastButtonClass);
        }
    }

});
