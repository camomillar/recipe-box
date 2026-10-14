import { useState, type FormEvent } from 'react';
import { db } from './db';
import { CameraIcon, CheckIcon, CloseIcon, PhoneIcon } from './icons';
import { readTextFromImage, resizePhoto, useBlobUrl } from './media';
import { looksLikeRecipe, parseCaption, type ParsedRecipe } from './parseCaption';
import { CATS, ORDER, type Category, type Recipe } from './types';

interface Draft {
  title: string;
  time: string;
  servings: string;
  category: Category;
  ingredients: string;
  steps: string;
  photo?: Blob;
}

interface Props {
  existing?: Recipe;
  onClose: () => void;
  onSaved: (recipe: Recipe, isNew: boolean) => void;
}

const lines = (text: string) => text.split('\n').map((s) => s.trim()).filter(Boolean);

function toDraft(r?: Recipe): Draft {
  if (!r) return { title: '', time: '', servings: '', category: 'main', ingredients: '', steps: '' };
  return {
    title: r.title,
    time: r.time || '',
    servings: r.servings || '',
    category: r.category,
    ingredients: r.ingredients.join('\n'),
    steps: r.steps.join('\n'),
    photo: r.photo,
  };
}

const NO_RECIPE = 'Couldn’t find a recipe in that text. Try pasting the whole caption.';

