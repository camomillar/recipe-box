import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { allRecipes, db } from './db';
import { Home, type Filter } from './Home';
import { RecipeForm } from './RecipeForm';
import { RecipeView } from './RecipeView';

// Hash routes: #/  #/recipe/:id  #/new  #/edit/:id
function useHashRoute() {
  const [hash, setHash] = useState(() => location.hash);
  useEffect(() => {
    const onChange = () => setHash(location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const parts = hash.replace(/^#\/?/, '').split('/');
  return { name: parts[0] || 'home', id: parts[1] };
}

function go(path: string) {
  history.pushState({ inApp: true }, '', path);
  dispatchEvent(new HashChangeEvent('hashchange'));
}

// Go back within the app when we can, otherwise jump to the fallback.
function back(fallback: string) {
  if (history.state?.inApp) history.back();
  else {
    history.replaceState(null, '', fallback);
    dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

export default function App() {
  const route = useHashRoute();
  const recipes = useLiveQuery(allRecipes);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [checked, setChecked] = useState<Record<string, Record<number, boolean>>>({});
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2600);
  }, []);

  // Each screen starts at the top.
  useEffect(() => {
    document.querySelector('.scroll')?.scrollTo(0, 0);
  }, [route.name, route.id]);

  if (!recipes) return <div className="app" />;

  const current = route.id ? recipes.find((r) => r.id === route.id) : undefined;
  let screen;

  if (route.name === 'recipe' && current) {
    screen = (
      <RecipeView
        recipe={current}
        checked={checked[current.id] || {}}
        onToggle={(i) =>
          setChecked((all) => ({ ...all, [current.id]: { ...all[current.id], [i]: !all[current.id]?.[i] } }))
        }
        onBack={() => back('#/')}
        onEdit={() => go(`#/edit/${current.id}`)}
        onDelete={async () => {
          await db.recipes.delete(current.id);
          back('#/');
          showToast('Recipe deleted.');
        }}
      />
    );
  } else if (route.name === 'new' || (route.name === 'edit' && current)) {
    screen = (
      <RecipeForm
        key={route.name + (route.id || '')}
        existing={route.name === 'edit' ? current : undefined}
        onClose={() => back(current ? `#/recipe/${current.id}` : '#/')}
        onSaved={(r, isNew) => {
          if (isNew) {
            setQuery('');
            setFilter('all');
            back('#/');
            showToast('Nice one, chef! It’s in your cookbook.');
          } else {
            back(`#/recipe/${r.id}`);
            showToast('Saved, chef!');
          }
        }}
      />
    );
  } else {
    screen = (
      <Home
        recipes={recipes}
        query={query}
        filter={filter}
        onQuery={setQuery}
        onFilter={setFilter}
        onOpen={(id) => go(`#/recipe/${id}`)}
        onAdd={() => go('#/new')}
        toast={showToast}
      />
    );
  }

  return (
    <div className="app">
      {screen}
      {toast && <div role="status" className="toast">{toast}</div>}
    </div>
  );
}
