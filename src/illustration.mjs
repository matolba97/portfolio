export function illustration(label) {
  return `<svg class="hero-art" viewBox="0 0 590 480" role="img" aria-labelledby="art-title" xmlns="http://www.w3.org/2000/svg">
  <title id="art-title">${label}</title>
  <defs>
    <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#7d998c" opacity=".55"/></pattern>
    <marker id="arrow" markerWidth="11" markerHeight="11" refX="8" refY="5.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M2 2l6 3.5L2 9" fill="none" stroke="#387967" stroke-width="1.6" stroke-linecap="round"/></marker>
  </defs>
  <path d="M69 222C80 100 199 52 289 77c82 23 96 5 148 7 75 3 119 58 115 137-4 95-70 170-156 182-101 15-174-23-239-17-73 7-96-72-88-164Z" fill="#dfe8d7"/>
  <path d="M324 62h180v112H324zM61 292h95v91H61z" fill="url(#dots)"/>
  <path d="M52 404c132-10 345 10 493-1" fill="none" stroke="#9baa97" stroke-width="2" stroke-linecap="round"/>
  <path class="data-trail" d="M161 243c31 4 61 15 92 11s53-22 74-36M404 319c46-4 79-35 88-72" fill="none" stroke="#387967" stroke-width="2.5" stroke-dasharray="5 8" stroke-linecap="round" marker-end="url(#arrow)"/>
  <g class="art-record" transform="translate(73 156) rotate(-11 56 66)" stroke="#303b33" stroke-width="2.6" stroke-linejoin="round">
    <path d="M14 9h69l21 21v82a9 9 0 0 1-9 9H14a8 8 0 0 1-8-8V18a9 9 0 0 1 8-9Z" fill="#fbf8ee"/>
    <path d="M83 10v20h20M24 45h44M24 60h61M24 76h49M24 91h26" fill="none" stroke-linecap="round"/>
    <path d="m71 93 7 6 11-17" fill="none" stroke="#397c68" stroke-width="3.7" stroke-linecap="round"/>
  </g>
  <g class="art-record" transform="translate(111 109) rotate(15 53 48)" stroke="#303b33" stroke-width="2.6" stroke-linejoin="round">
    <rect x="6" y="8" width="89" height="65" rx="8" fill="#f9ead1"/>
    <path d="M6 27h89M36 28v45M64 28v45M7 51h88" fill="none"/>
    <path d="M19 18h10m11 0h7" stroke-linecap="round"/>
  </g>
  <g class="art-chart" transform="translate(339 102) rotate(5 94 74)" stroke="#303b33" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="8" y="7" width="181" height="134" rx="13" fill="#faf7ee"/>
    <path d="M8 35h181" fill="none"/><circle cx="24" cy="21" r="2" fill="#303b33"/><circle cx="35" cy="21" r="2" fill="#303b33"/>
    <path d="M31 54v66h138" fill="none" stroke="#9baba1" stroke-width="1.6"/>
    <path d="M44 103h19v17H44zm29-14h19v31H73zm29-15h19v46h-19zm29-13h19v59h-19z" fill="#a6c6af" stroke="none"/>
    <path class="plot-line" d="m43 99 33-21 28 5 41-26" fill="none" stroke="#1b604e" stroke-width="3.4"/>
    <circle cx="145" cy="57" r="5.5" fill="#eec681" stroke="#1b604e" stroke-width="2"/>
  </g>
  <g stroke="#303b33" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M187 393h233M206 396l-12 63m198-63 12 63" fill="none"/>
    <path d="M257 284c-39 14-65 50-69 109h170c-9-47-20-88-55-107Z" fill="#2e6959"/>
    <path d="M260 275v21c16 9 24 6 36-4v-25" fill="#e9ae81"/>
    <path d="M233 206c13-21 56-32 79-8 23 23 10 72-13 85-24 14-60 1-70-21-5-13-4-38 4-56Z" fill="#f3cba0"/>
    <path d="M229 235c-12-25 4-54 25-54 15-19 42-12 50 3 21 4 29 25 18 44-10-3-16-13-18-21-18 14-37 16-62 12l-7 16Z" fill="#303b33"/>
    <path d="M248 239h17m19-2h17m-35 4c5-2 12-2 17 0m-5 8-3 10 6 1m-14 9c8 6 19 4 25-3" fill="none"/>
    <rect x="244" y="235" width="24" height="15" rx="5" fill="none" stroke-width="2"/>
    <rect x="283" y="233" width="23" height="15" rx="5" fill="none" stroke-width="2"/>
    <path d="M240 333c6 25 14 34 25 39l55-12m-19-42c16 11 34 21 49 0l21-27" fill="none" stroke="#173e34"/>
    <path d="M315 353c10-9 20-6 21 2 9 1 10 9 1 12l-16 1M363 294l10-21c7-10 14-5 13 1l-7 20" fill="#f3cba0"/>
    <path d="m372 280 23-29" fill="none" stroke="#185b47" stroke-width="4"/>
    <path d="M316 321h89l-12 53h-88Z" fill="#f6f2df"/>
    <path d="M297 375h98l-6 13h-85Z" fill="#d0d8bf"/>
    <path d="m352 349 7 5 8-10" fill="none" stroke="#397c68" stroke-width="2.7"/>
  </g>
  <g class="art-spark" fill="none" stroke="#aa7332" stroke-width="2.5" stroke-linecap="round"><path d="M481 282v22m-11-11h22M204 95v16m-8-8h16M527 145l10-7m-2 19 13-1"/></g>
  <path d="M91 326c9-16 35-17 47-4 10 12 3 33-12 37-21 6-44-11-35-33Z" fill="#efd6a4"/><path d="M106 339l7 7 13-17" fill="none" stroke="#2f6757" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

const motifs = [
  '<circle cx="29" cy="26" r="13"/><path d="m39 36 12 12M27 21a4 4 0 1 1 4 5v3m0 5h.01"/>',
  '<rect x="15" y="15" width="35" height="34" rx="5"/><path d="M15 25h35M25 15v34m7-13 5 5 8-10"/>',
  '<path d="M14 17v32h37M20 40l9-10 8 4 13-15m-9 0h9v9"/><circle cx="29" cy="30" r="2"/>',
];

export function motif(index) {
  return `<svg viewBox="0 0 64 64" aria-hidden="true" width="64" height="64"><rect x="3" y="3" width="58" height="58" rx="19" fill="currentColor" opacity=".1"/><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${motifs[index]}</g></svg>`;
}
