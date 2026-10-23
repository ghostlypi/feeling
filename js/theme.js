(() => {
    const source = new URL(document.currentScript.src || window.location.href);
    const stylesheet = new URL(source.pathname.endsWith('/js/theme.js') ? '../css/light-mode.css' : 'css/light-mode.css', source).href;
    const normalize = theme => theme === 'light' ? 'light' : 'dark';
    let savedTheme;
    try { savedTheme = window.localStorage.getItem('theme'); } catch (_) {}
    // Old shared links remain usable until this browser has its own preference.
    let currentTheme = normalize(savedTheme ?? new URLSearchParams(window.location.search).get('theme'));
    document.documentElement.classList.toggle('light-mode', currentTheme === 'light');

    function initialize() {
        const themeSwitch = document.getElementById('checkbox') || document.getElementById('theme-checkbox');
        const themeStyle = document.getElementById('theme-style');

        function applyTheme(theme) {
            currentTheme = normalize(theme);
            const light = currentTheme === 'light';
            document.documentElement.classList.toggle('light-mode', light);
            document.body.classList.toggle('light-mode', light);
            if (themeStyle) {
                if (light) {
                    themeStyle.href = stylesheet;
                    themeStyle.removeAttribute('media');
                } else {
                    themeStyle.removeAttribute('href');
                }
            }
            if (themeSwitch) themeSwitch.checked = light;
        }

        applyTheme(currentTheme);
        themeSwitch?.addEventListener('change', () => {
            applyTheme(themeSwitch.checked ? 'light' : 'dark');
            try { window.localStorage.setItem('theme', currentTheme); } catch (_) {}
        });
        window.addEventListener('storage', event => {
            if (event.key === 'theme' || event.key === null) applyTheme(event.newValue);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
