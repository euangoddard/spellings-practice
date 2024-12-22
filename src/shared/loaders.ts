import { routeLoader$ } from "@builder.io/qwik-city";

// eslint-disable-next-line qwik/loader-location
export const useScore = routeLoader$<number>(({ cookie }) => {
  return cookie.get("score")?.number() ?? 0;
});
