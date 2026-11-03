// The marketing pages share their head, icon sprite and closing card. A page
// names a part with <!-- @include partials/name.html --> and gets its
// contents (vite.config.js runs this before anything else reads the HTML;
// the tests render pages the same way).
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../../', import.meta.url);
const INCLUDE = /<!--\s*@include\s+([\w./-]+)\s*-->/g;

export function fillPartials(html, depth = 0) {
  return html.replace(INCLUDE, (_, file) => {
    if (depth > 4) throw new Error(`partials nest too deep at ${file}`);
    const path = fileURLToPath(new URL(file, ROOT));
    if (!existsSync(path)) throw new Error(`missing partial ${file}`);
    return fillPartials(readFileSync(path, 'utf8'), depth + 1);
  });
}
