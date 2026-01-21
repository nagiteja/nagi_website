// Writing page: load Substack posts from RSS
const writingGrid = document.getElementById('writing-grid');
const writingStatus = document.getElementById('writing-status');

const SUBSTACK_FEED = 'https://nagiteja.substack.com/feed';
const ALL_ORIGINS = `https://api.allorigins.win/raw?url=${encodeURIComponent(SUBSTACK_FEED)}`;
const FALLBACK_POST = {
    title: 'Are stablecoins crypto’s biggest use case?',
    link: 'https://nagiteja.substack.com/p/are-stablecoins-cryptos-biggest-use',
    date: 'Jan 22, 2026',
    excerpt: 'Why stablecoins sit at the center of crypto utility, what makes them resilient, and where the risks still hide.',
    tag: 'Substack'
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
});

const truncateText = (text, maxLength = 140) => {
    if (!text || text.length <= maxLength) return text || '';
    const slice = text.slice(0, maxLength + 1);
    const lastSpace = slice.lastIndexOf(' ');
    const trimmed = lastSpace > 0 ? slice.slice(0, lastSpace) : slice.slice(0, maxLength);
    return `${trimmed.trim()}...`;
};

const htmlToText = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html || '';
    return (temp.textContent || '').replace(/\s+/g, ' ').trim();
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return '';
    return dateFormatter.format(parsed);
};

const createTile = ({ title, link, excerpt, date, tag }) => {
    const tile = document.createElement('a');
    tile.className = 'post-tile';
    tile.href = link;
    tile.target = '_blank';
    tile.rel = 'noopener noreferrer';

    const tagPill = document.createElement('span');
    tagPill.className = 'tag-pill';
    tagPill.textContent = tag || 'Substack';

    const titleEl = document.createElement('h3');
    titleEl.className = 'post-title';
    titleEl.textContent = title || 'Untitled';

    const excerptEl = document.createElement('p');
    excerptEl.className = 'post-excerpt';
    excerptEl.textContent = excerpt || '';

    const dateEl = document.createElement('span');
    dateEl.className = 'post-date';
    dateEl.textContent = date || '';

    tile.append(tagPill, titleEl, excerptEl, dateEl);
    return tile;
};

const renderSkeletons = (count = 6) => {
    writingGrid.innerHTML = '';
    for (let i = 0; i < count; i += 1) {
        const skeleton = document.createElement('div');
        skeleton.className = 'post-tile skeleton';
        skeleton.innerHTML = `
            <span class="tag-pill skeleton-block"></span>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
        `;
        writingGrid.appendChild(skeleton);
    }
};

const renderErrorState = () => {
    writingStatus.innerHTML = `
        <p class="writing-error">Couldn’t load posts right now.</p>
        <a class="btn btn-secondary writing-cta" href="https://nagiteja.substack.com" target="_blank" rel="noopener noreferrer">View on Substack</a>
    `;
    writingGrid.innerHTML = '';
    writingGrid.appendChild(createTile(FALLBACK_POST));
};

const parseFeed = (xmlText) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    if (xmlDoc.querySelector('parsererror')) {
        throw new Error('Invalid RSS feed');
    }
    const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 9);
    return items.map((item) => {
        const title = item.querySelector('title')?.textContent?.trim() || 'Untitled';
        const link = item.querySelector('link')?.textContent?.trim() || FALLBACK_POST.link;
        const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
        const description = item.querySelector('description')?.textContent || '';
        const category = item.querySelector('category')?.textContent?.trim() || 'Substack';
        const excerpt = truncateText(htmlToText(description), 140);
        return {
            title,
            link,
            date: formatDate(pubDate),
            excerpt,
            tag: category
        };
    });
};

const fetchFeed = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch feed');
    }
    return response.text();
};

const loadPosts = async () => {
    renderSkeletons();
    writingStatus.textContent = 'Loading posts...';
    try {
        const xmlText = await fetchFeed(SUBSTACK_FEED);
        const posts = parseFeed(xmlText);
        if (!posts.length) {
            throw new Error('Empty feed');
        }
        writingStatus.textContent = '';
        writingGrid.innerHTML = '';
        posts.forEach((post) => {
            writingGrid.appendChild(createTile(post));
        });
    } catch (error) {
        try {
            const xmlText = await fetchFeed(ALL_ORIGINS);
            const posts = parseFeed(xmlText);
            if (!posts.length) {
                throw new Error('Empty feed');
            }
            writingStatus.textContent = '';
            writingGrid.innerHTML = '';
            posts.forEach((post) => {
                writingGrid.appendChild(createTile(post));
            });
        } catch (fallbackError) {
            renderErrorState();
        }
    }
};

if (writingGrid) {
    loadPosts();
}
