export const vibrate = (duration: number): void => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  navigator.vibrate?.(duration);
};
