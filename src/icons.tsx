import type { Category } from './types';

type P = { size?: number; strokeWidth?: number };

const line = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function CategoryIcon({ category, size = 38, strokeWidth = 1.5 }: P & { category: Category }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" {...line} strokeWidth={strokeWidth}>
      {category === 'main' && (
        <>
          <path d="M4 10h16v4a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z" />
          <path d="M2 10h2M20 10h2" />
          <path d="M9 6.5c0-1.2 1.2-1.2 1.2-2.5M13.8 6.5c0-1.2 1.2-1.2 1.2-2.5" />
        </>
      )}
      {category === 'sweet' && (
        <>
          <path d="M6 12h12l-1.6 8H7.6z" />
          <path d="M5 12a7 5.5 0 0 1 14 0" />
          <path d="M12 4.5v2" />
          <path d="M10 16v2M14 16v2" />
        </>
      )}
      {category === 'snack' && (
        <>
          <path d="M5.5 11A3.5 3.5 0 0 1 7 4h10a3.5 3.5 0 0 1 1.5 7v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" />
          <path d="M9 9.5v1M12 8.5v1M15 9.5v1" />
        </>
      )}
      {category === 'drink' && (
        <>
          <path d="M6 6h12l-1.5 14h-9z" />
          <path d="M6.6 11h10.8" />
          <path d="M14 6l2-3" />
          <circle cx="17.5" cy="6" r="2" />
        </>
      )}
    </svg>
  );
}

export const ChefHat = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" {...line} strokeWidth={1.9}>
    <path d="M7 14a4 4 0 1 1 1.6-7.7A4 4 0 0 1 15.4 6.3 4 4 0 1 1 17 14z" />
    <path d="M7 14v5.5h10V14" />
    <path d="M7 17h10" />
  </svg>
);

export const SearchIcon = () => (
  <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#62666D" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const PlusIcon = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" {...line} strokeWidth={2.6}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const BackIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" {...line} strokeWidth={1.8}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const CloseIcon = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" {...line} strokeWidth={2}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const MoreIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);

export const ClockIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17181C" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const BowlIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17181C" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 11h16" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 8V6" />
  </svg>
);

export const ListIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" {...line} stroke="#17181C" strokeWidth={1.8}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const CheckIcon = ({ size = 13, strokeWidth = 3.6 }: P) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" {...line} strokeWidth={strokeWidth}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const PhoneIcon = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" {...line} strokeWidth={1.8}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M9 7h6M9 10.5h6M9 14h4" />
  </svg>
);

export const CameraIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" {...line} strokeWidth={1.8}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
