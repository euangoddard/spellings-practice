import { component$, Slot } from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <>
      <div class="navbar bg-base-100">
        <div class="navbar-start"></div>
        <div class="navbar-center">
          <a class="inline-flex items-center gap-2 text-2xl" href="/">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="24"
                height="24"
                rx="4"
                fill="url(#paint0_linear_1_5)"
              />
              <path
                d="M13.7851 20.7493L10.0386 17.0028L11.2727 15.7686L13.7851 18.281L18.7658 13.3003L20 14.5344L13.7851 20.7493ZM4 15.4601L8.27548 4H10.3471L14.6226 15.4601H12.595L11.5813 12.551H6.95317L5.93939 15.4601H4ZM7.57025 10.876H11.0083L9.33333 6.1157H9.24518L7.57025 10.876Z"
                fill="#1D232A"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1_5"
                  x1="0"
                  y1="0"
                  x2="24"
                  y2="24"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.166667" stop-color="#00CCB7" />
                  <stop offset="0.486111" stop-color="#747FFF" />
                  <stop offset="0.864583" stop-color="#FF53D9" />
                </linearGradient>
              </defs>
            </svg>
            Spelling practice
          </a>
        </div>
        <div class="navbar-end"></div>
      </div>
      <main class="p-4">
        <div>
          <Slot />
        </div>
      </main>
    </>
  );
});
