import {registerRoute as workbox_routing_registerRoute} from '/private/var/folders/4j/vgggyxln7xn8rfkgzxmrg5pmk7dxxz/T/tmp.dDbZDVvCXf/basketball/node_modules/workbox-routing/registerRoute.mjs';
import {NetworkOnly as workbox_strategies_NetworkOnly} from '/private/var/folders/4j/vgggyxln7xn8rfkgzxmrg5pmk7dxxz/T/tmp.dDbZDVvCXf/basketball/node_modules/workbox-strategies/NetworkOnly.mjs';
import {precacheAndRoute as workbox_precaching_precacheAndRoute} from '/private/var/folders/4j/vgggyxln7xn8rfkgzxmrg5pmk7dxxz/T/tmp.dDbZDVvCXf/basketball/node_modules/workbox-precaching/precacheAndRoute.mjs';
import {cleanupOutdatedCaches as workbox_precaching_cleanupOutdatedCaches} from '/private/var/folders/4j/vgggyxln7xn8rfkgzxmrg5pmk7dxxz/T/tmp.dDbZDVvCXf/basketball/node_modules/workbox-precaching/cleanupOutdatedCaches.mjs';
import {NavigationRoute as workbox_routing_NavigationRoute} from '/private/var/folders/4j/vgggyxln7xn8rfkgzxmrg5pmk7dxxz/T/tmp.dDbZDVvCXf/basketball/node_modules/workbox-routing/NavigationRoute.mjs';
import {createHandlerBoundToURL as workbox_precaching_createHandlerBoundToURL} from '/private/var/folders/4j/vgggyxln7xn8rfkgzxmrg5pmk7dxxz/T/tmp.dDbZDVvCXf/basketball/node_modules/workbox-precaching/createHandlerBoundToURL.mjs';/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */








self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});




/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
workbox_precaching_precacheAndRoute([
  {
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  },
  {
    "url": "index.html",
    "revision": "9798f0ba31c1015952887c646f93a513"
  },
  {
    "url": "assets/index-gKpVQ2xr.js",
    "revision": null
  },
  {
    "url": "assets/index-SXD1xOfm.css",
    "revision": null
  },
  {
    "url": "favicon.svg",
    "revision": "b91139e058690322b067f29af9c1134a"
  },
  {
    "url": "icons/icon-192.png",
    "revision": "05ad7688aa99f0014d667baac9d098a2"
  },
  {
    "url": "icons/icon-512.png",
    "revision": "b703049805b7cfe025c0b8a125384b62"
  },
  {
    "url": "icons/icon-maskable-512.png",
    "revision": "b703049805b7cfe025c0b8a125384b62"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "9e454de101e01d35ab485d275f3b744c"
  }
], {});
workbox_precaching_cleanupOutdatedCaches();
workbox_routing_registerRoute(new workbox_routing_NavigationRoute(workbox_precaching_createHandlerBoundToURL("index.html")));


workbox_routing_registerRoute(/^https:\/\/.*\.supabase\.(co|in)\/.*/i, new workbox_strategies_NetworkOnly(), 'GET');




