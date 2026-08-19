import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

/**
 * Testing Library auto-cleans between tests only when vitest runs with
 * `globals: true`, which this project does not: tests import `describe`/`it`
 * explicitly. Without this, every render stays in the document and the second
 * test in a file starts finding elements from the first.
 */
afterEach(cleanup)
