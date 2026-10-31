/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "b9342d060a1cfad3cb73785a52ada27d"
  }, {
    "url": "pwa-512x512.png",
    "revision": "ab28ab25efb11d4254f5cef58d5ad98d"
  }, {
    "url": "pwa-192x192.png",
    "revision": "f0f8bb7041579ad8d38f7c54e59c7fd0"
  }, {
    "url": "index.html",
    "revision": "98ff6831055e6d07d31f1cab55f7517e"
  }, {
    "url": "icon.svg",
    "revision": "88bae774c8ad130dbe67c5bef429bb29"
  }, {
    "url": "favicon.ico",
    "revision": "a58382f834c9bfed02d083ad6a7291ac"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "f8dfa43a11068e0ff4673bb440e1af1f"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/index-BRRMfETl.js",
    "revision": null
  }, {
    "url": "assets/index-B5GEwErk.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "f8dfa43a11068e0ff4673bb440e1af1f"
  }, {
    "url": "favicon.ico",
    "revision": "a58382f834c9bfed02d083ad6a7291ac"
  }, {
    "url": "icon.svg",
    "revision": "88bae774c8ad130dbe67c5bef429bb29"
  }, {
    "url": "pwa-192x192.png",
    "revision": "f0f8bb7041579ad8d38f7c54e59c7fd0"
  }, {
    "url": "pwa-512x512.png",
    "revision": "ab28ab25efb11d4254f5cef58d5ad98d"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "b9342d060a1cfad3cb73785a52ada27d"
  }, {
    "url": "manifest.webmanifest",
    "revision": "36ad13a51dc73558f50088b02da4b2d6"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/.*\/assets\/glb\/.*\.(?:b64|glb|gz)$/i, new workbox.CacheFirst({
    "cacheName": "wizard-chess-3d-models",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 30,
      maxAgeSeconds: 5184000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
