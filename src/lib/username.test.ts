import { describe, expect, it } from 'vitest'
import { normalizeUsername, validateUsername } from './username'

describe('username', () => {
  it('lowercases and trims', () => {
    expect(normalizeUsername('  Mira_01 ')).toBe('mira_01')
  })
  it('accepts letters, digits, underscore', () => {
    expect(validateUsername('Mira_01')).toBeNull()
    expect(validateUsername('abc')).toBeNull()
  })
  it('enforces 3 to 20 length', () => {
    expect(validateUsername('ab')).not.toBeNull()
    expect(validateUsername('a'.repeat(20))).toBeNull()
    expect(validateUsername('a'.repeat(21))).not.toBeNull()
    expect(validateUsername('')).not.toBeNull()
  })
  it('rejects other characters', () => {
    for (const bad of ['mi ra', 'mira!', 'mira-x', 'mirá', 'a@b.c']) expect(validateUsername(bad)).not.toBeNull()
  })
})
