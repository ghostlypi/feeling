let feelings = [];
let currentFeeling = null;
let hasHovered = false;

const btn = document.getElementById('feeling-btn');

async function loadFeelings() {
    const res = await fetch('jsons/feelings.json');
    const data = await res.json();
    feelings = data.feelings;
    const def = feelings.find(f => f.word === data.default) || feelings[0];
    setFeeling(def);
}

function setFeeling(feeling, animate) {
    currentFeeling = feeling;
    if (animate) {
        btn.classList.add('feeling-btn--changing');
        setTimeout(() => {
            btn.querySelector('.feeling-word').textContent = feeling.word;
            btn.classList.remove('feeling-btn--changing');
        }, 150);
    } else {
        btn.querySelector('.feeling-word').textContent = feeling.word;
    }
}

function randomize() {
    const others = feelings.filter(f => f.word !== currentFeeling.word);
    if (others.length === 0) return;
    const next = others[Math.floor(Math.random() * others.length)];
    setFeeling(next, true);
}

btn.addEventListener('mouseenter', () => {
    if (hasHovered) {
        randomize();
    } else {
        hasHovered = true;
    }
});

btn.addEventListener('click', () => {
    if (currentFeeling) {
        // Only propagate theme via URL param when no cookie is set
        const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('theme='));
        const themeParam = hasCookie ? null : new URLSearchParams(window.location.search).get('theme');

        try {
            const u = new URL(currentFeeling.url, window.location.href);
            if (themeParam) u.searchParams.set('theme', themeParam);
            window.location.href = u.toString();
        } catch(e) {
            window.location.href = currentFeeling.url;
        }
    }
});

loadFeelings();
