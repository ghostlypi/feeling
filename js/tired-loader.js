// The shared loader owns the ampule. This page only changes its waiting message.
document.addEventListener('DOMContentLoaded', () => {
    const message = document.getElementById('loader-message');
    if (!message) return;
    const started = performance.now();
    const messages = [
        [0, 'one moment...'],
        [15, 'still loading...'],
        [45, "shouldn't be long now..."],
        [90, 'almost there...'],
        [180, '...'],
        [300, 'maybe tomorrow.'],
    ];
    const timer = setInterval(() => {
        const elapsed = (performance.now() - started) / 1000;
        for (const [seconds, text] of messages) {
            if (elapsed >= seconds) message.textContent = text;
        }
        if (elapsed >= messages[messages.length - 1][0]) clearInterval(timer);
    }, 1000);
    window.addEventListener('pagehide', () => clearInterval(timer), { once: true });
});
