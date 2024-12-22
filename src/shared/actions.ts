import { routeAction$ } from "@builder.io/qwik-city";
import { scoreCookieName } from "./constants";

// eslint-disable-next-line qwik/loader-location
export const useIncrementScore = routeAction$((_, { cookie }) => {
  const scoreCookie = cookie.get(scoreCookieName);

  let newScore = 1;
  if (scoreCookie) {
    newScore = scoreCookie.number() + 1;
  }
  cookie.set(scoreCookieName, newScore, { path: "/" });

  return {
    success: true,
    score: newScore,
  };
});
