var MediumEditorToolbarStates = MediumEditor.Extension.extend({
    name: 'toolbar_states',

    init: function () {
        this.subscribe('positionToolbar', this.handlePositionToolbar.bind(this));
        this.hideClass = this.hideClass || 'hide';
    },

    destroy: function () {

    },

    handlePositionToolbar: function (data, editor) {
        var selection = this.window.getSelection(),
            state;
        if (this.stateSelector && typeof this.stateSelector === 'function') {
            var stateName = this.stateSelector(editor);
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
            that = this;

        toolbar.forEachExtension(function (extension) {
            if (typeof extension.getButton === 'function') {
                if (state.buttons.indexOf(extension.name) != -1) {
                    extension.getButton().classList.remove(that.hideClass);
                } else {
                    extension.getButton().classList.add(that.hideClass);
                }
            }
        });
    }

});
