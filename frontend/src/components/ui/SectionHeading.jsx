// Plain heading block. No eyebrow-by-default, no entrance animation --
// repeating the same animated eyebrow + serif + subtitle five times down a
// page is what makes a site feel generated.
const SectionHeading = ({ eyebrow, title, subtitle, align = 'center', className = '' }) => (
  <div
    className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}
  >
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blush-500 mb-3">
        {eyebrow}
      </p>
    )}
    <h2 className="text-xl sm:text-2xl leading-snug text-ink">{title}</h2>
    {subtitle && (
      <p className="mt-3 text-[0.95rem] sm:text-base text-ink-soft leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeading;
