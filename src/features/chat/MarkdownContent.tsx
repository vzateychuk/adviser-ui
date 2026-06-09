import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownContentProps = {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h3 className="mb-2 mt-4 text-base font-semibold text-slate-900 first:mt-0">{children}</h3>
        ),
        h2: ({ children }) => (
          <h4 className="mb-2 mt-3 text-sm font-semibold text-slate-900 first:mt-0">{children}</h4>
        ),
        h3: ({ children }) => (
          <h5 className="mb-1 mt-2 text-sm font-semibold text-slate-800 first:mt-0">{children}</h5>
        ),
        p: ({ children }) => <p className="mb-2 text-sm leading-relaxed text-slate-800 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 text-sm text-slate-800">{children}</ul>,
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm text-slate-800">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
        code: ({ children }) => (
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-800">{children}</code>
        ),
        pre: ({ children }) => (
          <pre className="mb-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">{children}</pre>
        ),
        table: ({ children }) => (
          <div className="mb-2 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-slate-200 bg-slate-50 px-2 py-1 text-left font-medium">{children}</th>
        ),
        td: ({ children }) => <td className="border border-slate-200 px-2 py-1">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
