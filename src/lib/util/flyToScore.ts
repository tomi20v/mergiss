// creates a clone of any element and makes it fliy into the score component
//  then - if present - the onTransitionEnd() callback is called
// NOTE this will NOT remove the original element!
export function flyToScore(stitchElId: string, onTransitionEnd: () => void = () => {}) {

  const stitchEl = document.getElementById(stitchElId);
  if (!stitchEl) return;

  const scoreEl = document.getElementById('game-score');
  if (!scoreEl) return;

console.log('ALL');

  const rect = stitchEl.getBoundingClientRect();
  const clone = stitchEl.cloneNode(true) as HTMLElement;
  document.body.appendChild(clone);
  Object.assign(clone.style, {
    position: 'absolute',
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
    zIndex: 99,
    opacity: 1,
  })
  clone.getBoundingClientRect();

  const scoreRect = scoreEl.getBoundingClientRect();
  const deltaX = (scoreRect.left + scoreRect.right)/2 - (rect.left + rect.right)/2;
  const deltaY = (scoreRect.top + scoreRect.bottom)/2 - (rect.top + rect.bottom)/2;

  clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.5)`;
  clone.style.transition = `transform 0.3s ease, opacity 0.5s ease`;
  clone.addEventListener('transitionend', () => {
    onTransitionEnd();
    clone.remove();
  });

}

