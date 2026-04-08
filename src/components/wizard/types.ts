import type { ComponentType, Dispatch, ReactNode, SetStateAction } from 'react'

export type WizardStepComponent<T extends Record<string, unknown> = Record<string, unknown>> =
  ComponentType<Record<string, never>> | (() => ReactNode)

export type WizardContextValue<T extends Record<string, unknown> = Record<string, unknown>> = {
  currentStepIndex: number
  totalSteps: number
  wizardData: T
  setWizardData: Dispatch<SetStateAction<T>>
  updateWizardData: (updates: Partial<T>) => void
  goNext: () => void
  goBack: () => void
  goToStep: (index: number) => void
  cancel: () => void
  title?: ReactNode
  showStepCounter: boolean
}

export type WizardProviderProps<T extends Record<string, unknown> = Record<string, unknown>> = {
  steps: Array<WizardStepComponent<T>>
  initialData?: T
  onComplete: (data: T) => void
  onCancel?: () => void
  children?: ReactNode
  title?: ReactNode
  showStepCounter?: boolean
}
