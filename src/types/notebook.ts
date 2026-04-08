/**
 * Minimal Jupyter / nbformat shapes used by utils/notebook.ts.
 */

export type NotebookOutputImage = {
  image_data: string
  media_type: 'image/png' | 'image/jpeg'
}

export type NotebookCellSourceOutput = {
  output_type: string
  text?: string
  image?: NotebookOutputImage
}

export type NotebookCellSource = {
  cellType: string
  source: string
  execution_count?: number
  cell_id: string
  language?: string
  outputs?: NotebookCellSourceOutput[]
}

export type NotebookCellOutput =
  | {
      output_type: 'stream'
      text?: string | string[]
    }
  | {
      output_type: 'execute_result' | 'display_data'
      data?: Record<string, unknown>
    }
  | {
      output_type: 'error'
      ename: string
      evalue: string
      traceback: string[]
    }

export type NotebookCellType = 'code' | 'markdown' | 'raw'

export type NotebookCell = {
  id?: string
  cell_type: NotebookCellType
  source: string | string[]
  execution_count?: number | null
  outputs?: NotebookCellOutput[]
  /** Per-cell metadata (nbformat). */
  metadata?: Record<string, unknown>
}

export type NotebookContent = {
  nbformat: number
  nbformat_minor: number
  cells: NotebookCell[]
  metadata?: {
    language_info?: {
      name?: string
    }
    [key: string]: unknown
  }
}
