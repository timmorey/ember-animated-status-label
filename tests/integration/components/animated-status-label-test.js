import RSVP from 'rsvp'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import { setProperties } from '@ember/object'
import { waitForStateChange, waitUntilConfirming, waitUntilSettled } from 'ember-animated-status-label/test-support'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | animated-status-label', function(hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function() {
    setProperties(this, {
      pendingContent: 'PENDING',
      confirmationContent: 'CONFIRMATION',
      settledContent: 'SETTLED',
      confirmationDuration: 0,
      onConfirmationFinished: () => {}
    })
    this.renderComponent = async props => {
      setProperties(this, props)
      await render(hbs`
        {{#animated-status-label
            promise=promise
            confirmationDuration=confirmationDuration
            onConfirmationFinished=(action onConfirmationFinished)
            as |label|}}
          {{#if label.isSettled}}
            {{settledContent}}
          {{else if label.isPending}}
            {{pendingContent}}
          {{else if label.isConfirming}}
            {{confirmationContent}}
          {{/if}}
        {{/animated-status-label}}
      `)
    }
  })

  test('when the promise is undefined, the component shows settled text', async function(assert) {
    await this.renderComponent({ promise: undefined })
    assert.equal(this.element.textContent.trim(), this.settledContent)
  })

  test('it handles resolving promises', async function(assert) {
    await this.renderComponent({ promise: new RSVP.resolve() })
    assert.equal(this.element.textContent.trim(), this.pendingContent, 'initially shows pending content')
    await waitForStateChange()
    assert.equal(this.element.textContent.trim(), this.confirmationContent, 'transitions to confirmation content')
    await waitForStateChange()
    assert.equal(this.element.textContent.trim(), this.settledContent, 'transitions to settled content')
  })

  test('it handles rejecting promises', async function(assert) {
    await this.renderComponent({ promise: new RSVP.reject() })
    assert.equal(this.element.textContent.trim(), this.pendingContent, 'initially shows pending content')
    await waitForStateChange()
    assert.equal(this.element.textContent.trim(), this.settledContent, 'transitions to settled content')
  })

  test('it fires onConfirmationFinished after showing the confirmation', async function(assert) {
    assert.expect(1)
    let hasShownConfirmation = false
    let hasShownSettled = false
    await this.renderComponent({
      promise: new RSVP.resolve(),
      onConfirmationFinished: () => assert.ok(hasShownConfirmation && !hasShownSettled)
    })
    await waitUntilConfirming()
    hasShownConfirmation = this.element.textContent.trim() === this.confirmationContent
    await waitUntilSettled()
    hasShownSettled = this.element.textContent.trim() === this.settledContent
  })
})
