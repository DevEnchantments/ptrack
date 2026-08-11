// frappe-gantt ships no TypeScript declarations; minimal shim for what we
// use. Drop if a future version bundles types.
declare module 'frappe-gantt' {
  export interface FrappeTask {
    id: string
    name: string
    start: string
    end: string
    progress?: number
    custom_class?: string
    dependencies?: string
  }
  export default class Gantt {
    constructor(
      element: HTMLElement | string,
      tasks: FrappeTask[],
      options?: Record<string, unknown>,
    )
    change_view_mode(mode: string): void
  }
}
