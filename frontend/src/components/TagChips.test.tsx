import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagChips } from './TagChips'

/**
 * The first rendered-component tests in the repo (REFACTOR-PLAN v2, Phase 2).
 *
 * Their real job is to prove the harness end to end: jsdom, Testing Library,
 * the jest-dom matchers from test-setup.ts, and userEvent all working together
 * on a real component. TagChips is deliberately small, because a broken
 * harness should fail on the harness rather than on the component.
 *
 * Everything asserted here is user-visible: text, absence, and what a click
 * does. No class names, so restyling cannot break these.
 */
describe('TagChips', () => {
  it('renders one chip per tag', () => {
    render(<TagChips tags={['migration', 'q3']} />)

    expect(screen.getByText('migration')).toBeInTheDocument()
    expect(screen.getByText('q3')).toBeInTheDocument()
  })

  it('renders nothing at all when there are no tags', () => {
    // Three ways a record can have no tags, all of which must produce no
    // stray empty container in the layout.
    for (const tags of [null, undefined, []]) {
      const { container } = render(<TagChips tags={tags} />)
      expect(container).toBeEmptyDOMElement()
    }
  })

  it('is not interactive unless a handler is given', () => {
    render(<TagChips tags={['migration']} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('reports which tag was clicked', async () => {
    const onTagClick = vi.fn()
    render(<TagChips tags={['migration', 'q3']} onTagClick={onTagClick} />)

    await userEvent.click(screen.getByRole('button', { name: 'q3' }))

    expect(onTagClick).toHaveBeenCalledWith('q3')
  })

  it('does not let a chip click reach the row behind it', async () => {
    // Chips sit inside clickable rows and cards; without stopPropagation,
    // filtering by a tag would also navigate away.
    const onRowClick = vi.fn()
    const onTagClick = vi.fn()
    render(
      <div onClick={onRowClick}>
        <TagChips tags={['migration']} onTagClick={onTagClick} />
      </div>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'migration' }))

    expect(onTagClick).toHaveBeenCalledOnce()
    expect(onRowClick).not.toHaveBeenCalled()
  })
})
