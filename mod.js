ig.module(
    "mods.tc.controller-ext"
).requires(
    "impact.feature.gamepad.gamepad",
    "game.feature.control.control"
).defines(function() {
    // keep track of the last two elements used
    var elementHistory = [sc.ELEMENT.NEUTRAL];

    // RETURNS:
    // - false: no change
    // - [0-4]: new element; 0 = neutral
    sc.Control.inject({
        elementModeSwitch: function() {
            // copy/paste of base implementation
            const newElement = (
                this.autoControl ? (
                    this.autoControl.get("heatMode") ? sc.ELEMENT.HEAT :
                    this.autoControl.get("coldMode") ? sc.ELEMENT.COLD :
                    this.autoControl.get("shockMode") ? sc.ELEMENT.SHOCK :
                    this.autoControl.get("waveMode") ? sc.ELEMENT.WAVE :
                    false
                ) : (
                    // CHANGED - Add RIGHT_STICK check for neutral
                    ig.input.pressed("neutral") || ig.gamepad.isButtonPressed(ig.BUTTONS.RIGHT_STICK) ? sc.ELEMENT.NEUTRAL :
                    ig.input.pressed("heat") || ig.gamepad.isButtonPressed(ig.BUTTONS.DPAD_DOWN) ? sc.ELEMENT.HEAT :
                    ig.input.pressed("cold") || ig.gamepad.isButtonPressed(ig.BUTTONS.DPAD_UP) ? sc.ELEMENT.COLD :
                    ig.input.pressed("shock") || ig.gamepad.isButtonPressed(ig.BUTTONS.DPAD_RIGHT) ? sc.ELEMENT.SHOCK :
                    ig.input.pressed("wave") || ig.gamepad.isButtonPressed(ig.BUTTONS.DPAD_LEFT) ? sc.ELEMENT.WAVE :
                    // CHANGED - Add LEFT_STICK for going to the previous element
                    ig.gamepad.isButtonPressed(ig.BUTTONS.LEFT_STICK) && elementHistory.length == 2 ? elementHistory[0] :
                    false
                )
            )

            const lastElement = elementHistory[elementHistory.length - 1]

            // track the element if it was changed
            const changedElement = (newElement !== false)
            if (changedElement && newElement != lastElement) {
                elementHistory.push(newElement)
                if (elementHistory.length > 2) elementHistory.splice(0, 1)
            }

            return newElement
        }
    })
})

