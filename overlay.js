/**
 * Professional News Broadcast Overlay Engine with Multi-Source Punjabi Translation
 * Sources: Dainik Bhaskar, The Tribune (Punjab & India), ANI Politics
 * Features: Auto Translation (English/Hindi -> Punjabi), Smart Image Finder, Dynamic Slow Ticker, Auto-Fit Single Line
 */

// ==========================================
// 1. ਮੁੱਢਲੀ ਕੌਨਫਿਗਰੇਸ਼ਨ (Broadcast Settings)
// ==========================================
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
        fontSize: "24px",
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
        fontSize: "20px"
    },
    lowerBand: {
        enabled: true,
        badgeText: "BREAKING NEWS",
        fontSize: "26px",
        switchSpeed: 10000, // 10 ਸਕਿੰਟ UDT ਫਲਿੱਪ
        lines: ["ਲਾਈਵ ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼ ਅੱਪਡੇਟ ਹੋ ਰਹੀ ਹੈ..."],
        subTickerText: "ਸਾਡੇ ਚੈਨਲ ਨੂੰ ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ ਅਤੇ ਬੈੱਲ ਆਈਕਨ ਦਬਾਓ • ਤਾਜ਼ਾ ਅੱਪਡੇਟਸ ਲਗਾਤਾਰ ਜਾਰੀ"
    }
};

// ==========================================
// 2. RSS ਫੀਡ ਲਿੰਕਸ (Multi-Source Feeds)
// ==========================================
const RSS_SOURCES = [
    { name: "Bhaskar", url: "https://www.bhaskar.com/rss-v1--category-1743.xml", lang: "hi" },
    { name: "Tribune Punjab", url: "https://publish.tribuneindia.com/state/punjab/feed/", lang: "en" },
    { name: "Tribune India", url: "https://publish.tribuneindia.com/newscategory/india/feed/", lang: "en" },
    { name: "ANI Politics", url: "https://aninews.in/rss/feed/category/national/politics.xml", lang: "en" }
];

// ==========================================
// 3. DOM Builder (ਸਕ੍ਰੀਨ ਐਲੀਮੈਂਟਸ)
// ==========================================
function initBroadcastOverlay() {
    const root = document.getElementById('obs-overlay-root') || document.body;
    root.innerHTML = '';

    const container = document.createElement('div');
    container.id = 'obs-canvas';

    // 1. Top Band
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

    // 2. Live Bug
    const liveBug = document.createElement('div');
    liveBug.id = 'live-bug-pill';
    liveBug.className = 'broadcast-border';
    liveBug.innerHTML = `
        <div class="live-dot"></div>
        <div class="live-bug-tag">${BroadcastConfig.liveBug.tag}</div>
        <div class="live-bug-name" id="live-bug-name-render">${BroadcastConfig.liveBug.channelName}</div>
    `;

    // 3. Side Breaking Panel
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

    // 4. Lower Breaking Band
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
    
    // ਮਲਟੀ-ਸੋਰਸ RSS ਫੈੱਚ ਅਤੇ ਅਨੁਵਾਦ ਸ਼ੁਰੂ ਕਰੋ
    fetchAllMultiFeeds();
}

// ==========================================
// 4. ਲਾਈਵ ਕਲਾਕ
// ==========================================
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

// ==========================================
// 5. ਹਿੰਦੀ/ਅੰਗਰੇਜ਼ੀ ਤੋਂ ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਇੰਜਣ
// ==========================================
async function translateToPunjabi(text, sourceLang = 'auto') {
    if (!text || text.trim() === '') return "";
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=pa&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data[0]) {
            return data[0].map(item => item[0]).join('').trim();
        }
    } catch (e) {
        console.warn("Translation fallback for:", text);
    }
    return text;
}

// ==========================================
// 6. ਮਲਟੀ-RSS ਫੈੱਚ ਅਤੇ ਕੈਸ਼ਿੰਗ ਲੌਜਿਕ
// ==========================================
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
        } catch (err) {
            console.warn(`ਫੀਡ ਫੈੱਚ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ (${source.name}):`, err);
        }
    }

    if (combinedItems.length > 0) {
        allTranslatedNews = combinedItems.sort(() => Math.random() - 0.5);
        BroadcastConfig.lowerBand.lines = allTranslatedNews.map(i => i.title);

        const tickerElement = document.getElementById('sub-ticker-render');
        if (tickerElement) {
            tickerElement.innerText = allTranslatedNews.map(i => i.title).join("   ★★★   ");
            const calculatedSpeed = Math.max(80, Math.floor(tickerElement.innerText.length * 0.18));
            tickerElement.style.animationDuration = `${calculatedSpeed}s`;
        }

        cycleSideRSS();
        
        // Initial fit for lower headline
        const container = document.querySelector('.lower-headline-container');
        const slot = document.getElementById('lower-udt-slot');
        const textRender = document.getElementById('lower-line-text');
        if (container && slot && textRender && BroadcastConfig.lowerBand.lines.length > 0) {
            textRender.innerText = BroadcastConfig.lowerBand.lines[0];
            fitHeadlineToOneLine(slot, container);
        }
    }
}

