import type { ReactNode } from 'react';
import { BackIcon } from './icons';

const SECTIONS: { title: string; body: ReactNode }[] = [
  {
    title: 'Your recipes stay on your phone',
    body: 'Recipes, dish photos and ticked ingredients are saved only in this app on this device. They’re never uploaded, and nobody else can see them, not even the people who made Recipe Box.',
  },
  {
    title: 'Photos only go where you put them',
    body: 'When you add a photo of your dish, the app only sees the one picture you choose, not the rest of your library. It’s made smaller and saved with that recipe on your phone, and it’s never uploaded.',
  },
  {
    title: 'No accounts, no tracking',
    body: 'There’s no sign-up, no analytics, no ads and no tracking cookies. The app only remembers, on your phone, that you’ve already seen the welcome screen.',
  },
  {
    title: 'Backups are yours',
    body: 'A backup is a file made on your phone. Where it goes next, like Files, email or a friend, is up to you.',
  },
  {
    title: 'Where the app is hosted',
    body: (
      <>
        Recipe Box is served by GitHub Pages. Like any website host, GitHub keeps basic technical logs, such as IP
        addresses, when the app loads. See{' '}
        <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">
          GitHub’s privacy statement
        </a>
        .
      </>
    ),
  },
  {
    title: 'Deleting your data',
    body: 'Delete any recipe from its ⋯ menu. To remove everything, clear this site’s data in your browser settings, or delete the app from your home screen.',
  },
];

export function Privacy({ onBack }: { onBack: () => void }) {
  return (
    <div className="screen">
      <div className="scroll privacy">
        <div className="top-row">
          <button type="button" className="icon-btn tap" aria-label="Back to cookbook" onClick={onBack}>
            <BackIcon />
          </button>
        </div>
        <div className="title-block">
          <h2>Your privacy</h2>
          <p className="privacy-lead">Short version: your recipes and photos never leave your phone.</p>
        </div>
        {SECTIONS.map((s) => (
          <section key={s.title} className="privacy-section">
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </section>
        ))}
        <p className="privacy-updated">Last updated 14 October 2026</p>
      </div>
    </div>
  );
}
