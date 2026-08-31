/**
 * Professional News Broadcast Overlay Engine
 * Features: Cloud & Local Dual-Sync, 72px Font Support, Auto-Fit, UDT Flip
 */

const BroadcastConfig = {
    theme: {
        red: '#D50000',
        yellow: '#FFD000',
        white: '#FFFFFF',
        black: '#0D0D11'
    },
    liveBug: {
        enabled: true,
        channelName: "NEWS PUNJAB",
        tag: "LIVE"
    },
    topBand: {
        enabled: true,
        badgeText: "ਖ਼ਾਸ ਖ਼ਬਰਾਂ",
        fontSize: "36px",
        switchSpeed: 7000,
        lines: [
            "ਵੱਡੀ ਖ਼ਬਰ: ਅੱਜ ਦੀਆਂ ਮੁੱਖ ਗਤੀਵਿਧੀਆਂ 'ਤੇ ਵਿਸ਼ੇਸ਼ ਰਿਪੋਰਟ",
            "ਪ੍ਰਸ਼ਾਸਨ ਵੱਲੋਂ ਨਵੀਂ ਰਣਨੀਤੀ ਤਿਆਰ, ਸੁਰੱਖਿਆ ਪ੍ਰਬੰਧ ਸਖ਼ਤ",
            "ਵੱਖ-ਵੱਖ ਜ਼ਿਲ੍ਹਿਆਂ ਤੋਂ ਤਾਜ਼ਾ ਅੰਕੜੇ ਅਤੇ ਰਿਪੋਰਟਾਂ ਸਾਹਮਣੇ ਆਈਆਂ",
            "ਵਿਸ਼ੇਸ਼ ਲਾਈਵ ਚਰਚਾ: ਮਾਹਿਰਾਂ ਦੀ ਟੀਮ ਸਾਡੇ ਨਾਲ ਜੁੜ ਚੁੱਕੀ ਹੈ"
        ]
    },
    sideBreaking: {
        enabled: true,
        position: "left",
        tagText: "ਸਿੱਧੀਆਂ ਤਸਵੀਰਾਂ",
        imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
        captionText: "ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ...",
        fontSize: "24px"
    },
    lowerBand: {
        enabled: true,
        badgeText: "BREAKING NEWS",
        fontSize: "32px",
        switchSpeed: 10000,
        lines: ["ਲਾਈਵ ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼ ਅੱਪਡੇਟ ਹੋ ਰਹੀ ਹੈ..."],
        subTickerText: "ਸਾਡੇ ਚੈਨਲ ਨੂੰ ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ ਅਤੇ ਬੈੱਲ ਆਈਕਨ ਦਬਾਓ • ਤਾਜ਼ਾ ਅੱਪਡੇਟਸ ਲਗਾਤਾਰ ਜਾਰੀ"
    }
};

const RSS_SOURCES = [
    { name: "Bhaskar", url: "https://www.bhaskar.com/rss-v1--category-1743.xml", lang: "hi" },
    { name: "Tribune Punjab", url: "https://publish.tribuneindia.com/state/punjab/feed/", lang: "en" },
    { name: "Tribune India", url: "https://publish.tribuneindia.com/newscategory/india/feed/", lang: "en" },
    { name: "ANI Politics", url: "https://aninews.in/rss/feed/category/national/politics.xml", lang: "en" }
];

