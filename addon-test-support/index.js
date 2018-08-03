import { waitUntil } from '@ember/test-helpers'

const defaultSelector = '.animated-status-label'

export function isSettled(selectorOrElement = defaultSelector) {
  return findElement(selectorOrElement).classList.contains('settled')
}

export function isPending(selectorOrElement = defaultSelector) {
  return findElement(selectorOrElement).classList.contains('pending')
}

export function isConfirming(selectorOrElement = defaultSelector) {
  return findElement(selectorOrElement).classList.contains('confirming')
}

export async function waitUntilSettled(selectorOrElement = defaultSelector) {
  return waitUntilState(selectorOrElement, 'settled')
}

export async function waitUntilPending(selectorOrElement = defaultSelector) {
  return waitUntilState(selectorOrElement, 'pending')
}

export async function waitUntilConfirming(selectorOrElement = defaultSelector) {
  return waitUntilState(selectorOrElement, 'confirming')
}

export async function waitForStateChange(selectorOrElement = defaultSelector) {
  const initialState = currentState(selectorOrElement)
  return waitUntil(() => currentState(selectorOrElement) !== initialState)
}

function findElement(selectorOrElement) {
  return typeof selectorOrElement === 'string'
    ? document.querySelector(selectorOrElement)
    : selectorOrElement
}

function currentState(selectorOrElement) {
  return isPending(selectorOrElement)
    ? 'pending'
    : isConfirming(selectorOrElement) ? 'confirming' : 'settled'
}

async function waitUntilState(selectorOrElement, state) {
  const element = findElement(selectorOrElement)
  return waitUntil(() => element.classList.contains(state))
}
