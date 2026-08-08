# AngularJS 1.8.3 compatibility patch

Drop-in replacements for the files changed while fixing the fallout of the
AngularJS **1.5.x -> 1.8.3** upgrade. If a legacy copy of the source tree is
restored, copy this folder's contents over the project root to re-apply the fix.

The `app/` tree here mirrors the real project layout, so from the project root:

```
xcopy /E /Y angular-1.8-patch\app  app\
copy  /Y    angular-1.8-patch\gulpfile.js         .\
copy  /Y    angular-1.8-patch\app.scripts.json    .\
copy  /Y    angular-1.8-patch\package.json        .\
copy  /Y    angular-1.8-patch\package-lock.json   .\
copy  /Y    angular-1.8-patch\bower.json          .\
```

Then reinstall dependencies and rebuild the bundle (`index.html` loads
`build/app.js`, not the sources):

```
npm ci           # reproduces gulp 4.0.2 + angular 1.8.3 exactly
npx gulp js      # dev bundle, unminified
npx gulp prod    # vendor + minified bundle
```

**Apply order matters.** `app.scripts.json` and `package.json` are what put
AngularJS 1.8.3 on the page in the first place; `gulpfile.js` is gulp 4 syntax
and will not run under a gulp 3 install. Restoring the `app/` sources without
the toolchain files leaves you with a build that either fails outright or
silently bundles nothing.

> **Do not** place this folder inside `app/`. `gulpfile.js` globs
> `app/**/!(module)*.js` into `build/app.js` and watches the same glob, so a
> mirrored tree under `app/` would be concatenated into the bundle and register
> every factory and controller twice.

---

## Root cause

`$http`'s `.success()` / `.error()` shorthand was deprecated in AngularJS 1.4.4
and **removed in 1.6.0**. The project's `app.scripts.json` loads angular from
`node_modules/angular/angular.min.js`, which is 1.8.3 — so every remaining
`.success()` call throws `TypeError: ....success is not a function`
**synchronously**.

The visible symptom was blank navigation labels. `$rootScope.getWord` used to be
defined at the *end* of `LanguagesCtrl`, after the `Language.getLanguages(...)`
call — so the throw aborted the controller constructor before `getWord` was ever
assigned. Angular's `$parse` silently returns `undefined` when an expression
calls a non-existent function, so `{{getWord('Dashboard')}}` rendered empty
rather than raising a visible error.

## Files

### Application sources

| File | Change |
| --- | --- |
| `app/layout/language/Language.js` | `.success()/.error()` -> `.then(ok, err)`; added the missing `$log` injection (it was referenced in both error handlers but never injected). |
| `app/layout/language/language-controller.js` | `$rootScope.getWord` moved out of `LanguagesCtrl` into a module `.run()` block. |
| `app/dashboard/activities/activities-service.js` | `.success()/.error()` -> `.then(ok, err)` in `getActivities` and `getActivitiesByType`. |
| `app/inbox/directives/unreadMessagesCount.js` | `InboxConfig.success(cb)` -> `.then()`, unwrapping `response.data`. |
| `app/inbox/directives/messageLabels.js` | Same `InboxConfig` conversion. |

These conversions run correctly on **both** 1.5.x and 1.8.3 — `.then()` has
always existed, so the sources are safe to apply regardless of which angular the
target tree ends up loading.

### Build toolchain

These are what actually put AngularJS 1.8.3 on the page. Without them the
application-source patch is inert.

| File | Change |
| --- | --- |
| `app.scripts.json` | Repoints `angular`, `angular-animate`, `angular-resource`, `angular-sanitize` at `node_modules/` (1.8.3) instead of `bower_components/` (1.5.11 / 1.4.14). **This is the change that triggered the whole bug.** |
| `package.json` | Declares angular `^1.8.2`, the ng modules `^1.8.3`, and gulp `^4.0.2`. |
| `package-lock.json` | Generated. Included so `npm ci` reproduces the exact working tree rather than re-resolving the `^` ranges. |
| `gulpfile.js` | Migrated gulp 3 -> 4 (`gulp.series`/`gulp.parallel`, `done()` callbacks). Also adds `destOptions` (forces mode 644 on bundles, because `gulp.dest` otherwise inherits the Windows read-only attribute from sources and throws `EPERM` on the next write) and a manual `end` handler for `es.merge`, whose legacy stream never emits `finish` for gulp 4 to detect. |
| `bower.json` | AngularJS core family `~1.5.11`/`~1.4.9` -> `~1.8.3`. Documentation only — nothing loads these anymore. |

### Deliberately NOT included

`app/layout/partials/navigation.tpl.html`, `app/smart-admin/views/app-layout.html`
and `api/menu-items.json` have also been modified in the working tree, but they
look like project customizations unrelated to the angular upgrade. They are left
out so that re-applying this patch months from now cannot overwrite newer menu or
layout work with a stale snapshot. Copy them by hand if a restore needs them.

### Two details worth preserving

**The `.then(onSuccess, onError)` two-argument form is deliberate.**
`.then().catch()` would also swallow exceptions thrown *inside* the success
handler and fire the `callback([])` fallback — behaviour `.error()` never had.

**`InboxConfig` is a raw `$http` promise** (`app/inbox/models/InboxConfig.js`
returns the promise itself). `.success()` handed the callback the unwrapped body;
`.then()` hands over the full response, so each call site now reads
`response.data`. This matches how `app/inbox/module.js` already consumed it.

### Keep the `.run()` block

The throw is fixed, but the other half of the problem is independent of it:
`LanguagesCtrl` only instantiates when the `language-selector` directive's async
`templateUrl` resolves (`app/layout/partials/header.tpl.html`), so defining
`getWord` inside the controller leaves the navigation's first render racing it.
The `.run()` block executes at bootstrap and is immune to both failure modes.

## bower.json note

Four entries moved, not one. The installed `angular-animate`, `angular-resource`
and `angular-sanitize` (1.4.14) each hard-pin `angular@1.4.14` in their own
manifests, so bumping only the top-level `angular` produces a `bower install`
resolution conflict. AngularJS core and its first-party modules have to move as
a set.

This is documentation-only — no runtime effect. `app.scripts.json` maps
`angular`, `angular-animate`, `angular-resource` and `angular-sanitize` to
`node_modules/`, and `package.json` already declared them at `^1.8.2`/`^1.8.3`.
The bower entries had simply drifted out of sync with reality, which is what
makes this bug easy to misdiagnose against 1.5.11 semantics.
