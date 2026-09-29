import { site } from "@/content/site";

/**
 * MMG-style load-in. A once-per-session brand stage (olive field, leaf mark,
 * drawn rule, settling wordmark) lifts away behind a curtain wipe, then the
 * page's hero content rises in. Pure CSS keyed off two attributes on <html>:
 *   data-re-brand="play"  — set once per session, never under reduced motion
 *   data-re-intro="play"  — hero entrance on every load
 * The overlay is aria-hidden and pointer-events: none, so it never blocks
 * reading or clicking. Without JS neither attribute is set and nothing hides.
 */
const bootScript = `try{var d=document.documentElement;d.dataset.reIntro="play";if(!sessionStorage.getItem("re-brand")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.reBrand="play";sessionStorage.setItem("re-brand","1")}}catch(e){}`;

export default function BrandIntro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      <div className="re-brand" aria-hidden="true">
        <div className="re-brand__sheen" />
        <div className="re-brand__stage">
          <svg className="re-brand__mark" viewBox="0 0 120 120" fill="none">
            <g className="re-brand__corners" stroke="#E3D6C6" strokeWidth="1">
              <path d="M8 24V8h16M112 24V8H96M8 96v16h16M112 96v16H96" />
            </g>
            <path className="re-brand__upper" d="M62 58C66 36 82 22 104 16C98 38 84 54 62 58Z" fill="#F8F6EE" />
            <path className="re-brand__lower" d="M58 62C54 84 38 98 16 104C22 82 36 66 58 62Z" fill="#A7B096" />
            <circle className="re-brand__center" cx="60" cy="60" r="5" fill="#E3D6C6" />
          </svg>
          <span className="re-brand__rule" />
          <p className="re-brand__name">{site.name}</p>
        </div>
      </div>
    </>
  );
}

/** Splits a hero heading into masked words that rise in sequence. */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="re-split__mask" style={{ "--re-word": i } as React.CSSProperties}>
            <span className="re-split__word">{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
