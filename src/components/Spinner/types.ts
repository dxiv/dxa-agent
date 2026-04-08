/** Spinner / stream chrome mode for the main REPL status line. */
export type SpinnerMode =
  | 'requesting'
  | 'responding'
  | 'thinking'
  | 'tool-use'
  | 'tool-input'
