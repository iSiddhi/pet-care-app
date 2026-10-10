/**
 * Plays the meow that greets you when the chat is first opened.
 *
 * public/meow.mp3 is a real recording (freesound.org, tuberatanka), folded
 * to mono and levelled so it is consistent with the rest of the page.
 *
 * The element is created once and reused: building a new Audio per call
 * leaks objects and adds a fetch delay on the first play.
 */
let audio = null;

const get = () => {
  if (audio) return audio;
  audio = new Audio('/meow.mp3');
  audio.preload = 'auto';
  audio.volume = 0.55;
  return audio;
};

/** Fetches the file ahead of time so the first play is instant. */
export const primeMeow = () => {
  try {
    get().load();
  } catch {
    // Nothing to do if the browser will not preload
  }
};

export const playMeow = (volume = 0.55) => {
  try {
    const el = get();
    el.volume = Math.min(1, Math.max(0, volume));
    el.currentTime = 0;
    // Autoplay rules mean this can reject; it is decoration, so let it go
    el.play()?.catch(() => {});
  } catch {
    // Audio unavailable — not worth surfacing
  }
};
