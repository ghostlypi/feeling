(() => {
    // Resolve from this asset, so root pages and nested pages use the same code.
    const stylesheet = new URL('../css/light-mode.css', document.currentScript.src).href;

    document.addEventListener('DOMContentLoaded', () => {
        const themeSwitch = document.getElementById('checkbox');
        const themeStyle = document.getElementById('theme-style');
        if (!themeStyle) return;
        const popup = document.getElementById('cookie-consent-popup');
        // The main site's consent controller owns its own popup and buttons.
        const ownsPopup = popup && !document.getElementById('consent-overlay');
        const urlParams = new URLSearchParams(window.location.search);
        const normalize = theme => theme === 'light' ? 'light' : 'dark';

        function getCookie(name) {
            const cookie = document.cookie.split(';').map(value => value.trim())
                .find(value => value.startsWith(name + '='));
            return cookie ? cookie.slice(name.length + 1) : null;
        }

        function canRemember() {
            return getCookie('cookie_consent') === 'true' || getCookie('theme') !== null;
        }

        function setCookie(name, value) {
            const expires = new Date(Date.now() + 365 * 86400000).toUTCString();
            const secure = window.location.protocol === 'https:' ? '; Secure' : '';
            document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict${secure}`;
        }

        function updateLinks(theme) {
            document.querySelectorAll('a[href]').forEach(link => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#')) return;
                const url = new URL(link.href, window.location.href);
                if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) return;
                url.searchParams.set('theme', theme);
                link.href = url.href;
            });
        }

        function applyTheme(theme) {
            if (theme === 'light') {
                themeStyle.href = stylesheet;
                themeStyle.removeAttribute('media');
            } else {
                themeStyle.removeAttribute('href');
            }
            document.body.classList.toggle('light-mode', theme === 'light');
            if (themeSwitch) themeSwitch.checked = theme === 'light';
        }

        let currentTheme = normalize(canRemember() ? getCookie('theme') : urlParams.get('theme'));
        applyTheme(currentTheme);
        if (!canRemember()) updateLinks(currentTheme);

        function setUrlTheme(theme) {
            const url = new URL(window.location.href);
            url.searchParams.set('theme', theme);
            history.replaceState({}, '', url.href);
            updateLinks(theme);
        }

        themeSwitch?.addEventListener('change', () => {
            currentTheme = themeSwitch.checked ? 'light' : 'dark';
            applyTheme(currentTheme);
            if (canRemember()) {
                setCookie('theme', currentTheme);
            } else {
                const offerRemember = ownsPopup && !new URLSearchParams(window.location.search).has('theme');
                setUrlTheme(currentTheme);
                if (offerRemember) popup.style.display = 'block';
            }
        });

        if (ownsPopup) {
            document.getElementById('cookie-accept')?.addEventListener('click', () => {
                setCookie('cookie_consent', 'true');
                setCookie('theme', currentTheme);
                popup.style.display = 'none';
            });
            document.getElementById('cookie-reject')?.addEventListener('click', () => {
                setUrlTheme(currentTheme);
                popup.style.display = 'none';
            });
        }
    }, { once: true });
})();
