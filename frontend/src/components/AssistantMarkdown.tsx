import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renders an assistant reply. The model writes GitHub-flavoured Markdown
 * (tables, bold, short headings); this maps it onto the app's tokens.
 * react-markdown never renders raw HTML, so model output cannot inject markup.
 */
const components: Components = {
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  h1: ({ children }) => (
    <p className="mb-1 mt-3 text-sm font-semibold text-foreground first:mt-0">
      {children}
    </p>
  ),
  h2: ({ children }) => (
    <p className="mb-1 mt-3 text-sm font-semibold text-foreground first:mt-0">
      {children}
    </p>
  ),
  h3: ({ children }) => (
    <p className="mb-1 mt-3 text-sm font-semibold text-foreground first:mt-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 first:mt-0 last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 first:mt-0 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-2"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-md border border-border first:mt-0 last:mb-0">
      <table className="w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="whitespace-nowrap px-3 py-2 font-medium">{children}</th>
  ),
  tr: ({ children }) => (
    <tr className="border-t border-border first:border-t-0 even:bg-muted/30">
      {children}
    </tr>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 align-top text-foreground">{children}</td>
  ),
  hr: () => <hr className="my-3 border-border" />,
}

export function AssistantMarkdown({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed text-foreground">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  )
}
