// Turns a pasted caption (or OCR text) into recipe fields.
// Ported as-is from the design file. Later: swap for an AI call.

export interface ParsedRecipe {
  title: string;
  time: string;
  servings: string;
  ingredients: string[];
  steps: string[];
}

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;
const ING_HEAD = /^(ingredients?|ingredientes?|zutaten|what you.?ll need|you.?ll need)\b/i;
const STEP_HEAD = /^(method|instructions?|directions?|steps?|preparation|how to make( it)?|modo de preparo|preparo|zubereitung)\b(?!\s*\d)/i; // lookahead: "Step 1: ..." is a step, not a heading
const NUMBERED = /^(step\s*)?\d+\s*[.):-]\s*/i;
const BULLET = /^[-–•*·▪►>]+\s*/;
const QTY = /^(\d|½|¼|¾|⅓|⅔|a |an |one |two |pinch|handful|splash)/i;

export function parseCaption(raw: string): ParsedRecipe {
  const all = String(raw || '').split('\n')
    .map((l) => l.replace(EMOJI, '').trim())
    .filter((l) => l && !/^(#\w+\s*)+$/.test(l));
  let title = '', time = '', servings = '';
  const ingredients: string[] = [], steps: string[] = [];
  let section = '';
  all.forEach((line) => {
    const clean = line.replace(/:$/, '').trim();
    if (ING_HEAD.test(clean)) { section = 'ing'; return; }
    if (STEP_HEAD.test(clean)) { section = 'step'; return; }
    const t = line.match(/(\d+\s*(?:[-–]\s*\d+\s*)?(?:min(?:ute)?s?|h(?:ou)?rs?|hours?)\b)/i);
    if (!time && t) time = t[1];
    const sv = line.match(/(?:serves|servings|makes|yield|rende)\s*:?\s*([^.,|]+)/i);
    if (!servings && sv) { servings = sv[1].trim(); return; }
    if (section === 'ing') { ingredients.push(line.replace(BULLET, '')); return; }
    if (section === 'step') { steps.push(line.replace(NUMBERED, '').replace(BULLET, '')); return; }
    if (NUMBERED.test(line)) { steps.push(line.replace(NUMBERED, '')); return; }
    if (BULLET.test(line) || QTY.test(line)) { ingredients.push(line.replace(BULLET, '')); return; }
    if (!title) title = line.replace(/#\w+/g, '').replace(/[!.:]+$/, '').trim().slice(0, 70);
  });
  return { title, time, servings, ingredients, steps };
}

export function looksLikeRecipe(p: ParsedRecipe): boolean {
  return !!(p.title || p.ingredients.length || p.steps.length);
}
