import { useEffect, type ReactNode } from 'react';
import { CategoryIcon } from './icons';
import { useBlobUrl } from './media';
import { CATS, type Recipe } from './types';

// Photo if there is one, otherwise the category tint with its icon.
export function RecipeImage({ recipe, className, iconSize, strokeWidth, alt = '' }: {
  recipe: Recipe; className: string; iconSize: number; strokeWidth: number; alt?: string;
}) {
  const url = useBlobUrl(recipe.photo);
  const cat = CATS[recipe.category] ?? CATS.main;
  return (
    <span className={className} style={{ background: cat.tint }}>
      {recipe.photo ? (
        url && <img src={url} alt={alt} />
      ) : (
        <CategoryIcon category={recipe.category} size={iconSize} strokeWidth={strokeWidth} />
      )}
    </span>
  );
}

export function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
