import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'

export function Button({
  variant = 'default',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary' | 'ghost' }) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[13px] font-medium',
        'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-accent text-accent-ink hover:bg-accent-strong active:bg-accent',
        variant === 'default' && 'border border-line bg-raised text-fg hover:border-line-strong active:bg-surface',
        variant === 'ghost' && 'text-muted hover:bg-raised hover:text-fg active:bg-surface',
        className,
      )}
      {...props}
    />
  )
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-[13px] text-fg transition-colors duration-150 hover:bg-raised"
    >
      <span className="truncate">{label}</span>
      <span
        aria-hidden="true"
        className={cx(
          'relative h-[18px] w-8 shrink-0 rounded-full border transition-colors duration-150',
          checked ? 'border-accent-strong bg-accent-strong' : 'border-line-strong bg-raised',
        )}
      >
        <span
          className={cx(
            'absolute left-[2px] top-[2px] size-3 rounded-full transition-transform duration-150',
            checked ? 'translate-x-[14px] bg-accent-ink' : 'translate-x-0 bg-muted',
          )}
        />
      </span>
    </button>
  )
}

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="border-b border-line px-4 py-4 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-[12px] font-medium text-faint">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

