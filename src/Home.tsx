import { useRef, useState } from 'react';
import { RecipeImage, Sheet } from './components';
import { exportBackup, importBackup } from './db';
import chefCat from './assets/chef-cat.png';
import logo from './assets/logo.png';
import { MoreIcon, PlusIcon, SearchIcon } from './icons';
import { CATS, ORDER, kicker, servesLabel, timeLabel, type Category, type Recipe } from './types';

export type Filter = 'all' | Category;

interface Props {
  recipes: Recipe[];
  query: string;
  filter: Filter;
  onQuery: (q: string) => void;
  onFilter: (f: Filter) => void;
  onOpen: (id: string) => void;
  onAdd: () => void;
  onPrivacy: () => void;
  toast: (msg: string) => void;
}

const FILTERS: [Filter, string][] = [['all', 'All'], ...ORDER.map((k): [Filter, string] => [k, CATS[k].label])];

export function Home({ recipes, query, filter, onQuery, onFilter, onOpen, onAdd, onPrivacy, toast }: Props) {
  const [menu, setMenu] = useState(false);
  const restoreInput = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const cards = recipes.filter((r) => {
    if (filter !== 'all' && r.category !== filter) return false;
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      r.ingredients.join(' ').toLowerCase().includes(q) ||
      (r.origin || '').toLowerCase().includes(q)
    );
  });
  const total = recipes.length;

  async function backup() {
    setMenu(false);
    const blob = await exportBackup();
    const name = `recipe-box-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File([blob], name, { type: 'application/json' });
    // On phones the share sheet is the reliable way to save a file (Files, AirDrop, mail…).
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Recipe Box backup' });
      } catch {
        /* user cancelled */
      }
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function restore(file?: File) {
    if (!file) return;
    try {
      const n = await importBackup(file);
      toast(`Restored ${n} ${n === 1 ? 'recipe' : 'recipes'}, chef!`);
    } catch {
      toast('That file isn’t a Recipe Box backup.');
    }
  }

  return (
    <div className="screen">
      <div className={total > 0 ? 'scroll home' : 'scroll home no-bar'}>
        <div className="brand-row">
          <div className="brand">
            <img className="logo" src={logo} alt="" width={38} height={38} />
            <span className="brand-name">Recipe Box</span>
          </div>
          <button type="button" className="icon-btn tap" aria-label="More options" onClick={() => setMenu(true)} style={{ marginRight: -10 }}>
            <MoreIcon />
          </button>
        </div>

        <h1>What's cooking, chef?</h1>

        <label className="search">
          <SearchIcon />
          <span className="sr-only">Search your cookbook</span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search a dish or ingredient"
            enterKeyHint="search"
          />
        </label>

        <div className="filters">
          {FILTERS.map(([key, label]) => (
            <button key={key} type="button" className="filter tap" aria-pressed={filter === key} onClick={() => onFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        <div className="list">
          <div className="list-head">
            <span>Your cookbook</span>
            <span>{total} {total === 1 ? 'recipe' : 'recipes'}</span>
          </div>
          {cards.map((r) => (
            <button key={r.id} type="button" className="row tap" aria-label={`Open ${r.title}`} onClick={() => onOpen(r.id)}>
              <RecipeImage recipe={r} className="thumb" iconSize={38} strokeWidth={1.5} />
              <span className="row-text">
                <span className="row-title">{r.title}</span>
                <span className="row-kicker">{kicker(r)}</span>
                <span className="row-meta">
                  <span className="dot" aria-hidden="true" style={{ background: CATS[r.category].dot }} />
                  {timeLabel(r)} · {servesLabel(r)}
                </span>
              </span>
            </button>
          ))}
        </div>

        {total === 0 && (
          <div className="empty first-run">
            <img className="empty-art" src={chefCat} alt="" width={180} height={163} />
            <p>Your cookbook is waiting, chef</p>
            <p>Add your first recipe and it’ll live right here.</p>
            <button type="button" className="pill-dark tap" onClick={onAdd}>Add your first recipe</button>
          </div>
        )}

        {total > 0 && cards.length === 0 && (
          <div className="empty">
            <p>Not in your cookbook yet, chef</p>
            <p>Try another word or add it as a new recipe.</p>
            <button type="button" className="pill-dark tap" onClick={() => { onQuery(''); onFilter('all'); }}>
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* An empty cookbook has its own "Add your first recipe" button. */}
      {total > 0 && (
        <div className="bottom-bar">
          <button type="button" className="cta tap" onClick={onAdd}>
            <PlusIcon />
            New recipe
          </button>
        </div>
      )}

      <input
        ref={restoreInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => { restore(e.target.files?.[0]); e.target.value = ''; }}
      />

      {menu && (
        <Sheet label="More options" onClose={() => setMenu(false)}>
          <h2>Keep your recipes safe</h2>
          <p>Your cookbook lives only on this phone. Save a backup file now and then.</p>
          <button type="button" className="sheet-btn tap" onClick={backup}>Back up recipes</button>
          <button type="button" className="sheet-btn tap" onClick={() => { setMenu(false); restoreInput.current?.click(); }}>
            Restore from backup
          </button>
          <button type="button" className="sheet-btn tap" onClick={() => { setMenu(false); onPrivacy(); }}>Privacy</button>
          <button type="button" className="sheet-btn plain tap" onClick={() => setMenu(false)}>Cancel</button>
        </Sheet>
      )}
    </div>
  );
}
