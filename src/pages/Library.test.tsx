// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Ctx } from '../store'
import { empty, type State } from '../lib/accountData'
import Library from './Library'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let state: State = empty
function Host() {
  const [s, setS] = useState(empty)
  state = s
  return <Ctx.Provider value={{ state: s, set: (fn) => setS(fn), loading: false, error: null }}><Library /></Ctx.Provider>
}

const el = document.createElement('div')
const q = <T extends Element>(sel: string) => el.querySelector<T>(sel)!
const click = (node: Element) => act(async () => { (node as HTMLElement).click() })
const type = (id: string, value: string) => act(async () => {
  const input = q<HTMLInputElement>(`#${id}`)
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})
const submit = () => act(async () => { q('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })) })

describe('Library Moves tab', () => {
  it('lists Built-in Moves, refuses a bad form, and adds a Custom Move', async () => {
    await act(async () => { createRoot(el).render(<MemoryRouter><Host /></MemoryRouter>) })
    await click(q('#tab-moves'))
    expect(el.textContent).toContain('Jumping Jacks')
    expect(el.textContent).not.toContain('Custom')

    await click([...el.querySelectorAll('button')].find((b) => b.textContent === 'Add a Move')!)
    await type('move-name', '   ')
    await type('move-minutes', '20')
    await submit()
    await type('move-name', 'Salsa')
    await type('move-minutes', '0')
    await submit()
    expect(state.custom.moves).toEqual([])

    await type('move-minutes', '20')
    await submit()
    expect(state.custom.moves).toHaveLength(1)
    expect(state.custom.moves[0]).toMatchObject({ name: 'Salsa', met: 5, minutes: [20, 20] })
    expect(el.textContent).toContain('Saved “Salsa” to your Moves.')
    expect(el.textContent).toContain('Custom')
  })

  it('edits a Custom Move from a prefilled form, and deletes it only after confirm; Built-in Moves have neither', async () => {
    const btn = (label: string) => el.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)
    expect(btn('Edit Jumping Jacks')).toBeNull()
    expect(btn('Delete Jumping Jacks')).toBeNull()

    await click(btn('Edit Salsa')!)
    expect(el.textContent).toContain('Edit Move')
    expect(q<HTMLInputElement>('#move-name').value).toBe('Salsa')
    expect(q<HTMLInputElement>('#move-minutes').value).toBe('20')
    expect(q<HTMLSelectElement>('#move-intensity').value).toBe('moderate')
    await type('move-minutes', '0')
    await submit()
    expect(state.custom.moves[0].minutes).toEqual([20, 20])
    await type('move-name', 'Salsa Night')
    await type('move-minutes', '30')
    await submit()
    expect(state.custom.moves).toHaveLength(1)
    expect(state.custom.moves[0]).toMatchObject({ name: 'Salsa Night', minutes: [30, 30], dose: ['30 min', '30 min'] })

    const answers = [false, true]
    window.confirm = () => answers.shift()!
    await click(btn('Delete Salsa Night')!)
    expect(state.custom.moves).toHaveLength(1)
    await click(btn('Delete Salsa Night')!)
    expect(state.custom.moves).toEqual([])
    expect(el.textContent).toContain('Deleted “Salsa Night”.')
  })
})
