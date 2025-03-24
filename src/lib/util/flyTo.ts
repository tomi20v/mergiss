// creates a clone of any element and makes it fliy into the score component
//  then - if present - the onTransitionEnd() callback is called
// NOTE this will NOT remove the original element!
export function flyTo(flyingId: string, targetId: string, onTransitionEnd: () => void = () => {}) {

  const flyingEl = document.getElementById(flyingId);
  if (!flyingEl) return;

  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  const flyingRect = flyingEl.getBoundingClientRect();
  const clone = flyingEl.cloneNode(true) as HTMLElement;
  document.body.appendChild(clone);
  Object.assign(clone.style, {
    position: 'absolute',
    top: flyingRect.top + 'px',
    left: flyingRect.left + 'px',
    width: flyingRect.width + 'px',
    height: flyingRect.height + 'px',
    zIndex: 99,
    opacity: 1,
    animation: 'none',
  })
  clone.getBoundingClientRect();

  const targetRect = targetEl.getBoundingClientRect();
  const deltaX = (targetRect.left + targetRect.right)/2 - (flyingRect.left + flyingRect.right)/2;
  const deltaY = (targetRect.top + targetRect.bottom)/2 - (flyingRect.top + flyingRect.bottom)/2;

  clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.5)`;
  clone.style.transition = `transform 0.3s ease, opacity 0.5s ease`;
  clone.addEventListener('transitionend', () => {
    onTransitionEnd();
    clone.remove();
  });

}