// 7. ਸਾਈਡ ਬ੍ਰੇਕਿੰਗ ਪੈਨਲ ਰੋਟੇਸ਼ਨ (Zero-Lag)
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

// ==========================================
// 8. ਆਟੋ-ਫਿੱਟ ਸਿੰਗਲ ਲਾਈਨ ਅਤੇ UDT ਫਲਿੱਪ ਇੰਜਣ
// ==========================================

// ਟੈਕਸਟ ਨੂੰ ਇੱਕੋ ਲਾਈਨ ਵਿੱਚ ਫਿੱਟ ਕਰਨ ਲਈ ਆਟੋ-ਫੌਂਟ ਰਿਸਾਈਜ਼ਰ ਫੰਕਸ਼ਨ
function fitHeadlineToOneLine(element, container) {
    if (!element || !container) return;

    let maxFontSize = parseInt(BroadcastConfig.lowerBand.fontSize, 10) || 26;
    const minFontSize = 19; // ਮਿਨੀਮਮ 14pt (19px) ਦਾ ਨਿਯਮ

    element.style.fontSize = `${maxFontSize}px`;

    const availableWidth = container.clientWidth - 50; // ਪੈਡਿੰਗ ਕੱਢ ਕੇ ਬਾਕੀ ਜਗ੍ਹਾ

    // ਜਦੋਂ ਤੱਕ ਟੈਕਸਟ ਚੌੜਾਈ ਤੋਂ ਵੱਡਾ ਹੈ, ਫੌਂਟ ਸਾਈਜ਼ ਘਟਾਓ
    while (element.scrollWidth > availableWidth && maxFontSize > minFontSize) {
        maxFontSize -= 1;
        element.style.fontSize = `${maxFontSize}px`;
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

// ਅੱਪਡੇਟਿਡ Lower UDT ਫਲਿੱਪ ਇੰਜਣ
function cycleLowerUDT() {
    const lines = BroadcastConfig.lowerBand.lines;
    if (!lines || lines.length === 0) return;

    const container = document.querySelector('.lower-headline-container');
    const slot = document.getElementById('lower-udt-slot');
    const textRender = document.getElementById('lower-line-text');
    if (!slot || !textRender || !container) return;

    // ਪੁਰਾਣੀ ਲਾਈਨ ਹੇਠਾਂ ਵੱਲ ਮਿਰਰ ਫਲਿੱਪ ਹੋਵੇਗੀ
    slot.className = 'lower-headline-slot udt-exit-down';

    setTimeout(() => {
        lowerNewsIndex = (lowerNewsIndex + 1) % lines.length;
        textRender.innerText = lines[lowerNewsIndex];

        // ਨਵੀਂ ਖ਼ਬਰ ਨੂੰ ਇੱਕੋ ਲਾਈਨ ਵਿੱਚ ਆਟੋਮੈਟਿਕ ਫਿੱਟ ਕਰੋ
        fitHeadlineToOneLine(slot, container);

        slot.className = 'lower-headline-slot udt-enter-down';

        setTimeout(() => {
            slot.className = 'lower-headline-slot udt-active';
        }, 50);
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

// ==========================================
// 9. ਕੰਟਰੋਲਰ ਸਿੰਕ
// ==========================================
function setupSyncChannel() {
    const syncChannel = new BroadcastChannel('news_studio_sync');
    syncChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'UPDATE_BROADCAST') {
            const newState = event.data.config;
            Object.assign(BroadcastConfig, newState);
            
            document.getElementById('top-badge-render').innerText = BroadcastConfig.topBand.badgeText;
            document.getElementById('top-udt-slot').style.fontSize = BroadcastConfig.topBand.fontSize;
            document.getElementById('lower-badge-render').innerText = BroadcastConfig.lowerBand.badgeText;
            document.getElementById('lower-udt-slot').style.fontSize = BroadcastConfig.lowerBand.fontSize;
            document.getElementById('live-bug-name-render').innerText = BroadcastConfig.liveBug.channelName;
            document.getElementById('side-tag-render').innerText = BroadcastConfig.sideBreaking.tagText;
            document.getElementById('side-breaking').className = `mirror-sheen broadcast-border pos-${BroadcastConfig.sideBreaking.position}`;

            const container = document.querySelector('.lower-headline-container');
            const slot = document.getElementById('lower-udt-slot');
            if (container && slot) fitHeadlineToOneLine(slot, container);

            startUDTEngines();
        }
    };
}

// ਹਰ 6 ਮਿੰਟ ਬਾਅਦ ਸਾਰੀਆਂ ਫੀਡਸ ਬੈਕਗਰਾਊਂਡ ਵਿੱਚ ਆਟੋਮੈਟਿਕ ਅੱਪਡੇਟ ਹੋਣਗੀਆਂ
setInterval(fetchAllMultiFeeds, 360000);

window.addEventListener('DOMContentLoaded', initBroadcastOverlay);
