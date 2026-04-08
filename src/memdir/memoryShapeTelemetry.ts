import type { MemoryScope } from '../utils/memoryFileDetection.js'
import type { MemoryHeader } from './memoryScan.js'

/**
 * Stub for optional MEMORY_SHAPE_TELEMETRY builds.
 * Real implementation records shape metadata for memory writes.
 */
export function logMemoryWriteShape(
  _toolName: string,
  _toolInput: unknown,
  _filePath: string,
  _scope: MemoryScope,
): void {}

/** Stub: recall-selection telemetry (manifest size vs picks). */
export function logMemoryRecallShape(
  _all: MemoryHeader[],
  _picked: MemoryHeader[],
): void {}
