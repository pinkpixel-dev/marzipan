import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { buildCode } from '../config'
import type { DemoConfig } from '../config'
import { Button, Section } from './ui'

export function CodePanel({ config }: { config: DemoConfig }) {
  const code = buildCode(config)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked; the code is still selectable */
    }
  }

  return (
    <Section
      title="Setup for these settings"
      action={
        <Button variant="ghost" className="h-7 px-2" onClick={copy} aria-label={copied ? 'Copied' : 'Copy code'}>
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      }
    >
      <pre className="panel-scroll whitespace-pre-wrap break-words rounded-md border border-line bg-canvas p-3 font-mono text-[12px] leading-relaxed text-muted">
        <code>{code}</code>
      </pre>
    </Section>
  )
}
