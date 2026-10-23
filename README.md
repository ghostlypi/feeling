# Feeling

This static site uses the sibling [`site-framework`](../site-framework/README.md)
repository for shared CSS, theme switching, the ampule loader, and build tasks.
It includes all its own web assets and remains independently deployable.

```sh
./web tasks
./web check
./web build
./web serve --port 8001
./web update --check
./web update
```

`web.json` holds build settings and the framework checkout path. `build` packages
the site into `dist/`; it does not commit, push, or deploy. No package installation
is required.

To change shared UI, edit `../site-framework/assets/`, then run:

```sh
python3 ../site-framework/web.py update ../site .
```

Commit framework source changes there and the generated updates in both sites.
Files listed in `framework-manifest.json` are generated. Feeling-specific styles
remain in `css/style.css`, `css/light-mode.css`, and the page styles. Updates
preserve those overrides and the site's content, data, and images.

`python3 sync_loader.py --check` checks installed asset hashes and inline loaders
without resolving the sibling framework checkout. The launcher can be relocated
by changing `framework.path` in `web.json` or setting `WEB_FRAMEWORK_HOME`.

The tired page uses the shared ampule in persistent mode. Its waiting messages
and "maybe later" link are preserved. The original animation remains unchanged
in [`loading.html`](loading.html), with original assets archived in `legacy/`.
