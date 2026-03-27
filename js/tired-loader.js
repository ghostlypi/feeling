document.addEventListener("DOMContentLoaded", function () {
    const liquid = document.getElementById('liquid');
    const bubblesContainer = document.getElementById('bubbles');
    const messageEl = document.getElementById('loader-message');
    const startTime = Date.now();

    const messages = [
        [0,   "one moment..."],
        [15,  "still loading..."],
        [45,  "shouldn't be long now..."],
        [90,  "almost there..."],
        [180, "..."],
        [300, "maybe tomorrow."],
    ];

    setInterval(() => {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 6 + 3 + 'px';
        bubble.style.width = size;
        bubble.style.height = size;
        bubble.style.top = Math.random() * 90 + 5 + '%';
        bubble.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        bubble.style.animationDelay = Math.random() * 0.2 + 's';
        bubblesContainer.appendChild(bubble);
        setTimeout(() => bubble.remove(), 2000);
    }, 100);

    function update() {
        const elapsed = (Date.now() - startTime) / 1000;

        // Logarithmic growth: fast start, ever-slowing, asymptotes below 100%
        // t=5s → ~23%, t=30s → ~50%, t=120s → ~74%, t=600s → capped at 98%
        const progress = Math.min(98, 18 * Math.log(1 + elapsed / 2));
        liquid.style.width = progress + '%';

        if (messageEl) {
            let msg = messages[0][1];
            for (const [t, m] of messages) {
                if (elapsed >= t) msg = m;
            }
            if (messageEl.textContent !== msg) messageEl.textContent = msg;
        }

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
});