function initBroadcastOverlay() {
    const root = document.getElementById('obs-overlay-root') || document.body;
    root.innerHTML = '';

    const container = document.createElement('div');
    container.id = 'obs-canvas';

    const topBand = document.createElement('div');
    topBand.id = 'top-band';
    topBand.className = 'mirror-sheen broadcast-border';
    topBand.innerHTML = `
        <div class="top-badge">
            <i class="fa-solid fa-bolt"></i>
            <span id="top-badge-render">${BroadcastConfig.topBand.badgeText}</span>
        </div>
        <div class="top-content-wrapper">
            <div class="udt-text-slot udt-active" id="top-udt-slot" style="font-size: ${BroadcastConfig.topBand.fontSize};">
                <span class="udt-bullet"></span>
                <span id="top-line-text">${BroadcastConfig.topBand.lines[0]}</span>
            </div>
        </div>
        <div class="top-live-clock" id="top-live-clock">00:00:00</div>
    `;

    const liveBug = document.createElement('div');
    liveBug.id = 'live-bug-pill';
    liveBug.className = 'broadcast-border';
    liveBug.innerHTML = `
        <div class="live-dot"></div>
        <div class="live-bug-tag">${BroadcastConfig.liveBug.tag}</div>
        <div class="live-bug-name" id="live-bug-name-render">${BroadcastConfig.liveBug.channelName}</div>
    `;

    const sidePanel = document.createElement('div');
    sidePanel.id = 'side-breaking';
    sidePanel.className = `mirror-sheen broadcast-border pos-${BroadcastConfig.sideBreaking.position}`;
    sidePanel.innerHTML = `
        <div class="side-header">
            <span><i class="fa-solid fa-camera"></i> <span id="side-tag-render">${BroadcastConfig.sideBreaking.tagText}</span></span>
            <span style="color: #FFFFFF; font-size: 13px; font-weight: 800;">LIVE UPDATE</span>
        </div>
        <div class="side-photo-box">
            <img id="side-img-render" src="${BroadcastConfig.sideBreaking.imageUrl}" alt="News Event">
            <div class="side-photo-overlay"></div>
        </div>
        <div class="side-caption-box">
            <div class="side-caption-text" id="side-caption-render" style="font-size: ${BroadcastConfig.sideBreaking.fontSize};">
                ${BroadcastConfig.sideBreaking.captionText}
            </div>
        </div>
    `;

    const lowerBand = document.createElement('div');
    lowerBand.id = 'lower-band';
    lowerBand.className = 'mirror-sheen broadcast-border';
    lowerBand.innerHTML = `
        <div class="lower-main-row">
            <div class="lower-breaking-badge">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span id="lower-badge-render">${BroadcastConfig.lowerBand.badgeText}</span>
            </div>
            <div class="lower-headline-container">
                <div class="lower-headline-slot udt-active" id="lower-udt-slot" style="font-size: ${BroadcastConfig.lowerBand.fontSize};">
                    <span id="lower-line-text">${BroadcastConfig.lowerBand.lines[0]}</span>
                </div>
            </div>
        </div>
        <div class="lower-sub-row">
            <div class="sub-ticker-label">ਤਾਜ਼ਾ ਅੱਪਡੇਟ</div>
            <div class="sub-ticker-text-wrapper">
                <div class="sub-ticker-text" id="sub-ticker-render">${BroadcastConfig.lowerBand.subTickerText}</div>
            </div>
        </div>
    `;

    container.appendChild(topBand);
    container.appendChild(liveBug);
    container.appendChild(sidePanel);
    container.appendChild(lowerBand);
    root.appendChild(container);

    startLiveClock();
    startUDTEngines();
    setupSyncChannel();
    fetchAllMultiFeeds();
}

function startLiveClock() {
    function update() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const clockEl = document.getElementById('top-live-clock');
        if (clockEl) clockEl.innerText = `${hh}:${mm}:${ss}`;
    }
    setInterval(update, 1000);
    update();
}

async function translateToPunjabi(text, sourceLang = 'auto') {
    if (!text || text.trim() === '') return "";
    try {
        const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=pa&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(gUrl);
        if (res.ok) {
            const data = await res.json();
            if (data && data[0]) {
                const trans = data[0].map(item => item[0]).join('').trim();
                if (trans) return trans;
            }
        }
    } catch (e) {}

    try {
        const langPair = (sourceLang === 'hi' ? 'hi|pa' : 'en|pa');
        const mUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
        const res2 = await fetch(mUrl);
        if (res2.ok) {
            const data2 = await res2.json();
            if (data2.responseData && data2.responseData.translatedText) {
                return data2.responseData.translatedText.trim();
            }
        }
    } catch (err) {}

    return text;
}

let allTranslatedNews = [];
let sideNewsIndex = 0;
let lowerNewsIndex = 0;
let isUpdatingSide = false;

