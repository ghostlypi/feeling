const articlesPerPage = 5;
let currentPage = 0;
let articles = [];
let isLoading = false;
const loadingIndicator = document.getElementById('loading');

function appendArticles(page) {
    const articleContainer = document.getElementById('articles');
    const start = page * articlesPerPage;
    const end = start + articlesPerPage;
    const articlesToRender = articles.slice(start, end);

    if (articlesToRender.length === 0) {
        loadingIndicator.style.display = 'none';
        return;
    }

    const searchParams = window.location.search;

    for (const article of articlesToRender) {
        const articleElement = document.createElement('a');
        articleElement.href = `../${article.url}${searchParams}`;
        articleElement.innerHTML = `
            <div class="blog-card">
                <h2 style="text-align: center;">${article.title}</h2>
                <div style="padding-left: 20px; text-align: center">
                    <span style="color: grey;">Published: ${article.date}</span>
                </div>
                <p style="padding-left: 20px; padding-right: 20px">${article.preview}</p>
            </div>
        `;
        articleContainer.appendChild(articleElement);
    }
    currentPage++;
}

function loadMoreArticles() {
    if (isLoading || (currentPage * articlesPerPage >= articles.length)) {
        return;
    }

    isLoading = true;
    loadingIndicator.style.display = 'block';

    setTimeout(() => {
        appendArticles(currentPage);
        isLoading = false;
        loadingIndicator.style.display = 'none';
    }, 500);
}

fetch('../blog/articles.json')
    .then(response => response.json())
    .then(data => {
        articles = data;
        appendArticles(currentPage);
    });

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreArticles();
    }
});
