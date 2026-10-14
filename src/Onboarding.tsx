import { useEffect } from 'react';
import chefCatWhite from './assets/chef-cat-white.png';

const RED = '#E31414';

export function Onboarding({ onStart }: { onStart: () => void }) {
  // Tint the browser chrome red while this screen is up.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const before = meta?.getAttribute('content') ?? '#FFFFFF';
    meta?.setAttribute('content', RED);
    return () => meta?.setAttribute('content', before);
  }, []);

  return (
    <div className="screen onboarding">
      <div className="onboarding-text">
        <h1>Every recipe you love,<br /> in one place</h1>
        <p>Family classics, new favorites and your own creations, ready whenever you're hungry.</p>
      </div>
      <img className="onboarding-art" src={chefCatWhite} alt="" width={284} height={257} />
      <div className="onboarding-bottom">
        <button type="button" className="onboarding-btn tap" onClick={onStart}>
          Let's get cooking
        </button>
      </div>
    </div>
  );
}
