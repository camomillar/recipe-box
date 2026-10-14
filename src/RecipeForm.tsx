import { useState, type FormEvent } from 'react';
import { db } from './db';
import { CameraIcon, CloseIcon } from './icons';
import { resizePhoto, useBlobUrl } from './media';
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

export function RecipeForm({ existing, onClose, onSaved }: Props) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(existing));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const photoUrl = useBlobUrl(draft.photo);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (key === 'title') setError('');
  };

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
