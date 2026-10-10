import Container from './Container';

// Flat band, hairline rule underneath. No blurred blobs, no entrance
// animation -- this is the first thing on the page, it should already be
// there when the page paints.
const PageHeader = ({ eyebrow, title, subtitle, children, meta }) => (
  <section className="border-b border-hairline bg-shell">
    <Container className="pt-14 pb-10 sm:pt-16">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blush-500 mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl leading-tight text-ink">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>

      {/* Optional fact strip -- concrete numbers beat another paragraph */}
      {meta?.length > 0 && (
        <dl className="flex flex-wrap gap-x-10 gap-y-4 mt-9 pt-7 border-t border-hairline">
          {meta.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-ink-mute mb-1">{label}</dt>
              <dd className="text-[0.95rem] font-medium text-ink tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Container>
  </section>
);

export default PageHeader;
