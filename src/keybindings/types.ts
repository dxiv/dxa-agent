/**
 * Keybinding action identifiers (e.g. `app:toggleTranscript`, `chat:submit`).
 */
export type KeybindingAction = string

/**
 * Named UI contexts where keybindings apply (aligned with validate.ts VALID_CONTEXTS).
 */
export type KeybindingContextName =
  | 'Global'
  | 'Chat'
  | 'Autocomplete'
  | 'Confirmation'
  | 'Help'
  | 'Transcript'
  | 'HistorySearch'
  | 'Task'
  | 'ThemePicker'
  | 'Settings'
  | 'Tabs'
  | 'Attachments'
  | 'Footer'
  | 'MessageSelector'
  | 'MessageActions'
  | 'Scroll'
  | 'DiffDialog'
  | 'ModelPicker'
  | 'Select'
  | 'Plugin'

export type ParsedKeystroke = {
  key: string
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
  super: boolean
}

export type Chord = ParsedKeystroke[]

export type ParsedBinding = {
  chord: Chord
  /** `null` unbinds a key in user config over defaults. */
  action: string | null
  context: KeybindingContextName
}

export type KeybindingBlock = {
  context: KeybindingContextName
  bindings: Record<string, string | null>
}