async function fetchAllMultiFeeds() {
    let combinedItems = [];
    for (const source of RSS_SOURCES) {
        try {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === 'ok' && data.items && data.items.length > 0) {
                const sliced = data.items.slice(0, 3);
                for (let item of sliced) {
                    let img = '';
                    if (item.enclosure && item.enclosure.link) img = item.enclosure.link;
                    else if (item.thumbnail) img = item.thumbnail;
                    else if (item.description && item.description.includes('<img')) {
                        const match = item.description.match(/src=["'](.*?)["']/);
                        if (match) img = match[1];
                    }

                    if (img) {
                        const pre = new Image();
                        pre.src = img;
                    }

                    const punjabiTitle = await translateToPunjabi(item.title, source.lang);
                    combinedItems.push({
                        title: punjabiTitle,
                        image: img || BroadcastConfig.sideBreaking.imageUrl,
                        source: source.name
                    });
                }
            }
        } catch (err) {}
    }

    if (combinedItems.length > 0) {
        allTranslatedNews = combinedItems.sort(() => Math.random() - 0.5);
        if (!BroadcastConfig.lowerBand.customLines || BroadcastConfig.lowerBand.customLines.length === 0) {
            BroadcastConfig.lowerBand.lines = allTranslatedNews.map(i => i.title);
        }

        const tickerElement = document.getElementById('sub-ticker-render');
        if (tickerElement) {
            tickerElement.innerText = allTranslatedNews.map(i => i.title).join("   ★★★   ");
            const calculatedSpeed = Math.max(80, Math.floor(tickerElement.innerText.length * 0.18));
            tickerElement.style.animationDuration = `${calculatedSpeed}s`;
        }
        cycleSideRSS();
    }
}

function cycleSideRSS() {
    if (allTranslatedNews.length === 0 || isUpdatingSide) return;
    isUpdatingSide = true;

    const current = allTranslatedNews[sideNewsIndex];
    const sideImg = document.getElementById('side-img-render');
    const sideCaption = document.getElementById('side-caption-render');
    const sidePanel = document.getElementById('side-breaking');

    if (sidePanel) {
        sidePanel.style.opacity = '0.3';
        setTimeout(() => {
            if (current.image && sideImg) sideImg.src = current.image;
            if (current.title && sideCaption) sideCaption.innerText = current.title;
            sidePanel.style.opacity = '1';
            isUpdatingSide = false;
        }, 350);
    }
    sideNewsIndex = (sideNewsIndex + 1) % allTranslatedNews.length;
}

function fitHeadlineToOneLine(slotElement, containerElement) {
    if (!slotElement || !containerElement) return;
    const textSpan = slotElement.querySelector('span') || slotElement;
    let currentFontSize = parseInt(BroadcastConfig.lowerBand.fontSize, 10) || 32;
    const minFontSize = 19;

    slotElement.style.fontSize = `${currentFontSize}px`;
    const maxWidth = containerElement.getBoundingClientRect().width - 50;

    while (textSpan.getBoundingClientRect().width > maxWidth && currentFontSize > minFontSize) {
        currentFontSize -= 1;
        slotElement.style.fontSize = `${currentFontSize}px`;
    }
}

let topUDTIndex = 0;
let topTimer = null;
let lowerTimer = null;
let sideTimer = null;

function cycleTopUDT() {
    const lines = BroadcastConfig.topBand.lines;
    if (!lines || lines.length <= 1) return;

    const slot = document.getElementById('top-udt-slot');
    const textRender = document.getElementById('top-line-text');
    if (!slot || !textRender) return;

    slot.className = 'udt-text-slot udt-exit-down';
    setTimeout(() => {
        topUDTIndex = (topUDTIndex + 1) % lines.length;
        textRender.innerText = lines[topUDTIndex];
        slot.className = 'udt-text-slot udt-enter-down';
        setTimeout(() => { slot.className = 'udt-text-slot udt-active'; }, 50);
    }, 600);
}

function cycleLowerUDT() {
    const lines = BroadcastConfig.lowerBand.lines;
    if (!lines || lines.length === 0) return;

    const container = document.querySelector('.lower-headline-container');
    const slot = document.getElementById('lower-udt-slot');
    const textRender = document.getElementById('lower-line-text');
    if (!slot || !textRender || !container) return;

    slot.className = 'lower-headline-slot udt-exit-down';
    setTimeout(() => {
        lowerNewsIndex = (lowerNewsIndex + 1) % lines.length;
        textRender.innerText = lines[lowerNewsIndex];
        fitHeadlineToOneLine(slot, container);
        slot.className = 'lower-headline-slot udt-enter-down';
        setTimeout(() => { slot.className = 'lower-headline-slot udt-active'; }, 50);
    }, 600);
}

function startUDTEngines() {
    if (topTimer) clearInterval(topTimer);
    if (lowerTimer) clearInterval(lowerTimer);
    if (sideTimer) clearInterval(sideTimer);

    topTimer = setInterval(cycleTopUDT, BroadcastConfig.topBand.switchSpeed);
    lowerTimer = setInterval(cycleLowerUDT, BroadcastConfig.lowerBand.switchSpeed);
    sideTimer = setInterval(cycleSideRSS, 14000);
}

function applyBroadcastState(newState) {
    if (!newState) return;
    Object.assign(BroadcastConfig, newState);

    const topBadge = document.getElementById('top-badge-render');
    const topSlot = document.getElementById('top-udt-slot');
    const topBand = document.getElementById('top-band');
    if (topBadge && BroadcastConfig.topBand.badgeText) topBadge.innerText = BroadcastConfig.topBand.badgeText;
    if (topSlot && BroadcastConfig.topBand.fontSize) topSlot.style.fontSize = BroadcastConfig.topBand.fontSize;
    if (topBand) topBand.style.display = BroadcastConfig.topBand.enabled ? 'flex' : 'none';

    const lowerBadge = document.getElementById('lower-badge-render');
    const lowerSlot = document.getElementById('lower-udt-slot');
    const lowerBand = document.getElementById('lower-band');
    if (lowerBadge && BroadcastConfig.lowerBand.badgeText) lowerBadge.innerText = BroadcastConfig.lowerBand.badgeText;
    if (lowerSlot && BroadcastConfig.lowerBand.fontSize) lowerSlot.style.fontSize = BroadcastConfig.lowerBand.fontSize;
    if (lowerBand) lowerBand.style.display = BroadcastConfig.lowerBand.enabled ? 'flex' : 'none';

    const sideTag = document.getElementById('side-tag-render');
    const sideImg = document.getElementById('side-img-render');
    const sideCaption = document.getElementById('side-caption-render');
    const sidePanel = document.getElementById('side-breaking');
    if (sideTag && BroadcastConfig.sideBreaking.tagText) sideTag.innerText = BroadcastConfig.sideBreaking.tagText;
    if (sideImg && BroadcastConfig.sideBreaking.imageUrl) sideImg.src = BroadcastConfig.sideBreaking.imageUrl;
    if (sideCaption) {
        if (BroadcastConfig.sideBreaking.captionText) sideCaption.innerText = BroadcastConfig.sideBreaking.captionText;
        if (BroadcastConfig.sideBreaking.fontSize) sideCaption.style.fontSize = BroadcastConfig.sideBreaking.fontSize;
    }
    if (sidePanel) {
        sidePanel.className = `mirror-sheen broadcast-border pos-${BroadcastConfig.sideBreaking.position}`;
        sidePanel.style.display = BroadcastConfig.sideBreaking.enabled ? 'block' : 'none';
    }

    const bugName = document.getElementById('live-bug-name-render');
    const bugPill = document.getElementById('live-bug-pill');
    if (bugName && BroadcastConfig.liveBug.channelName) bugName.innerText = BroadcastConfig.liveBug.channelName;
    if (bugPill) bugPill.style.display = BroadcastConfig.liveBug.enabled ? 'flex' : 'none';

    const container = document.querySelector('.lower-headline-container');
    if (container && lowerSlot) fitHeadlineToOneLine(lowerSlot, container);
}

function setupSyncChannel() {
    try {
        const syncChannel = new BroadcastChannel('news_studio_sync');
        syncChannel.onmessage = (event) => {
            if (event.data && event.data.type === 'UPDATE_BROADCAST') {
                applyBroadcastState(event.data.config);
            }
        };
    } catch (e) {}

    window.addEventListener('storage', (e) => {
        if (e.key === 'broadcast_studio_state' && e.newValue) {
            try { applyBroadcastState(JSON.parse(e.newValue)); } catch (err) {}
        }
    });

    let lastState = localStorage.getItem('broadcast_studio_state');
    if (lastState) {
        try { applyBroadcastState(JSON.parse(lastState)); } catch(e){}
    }

    setInterval(() => {
        const cur = localStorage.getItem('broadcast_studio_state');
        if (cur && cur !== lastState) {
            lastState = cur;
            try { applyBroadcastState(JSON.parse(cur)); } catch (e) {}
        }
    }, 400);
}

setInterval(fetchAllMultiFeeds, 360000);
window.addEventListener('DOMContentLoaded', initBroadcastOverlay);
