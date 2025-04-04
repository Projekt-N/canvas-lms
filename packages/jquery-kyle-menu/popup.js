/*
 * jQuery UI Popup @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Popup
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
// INSTRUCTURE modified
import $ from 'jquery'
import 'jqueryui/position'

let idIncrement = 0,
  suppressExpandOnFocus = false

$.widget('ui.popup', {
  version: '@VERSION',
  options: {
    position: {
      my: 'left top',
      at: 'left bottom',
    },
    managed: false,
    expandOnFocus: false,
    show: {
      effect: 'slideDown',
      // duration: "fast"
      duration: 0,
    },
    hide: {
      effect: 'fadeOut',
      // duration: "fast"
      duration: 0,
    },
  },
  _create() {
    if (!this.options.trigger) {
      this.options.trigger = this.element.prev()
    }

    if (!this.element.attr('id')) {
      this.element.attr('id', 'ui-popup-' + idIncrement++)
      this.generatedId = true
    }

    if (!this.element.attr('role')) {
      if (!this.options.managed) {
        this.element.attr('role', 'dialog')
        this.generatedRole = true
      }
    }

    this.options.trigger.attr('aria-haspopup', 'true')

    this.element.addClass('ui-popup')
    this._beforeClose()
    this.element.hide()

    // INSTRUCTURE moved from switch below for use in click handler
    const onMouseDown = function (event) {
      let noFocus = false
      /* TODO: Determine in which cases focus should stay on the trigger after the popup opens
			(should apply for any trigger that has other interaction besides opening the popup, e.g. a text field) */
      if ($(event.target).is('input')) {
        noFocus = true
      }
      if (this.isOpen) {
        suppressExpandOnFocus = true
        this.close()
        return
      }
      this.open(event)
      clearTimeout(this.closeTimer)
      this._delay(function () {
        if (!noFocus) {
          this.focusPopup()
        }
      }, 1)
    }
    this._on(this.options.trigger, {
      keydown(event) {
        switch (event.keyCode) {
          case $.ui.keyCode.TAB:
            // Waiting for close() will make popup hide too late, which breaks tab key behavior
            this.element.hide()
            this.close(event)
            break
          case $.ui.keyCode.ESCAPE:
            if (this.isOpen) {
              this.close(event)
            }
            break
          // INSTRUCTURE changed SPACE to use DOWN/UP handler
          case $.ui.keyCode.SPACE:
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.UP:
            // prevent scrolling
            event.preventDefault()
            clearTimeout(this.closeTimer)
            this._delay(function () {
              this.open(event)
              this.focusPopup(event) // NOTE: This is a test of a change
            }, 1)
            break
        }
      },
      // INSTRUCTURE added
      mouseup(event) {
        this.mouseClickTimer = window.setTimeout(
          function () {
            delete this.mouseClickTimer
          }.bind(this),
          0
        )
      },
      click(event) {
        event.stopPropagation()
        event.preventDefault()
        // INSTRUCTURE added handler for keyboard-triggered clicks
        if (!this.mouseClickTimer) {
          onMouseDown.call(this, event)
        }
      },
      mousedown: onMouseDown,
    })

    if (this.options.expandOnFocus) {
      this._on(this.options.trigger, {
        focus(event) {
          if (!suppressExpandOnFocus) {
            this._delay(function () {
              if (!this.isOpen) {
                this.open(event)
              }
            }, 1)
          }
          this._delay(function () {
            suppressExpandOnFocus = false
          }, 100)
        },
        blur(event) {
          suppressExpandOnFocus = false
        },
      })
    }
    if (!this.options.managed) {
      // default use case, wrap tab order in popup
      this._on({
        keydown(event) {
          if (event.keyCode !== $.ui.keyCode.TAB) {
            return
          }
          const tabbables = $(':tabbable', this.element),
            first = tabbables.first(),
            last = tabbables.last()
          if (event.target === last[0] && !event.shiftKey) {
            first.focus(1)
            event.preventDefault()
          } else if (event.target === first[0] && event.shiftKey) {
            last.focus(1)
            event.preventDefault()
          }
        },
      })
    }

    this._on({
      focusout(event) {
        // use a timer to allow click to clear it and letting that
        // handle the closing instead of opening again
        this.closeTimer = this._delay(function () {
          this.close(event)
        }, 150)
      },
      focusin(event) {
        clearTimeout(this.closeTimer)
      },
      mouseup(event) {
        clearTimeout(this.closeTimer)
        // use a timer to prevent closing the popup immediately when it has larger height than window
        // mouseUpTimer is used in the onclick event listener to prevent closing the popup if set
        this.mouseUpTimer = window.setTimeout(
          function () {
            delete this.mouseUpTimer
          }.bind(this),
          0
        )
      },
    })

    this._on({
      keyup(event) {
        if (event.keyCode === $.ui.keyCode.ESCAPE && this.element.is(':visible')) {
          this.close(event)
          this.focusTrigger()
        }
      },
    })

    this._on(this.document, {
      click(event) {
        if (
          this.isOpen &&
          !$(event.target).closest(this.element.add(this.options.trigger)).length &&
          !this.mouseUpTimer
        ) {
          this.close(event)
        }
      },
    })
  },

  _destroy() {
    this.element
      .show()
      .removeClass('ui-popup')
      .removeAttr('aria-hidden')
      .removeAttr('aria-expanded')
      .unbind('keypress.ui-popup')

    this.options.trigger.removeAttr('aria-haspopup')

    if (this.generatedId) {
      this.element.removeAttr('id')
    }
    if (this.generatedRole) {
      this.element.removeAttr('role')
    }
  },

  open(event) {
    const position = $.extend(
      {},
      {
        of: this.options.trigger,
      },
      this.options.position
    )

    this._show(this.element, this.options.show)
    this.element.attr('aria-hidden', 'false').attr('aria-expanded', 'true').position(position)

    // take trigger out of tab order to allow shift-tab to skip trigger
    this.options.trigger.attr('tabindex', -1)
    this.isOpen = true
    this._trigger('open', event)
  },

  focusPopup(event) {
    if (!this.options.managed) {
      // set focus to the first tabbable element in the popup container
      // if there are no tabbable elements, set focus on the popup itself
      let tabbables = this.element.find(':tabbable')
      this.removeTabIndex = false
      if (!tabbables.length) {
        if (!this.element.is(':tabbable')) {
          this.element.attr('tabindex', '0')
          this.removeTabIndex = true
        }
        tabbables = tabbables.add(this.element[0])
      }
      tabbables.first().focus(1)
    }
    this._trigger('focusPopup', event)
  },

  focusTrigger(event) {
    suppressExpandOnFocus = true
    this.options.trigger.focus()
    this._trigger('focusTrigger', event)
  },

  close(event) {
    this._beforeClose()
    this._hide(this.element, this.options.hide)

    this.options.trigger.attr('tabindex', 0)
    if (this.removeTabIndex) {
      this.element.removeAttr('tabindex')
    }
    this.isOpen = false
    this._trigger('close', event)
  },

  _beforeClose() {
    this.element.attr('aria-hidden', 'true').attr('aria-expanded', 'false')
  },
})
