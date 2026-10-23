(() => {
    const script = document.currentScript;
    const termsUrl = script.dataset.termsUrl || 'https://parthiyer.com/policy/tnc.html';
    const rejectedUrl = script.dataset.rejectedUrl || 'https://parthiyer.com/policy/rejected.html';
    const key = 'tnc_accepted';

    function initialize() {
        // Terms and rejection pages must remain readable before agreement.
        if (document.documentElement.hasAttribute('data-consent-exempt') ||
            window.location.pathname.includes('/policy/')) return;

        function hasConsent() {
            try { if (window.localStorage.getItem(key) === 'true') return true; } catch (_) {}
            try { return window.sessionStorage.getItem(key) === 'true'; } catch (_) { return false; }
        }

        function rememberConsent() {
            try { window.localStorage.setItem(key, 'true'); } catch (_) {
                // Restricted storage must not prevent access after agreement.
                try { window.sessionStorage.setItem(key, 'true'); } catch (_) {}
            }
        }

        // Honor return links created by the previous main-site controller.
        function returnToPage() {
            const value = new URLSearchParams(window.location.search).get('return');
            if (!value) return;
            try {
                const target = new URL(value, window.location.href);
                if (target.origin === window.location.origin && target.href !== window.location.href) {
                    window.location.replace(target.href);
                }
            } catch (_) {}
        }

        if (hasConsent()) {
            returnToPage();
            return;
        }

        const dialog = document.createElement('dialog');
        dialog.id = 'tnc-consent-popup';
        dialog.setAttribute('aria-labelledby', 'tnc-consent-title');
        const title = document.createElement('h2');
        title.id = 'tnc-consent-title';
        title.textContent = 'Terms and Conditions';
        const message = document.createElement('p');
        message.append('To access this site you must agree to the ');
        const link = document.createElement('a');
        link.href = termsUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Terms and Conditions';
        message.append(link, '.');
        const explanation = document.createElement('p');
        explanation.textContent = 'By clicking “Accept” you agree to these terms. Rejecting will prevent you from viewing site contents.';
        const actions = document.createElement('div');
        actions.className = 'consent-actions';
        const accept = document.createElement('button');
        accept.id = 'tnc-accept';
        accept.type = 'button';
        accept.textContent = 'Accept';
        const reject = document.createElement('button');
        reject.id = 'tnc-reject';
        reject.type = 'button';
        reject.textContent = 'Reject';
        actions.append(accept, reject);
        dialog.append(title, message, explanation, actions);
        document.body.append(dialog);
        document.body.classList.add('consent-pending');
        // Escape cannot silently bypass agreement; visitors can choose Reject.
        dialog.addEventListener('cancel', event => event.preventDefault());

        function unblock() {
            if (dialog.open) dialog.close();
            dialog.remove();
            document.body.classList.remove('consent-pending');
        }

        let accepted = false;
        accept.addEventListener('click', () => {
            accepted = true;
            rememberConsent();
            unblock();
            returnToPage();
        });
        reject.addEventListener('click', () => window.location.assign(rejectedUrl));
        window.addEventListener('storage', event => {
            if (event.key === key && event.newValue === 'true') {
                accepted = true;
                unblock();
            }
        });

        function show() {
            if (!accepted && !dialog.open) dialog.showModal();
        }
        const loader = document.getElementById('loader-wrapper');
        if (!loader || loader.classList.contains('loaded') || loader.dataset.loaderMode === 'persistent') {
            show();
        } else {
            document.addEventListener('loaderComplete', show, { once: true });
            // Also recover if an older or site-specific loader misses its event.
            const fallback = () => window.setTimeout(show, 3000);
            if (document.readyState === 'complete') fallback();
            else window.addEventListener('load', fallback, { once: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