export function RecipeForm({ existing, onClose, onSaved }: Props) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(existing));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // importer
  const [tab, setTab] = useState<'caption' | 'shot'>('caption');
  const [caption, setCaption] = useState('');
  const [shot, setShot] = useState<Blob>();
  const [reading, setReading] = useState(false);
  const [imported, setImported] = useState<'' | 'caption' | 'screenshot'>('');
  const [importError, setImportError] = useState('');

  const shotUrl = useBlobUrl(shot);
  const photoUrl = useBlobUrl(draft.photo);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (key === 'title') setError('');
  };

  // Imports only fill the form, and never overwrite a field with an empty value.
  function applyImport(p: ParsedRecipe, source: 'caption' | 'screenshot') {
    setDraft((d) => ({
      ...d,
      title: p.title || d.title,
      time: p.time || d.time,
      servings: p.servings || d.servings,
      ingredients: p.ingredients.length ? p.ingredients.join('\n') : d.ingredients,
      steps: p.steps.length ? p.steps.join('\n') : d.steps,
    }));
    setImported(source);
    setImportError('');
    setError('');
  }

  function fillFromCaption() {
    if (!caption.trim()) return setImportError('Paste the caption first, chef.');
    const parsed = parseCaption(caption);
    if (!looksLikeRecipe(parsed)) return setImportError(NO_RECIPE);
    applyImport(parsed, 'caption');
  }

  async function fillFromShot() {
    if (!shot) return;
    setReading(true);
    setImportError('');
    try {
      const parsed = parseCaption(await readTextFromImage(shot));
      if (!looksLikeRecipe(parsed)) setImportError(NO_RECIPE);
      else applyImport(parsed, 'screenshot');
    } catch {
      setImportError('Couldn’t read that screenshot. Check your connection and try again.');
    } finally {
      setReading(false);
    }
  }

  async function pickPhoto(file?: File) {
    if (!file) return;
    try {
      set('photo', await resizePhoto(file));
    } catch {
      set('photo', file);
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!draft.title.trim()) return setError('Every dish needs a name, chef.');
    setSaving(true);
    const recipe: Recipe = {
      id: existing?.id ?? crypto.randomUUID(),
      createdAt: existing?.createdAt ?? Date.now(),
      origin: existing?.origin ?? '',
      title: draft.title.trim(),
      category: draft.category,
      time: draft.time.trim(),
      servings: draft.servings.trim(),
      ingredients: lines(draft.ingredients),
      steps: lines(draft.steps),
      photo: draft.photo,
    };
    await db.recipes.put(recipe);
    onSaved(recipe, !existing);
  }

  const resetImport = () => {
    setTab('caption');
    setCaption('');
    setShot(undefined);
    setReading(false);
    setImported('');
    setImportError('');
  };

  return (
    <form className="form" aria-label={existing ? 'Edit recipe' : 'New recipe'} onSubmit={save} noValidate>
      <div className="form-top">
        <button type="button" className="icon-btn tap" aria-label="Close" onClick={onClose} style={{ marginLeft: -10 }}>
          <CloseIcon />
        </button>
        <span>{existing ? 'Edit recipe' : 'New recipe'}</span>
        <span style={{ width: 34 }} />
      </div>

      <div className="scroll form-body">
        <div className="intro">
          <h2>{existing ? 'Fine-tuning a classic, chef?' : 'A new signature dish, chef?'}</h2>
          <p>{existing ? 'Tweak it until it’s just right.' : 'Write it down so it’s yours forever.'}</p>
        </div>

        <section className="importer" aria-label="Fill from a recipe video">
          <div className="importer-title">
            <span>Saw it in a video?</span>
            <span>Paste the caption or add a screenshot and we'll fill it in for you.</span>
          </div>

          {!imported && (
            <div className="stack">
              <div className="segmented">
                {([['caption', 'Paste caption'], ['shot', 'Screenshot']] as const).map(([key, label]) => (
                  <button key={key} type="button" className="tap" aria-pressed={tab === key} onClick={() => { setTab(key); setImportError(''); }}>
                    {label}
                  </button>
                ))}
              </div>

              {tab === 'caption' && (
                <div className="stack">
                  <label htmlFor="caption-box" className="sr-only">Recipe caption</label>
                  <textarea
                    id="caption-box"
                    className="field"
                    rows={4}
                    value={caption}
                    onChange={(e) => { setCaption(e.target.value); setImportError(''); }}
                    placeholder="Paste the full caption here…"
                  />
                  <button type="button" className="pill-dark tap" onClick={fillFromCaption}>Fill it in for me</button>
                </div>
              )}

              {tab === 'shot' && (
                <div className="stack">
                  {!shot ? (
                    <label className="shot-drop drop">
                      <PhoneIcon />
                      Add a screenshot of the caption
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setShot(f); setImportError(''); } e.target.value = ''; }} />
                    </label>
                  ) : (
                    <div className="shot-row">
                      {shotUrl && <img src={shotUrl} alt="Caption screenshot" />}
                      <div className="stack">
                        <button type="button" className="pill-dark tap" onClick={fillFromShot} disabled={reading}>
                          {reading ? 'Reading…' : 'Read screenshot'}
                        </button>
                        <button type="button" className="pill-white tap" onClick={() => { setShot(undefined); setReading(false); }} disabled={reading}>
                          Change screenshot
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {importError && <p role="alert" className="error">{importError}</p>}
            </div>
          )}

          {imported && (
            <div role="status" className="imported">
              <span>
                <CheckIcon size={18} strokeWidth={2.8} />
                Filled from your {imported}. Give it a taste-check.
              </span>
              <button type="button" className="link-btn tap" onClick={resetImport}>Redo</button>
            </div>
          )}
        </section>

        <div className="label">
          <span>Photo <span className="muted">· optional</span></span>
          {!draft.photo ? (
            <label className="photo-pick drop">
              <span className="ph" aria-hidden="true"><CameraIcon /></span>
              Show off your dish
              <input type="file" accept="image/*" onChange={(e) => { pickPhoto(e.target.files?.[0]); e.target.value = ''; }} />
            </label>
          ) : (
            <div className="photo-pick" style={{ cursor: 'default' }}>
              {photoUrl && <img src={photoUrl} alt="Selected dish photo" />}
              <button type="button" className="pill-white tap" onClick={() => set('photo', undefined)}>Remove photo</button>
            </div>
          )}
        </div>

        <label className="label">
          Name of the dish
          <input
            className="field"
            type="text"
            value={draft.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Grandma's feijoada"
            aria-invalid={!!error}
            autoCapitalize="sentences"
          />
        </label>
        {error && <p role="alert" className="error" style={{ marginTop: -10 }}>{error}</p>}

        <fieldset>
          <legend>What kind of dish?</legend>
          <div className="grid2">
            {ORDER.map((key) => {
              const on = draft.category === key;
              return (
                <button
                  key={key}
                  type="button"
                  className="cat-opt tap"
                  aria-pressed={on}
                  onClick={() => set('category', key)}
                  style={on ? { background: CATS[key].tint, borderColor: CATS[key].dot } : undefined}
                >
                  <span className="dot" aria-hidden="true" style={{ background: CATS[key].dot }} />
                  {CATS[key].label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid2 gap10">
          <label className="label">
            Time
            <input className="field" type="text" value={draft.time} onChange={(e) => set('time', e.target.value)} placeholder="45 min" />
          </label>
          <label className="label">
            Serves
            <input className="field" type="text" value={draft.servings} onChange={(e) => set('servings', e.target.value)} placeholder="4" />
          </label>
        </div>

        <label className="label">
          <span>Ingredients <span className="muted">· one ingredient per line</span></span>
          <textarea
            className="field"
            rows={5}
            value={draft.ingredients}
            onChange={(e) => set('ingredients', e.target.value)}
            placeholder={'500 g black beans\n2 bay leaves'}
          />
        </label>

        <label className="label">
          <span>The method <span className="muted">· one step per line</span></span>
          <textarea
            className="field"
            rows={6}
            value={draft.steps}
            onChange={(e) => set('steps', e.target.value)}
            placeholder={'Soak the beans overnight.\nCook with the bay leaves until soft.'}
          />
        </label>
      </div>

      <div className="bottom-bar static">
        <button type="submit" className="cta tap" disabled={saving}>
          {existing ? 'Save changes' : 'Add to my cookbook'}
        </button>
      </div>
    </form>
  );
}
