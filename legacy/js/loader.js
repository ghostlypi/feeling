document.addEventListener("DOMContentLoaded", function() {
    const loaderWrapper = document.getElementById('loader-wrapper');
    const liquid = document.getElementById('liquid');
    const bubblesContainer = document.getElementById('bubbles');
    let bubbleInterval;

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        const size = Math.random() * 6 + 3 + 'px';
        bubble.style.width = size;
        bubble.style.height = size;

        // Random position within the liquid height
        bubble.style.top = Math.random() * 90 + 5 + '%';

        bubble.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        bubble.style.animationDelay = Math.random() * 0.2 + 's';

        bubblesContainer.appendChild(bubble);

        // Remove bubble after animation
        setTimeout(() => {
            bubble.remove();
        }, 2000);
    }

    function startBubbles() {
        if (bubbleInterval) clearInterval(bubbleInterval);
        bubbleInterval = setInterval(createBubble, 100);
    }

    function stopBubbles() {
        if (bubbleInterval) clearInterval(bubbleInterval);
    }

    // Start bubbles initially
    startBubbles();

    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        // Increment progress randomly
        progress += Math.random() * 15;
        if (progress > 33) progress = 33; // Cap at 33% until fully loaded

        liquid.style.width = progress + '%';
    }, 200);

    window.addEventListener('load', function() {
        clearInterval(interval);
        
        // Finish loading animation
        liquid.style.transition = 'width 0.4s cubic-bezier(0.1, 0.7, 1.0, 0.1)';
        liquid.style.width = '100%';
        
        setTimeout(() => {
            liquid.classList.add('finished');
            stopBubbles();
            
            // Fade out loader
            setTimeout(() => {
                loaderWrapper.classList.add('loaded');
            }, 500);
        }, 400);
    });
});
