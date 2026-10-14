import { useState } from 'react';
import { RecipeImage, Sheet } from './components';
import { BackIcon, BowlIcon, CheckIcon, ClockIcon, ListIcon, MoreIcon } from './icons';
import { CATS, kicker, servesLabel, timeLabel, type Recipe } from './types';

interface Props {
  recipe: Recipe;
  checked: Record<number, boolean>;
  onToggle: (index: number) => void;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecipeView({ recipe: r, checked, onToggle, onBack, onEdit, onDelete }: Props) {
  const [sheet, setSheet] = useState<'' | 'menu' | 'confirm'>('');
  const cat = CATS[r.category] ?? CATS.main;
  const total = r.ingredients.length;
  const ready = r.ingredients.filter((_, i) => checked[i]).length;
  const allReady = total > 0 && ready === total;
  const stepsN = r.steps.length;

  return (
    <div className="screen">
      <div className="scroll recipe">
        <div className="top-row">
          <button type="button" className="icon-btn tap" aria-label="Back to cookbook" onClick={onBack}>
            <BackIcon />
          </button>
          <button type="button" className="icon-btn tap" aria-label="Recipe options" onClick={() => setSheet('menu')}>
            <MoreIcon />
          </button>
        </div>

        <div className="title-block">
          <span className="kicker" style={{ color: cat.kicker }}>{kicker(r)}</span>
          <h2>{r.title}</h2>
        </div>

        <RecipeImage recipe={r} className="hero" iconSize={100} strokeWidth={1.1} alt={`Photo of ${r.title}`} />

        <div className="stats">
          <div className="stat" style={{ background: '#D4EBFB' }}><ClockIcon />{timeLabel(r)}</div>
          <div className="stat" style={{ background: '#E8DCFB' }}><BowlIcon />{servesLabel(r)}</div>
          <div className="stat" style={{ background: '#D3F1E4' }}><ListIcon />{stepsN} {stepsN === 1 ? 'step' : 'steps'}</div>
        </div>

        <section className="section">
          <div className="section-head">
            <h3>Ingredients</h3>
            <span>{allReady ? 'All set, chef!' : `${ready} of ${total} ready`}</span>
          </div>
          <div className="progress">
            <div style={{ width: `${total ? Math.round((ready / total) * 100) : 0}%` }} />
          </div>
          <div className="ings">
            {r.ingredients.map((text, i) => (
              <button key={i} type="button" className="ing tap" aria-pressed={!!checked[i]} onClick={() => onToggle(i)}>
                <span className="box" aria-hidden="true">{checked[i] && <CheckIcon />}</span>
                <span className="text">{text}</span>
              </button>
            ))}
            {total === 0 && <p className="muted-note">No ingredients written down yet.</p>}
          </div>
        </section>

        <section className="section steps-section">
          <h3>Let's cook</h3>
          <ol className="steps">
            {r.steps.map((text, i) => (
              <li key={i}>
                <span className="step-num" style={{ background: cat.tint }}>{i + 1}</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
          {stepsN === 0 && <p className="muted-note">No steps written down yet.</p>}
          <p className="bon">Bon appétit, chef!</p>
        </section>
      </div>

      {sheet === 'menu' && (
        <Sheet label="Recipe options" onClose={() => setSheet('')}>
          <button type="button" className="sheet-btn tap" onClick={() => { setSheet(''); onEdit(); }}>Edit recipe</button>
          <button type="button" className="sheet-btn tap" style={{ color: 'var(--error)' }} onClick={() => setSheet('confirm')}>
            Delete recipe
          </button>
          <button type="button" className="sheet-btn plain tap" onClick={() => setSheet('')}>Cancel</button>
        </Sheet>
      )}
      {sheet === 'confirm' && (
        <Sheet label="Delete recipe" onClose={() => setSheet('')}>
          <h2>Delete this recipe?</h2>
          <p>“{r.title}” will be gone from your cookbook for good.</p>
          <button type="button" className="sheet-btn danger tap" onClick={onDelete}>Delete recipe</button>
          <button type="button" className="sheet-btn plain tap" onClick={() => setSheet('')}>Keep it</button>
        </Sheet>
      )}
    </div>
  );
}
