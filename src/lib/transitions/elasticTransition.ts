import {elasticOut} from "svelte/easing";

export default function elasticTransition(node: HTMLElement, params: { delay?: number, duration?: number, easing?: (t: number) => number } = {}) {
  return {
    delay: params.delay || 0,
    duration: params.duration || 400,
    easing: params.easing || elasticOut,
    css: (t: number) => `transform: scale(${t})`
  }
}
