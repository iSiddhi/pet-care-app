import Button from './Button';

// One component for "nothing here", "couldn't load" and "no matches",
// so failure never looks like a broken page.
const EmptyState = ({
  icon: Icon,
  title,
  body,
  actionLabel,
  onAction,
  tone = 'neutral',
}) => (
  <div
    className={`rounded-3xl py-20 px-6 text-center ${
      tone === 'error'
        ? 'border border-hairline bg-cream'
        : 'border border-dashed border-hairline'
    }`}
  >
    {Icon && (
      <span
        className={`inline-grid place-items-center w-12 h-12 rounded-2xl mb-5 ${
          tone === 'error' ? 'bg-blush-100 text-blush-500' : 'bg-mist text-ink-mute'
        }`}
      >
        <Icon size={21} />
      </span>
    )}
    <p className="text-ink font-medium mb-2">{title}</p>
    {body && <p className="text-sm text-ink-soft max-w-sm mx-auto">{body}</p>}
    {actionLabel && onAction && (
      <div className="mt-7">
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      </div>
    )}
  </div>
);

export default EmptyState;
