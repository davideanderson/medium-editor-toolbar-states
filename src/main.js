var MediumEditorToolbarStates = MediumEditor.Extension.extend({
    name: 'toolbar_states',

    attributeName: 'data-toolbar-state',
    hideClass: 'hide',
    states: {},
    hasNodeNames: false,

    init: function () {
        var that = this;

        MediumEditor.Extension.prototype.init.apply(this, arguments);

        // For improved performance, check to see if any states actually have defined nodeNames arrays, so we only
        // look for them if any actually exist
        Object.keys(this.states).forEach(function (stateName) {
            var state = that.states[stateName];
            if (state.nodeNames) {
                that.hasNodeNames = true;
            }
        });

        this.subscribe('positionToolbar', this.handlePositionToolbar.bind(this));
    },

    destroy: function () {

    },

    selectedStateName: 'default',
    pendingStateName: null,

    checkState: function (node) {
        if (!this.pendingStateName) {
            if (this.getStateNameForNode && typeof this.getStateNameForNode === 'function') {
                this.pendingStateName = this.getStateNameForNode(node) || null;
            } else if (this.hasNodeNames) {
                this.pendingStateName = this.getStateNameFromNodeNames(node) || null;
            } else if (node.hasAttribute(this.attributeName)) {
                this.pendingStateName = node.getAttribute(this.attributeName) || null;
            }
        }
        if (MediumEditor.util.isMediumEditorElement(node)) {
            this.selectedStateName = this.pendingStateName || 'default';
            this.pendingStateName = null;
        }
    },

    getStateNameFromNodeNames: function (node) {
        var that = this,
            returnValue;
        Object.keys(this.states).forEach(function (stateName) {
            var state = that.states[stateName];
            if (state.nodeNames && state.nodeNames.indexOf(node.nodeName) >= 0) {
                returnValue = stateName;
            }
        });
        return returnValue;
    },

    handlePositionToolbar: function (data, editor) {
        var state = { buttons: this.base.getExtensionByName('toolbar').buttons };
        if (this.getState && typeof this.getState === 'function') {
            state = this.getState(editor) || state;
        } else {
            state = this.states[this.selectedStateName] || state;
        }
        this.updateToolbarState(state);
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
