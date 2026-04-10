'use client'

import { useTheme } from 'next-themes'
import { Field, FieldContent, FieldLabel } from './ui/field'
import { Switch } from './ui/switch'

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="switch-theme-mode">
          {isDark ? 'Light' : 'Dark'} Mode
        </FieldLabel>
      </FieldContent>
      <Switch
        id="switch-theme-mode"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
    </Field>
  )
}
