/**
 * Professional News Broadcast Overlay Engine
 * Features:
 * - Fully Editable Top Band via Controller
 * - Google News Punjabi RSS with 6-7 Words Formatter
 * - OBS Safe Auto-Fit Single Line Engine (up to 72px)
 * - Dual Engine Live Controller Sync
 */

// ==========================================
// 1. ਮੁੱਢਲੀ ਕੌਨਫਿਗਰੇਸ਼ਨ
// ==========================================
const BroadcastConfig = {
    theme: { red: '#D50000', yellow: '#FFD000', white: '#FFFFFF', black: '#0D0D11' },
    liveBug: { enabled: true, channelName: "NEWS PUNJAB", tag: "LIVE" },
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
        captionText: "ਤਾਜ਼ਾ ਪੰਜਾਬੀ ਖ਼ਬਰਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ...",
        fontSize: "24px"
    },
    lowerBand: {
        enabled: true,
        badgeText: "BREAKING NEWS",
        fontSize: "32px",
        switchSpeed: 10000,
        lines: ["ਲਾਈਵ ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼ ਲੋਡ ਹੋ ਰਹੀ ਹੈ..."],
        subTickerText: "ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਲਾਈਵ ਜਾਰੀ • ਦੇਸ਼-ਵਿਦੇਸ਼ ਅਤੇ ਪੰਜਾਬ ਦੀ ਹਰ ਵੱਡੀ ਅੱਪਡੇਟ"
    }
};

const GOOGLE_PUNJABI_FEEDS = [
    "https://news.google.com/rss/headlines/section/topic/NATION?hl=pa-IN&gl=IN&ceid=IN:pa",
    "https://news.google.com/rss/search?q=punjab+when:1d&hl=pa-IN&gl=IN&ceid=IN:pa"
];

function formatToBreakingLength(headline) {
    if (!headline) return "";
    let clean = headline.split(' - ')[0];
    clean = clean.replace(/[:|,\-–—"'\(\)\[\]#]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = clean.split(' ').filter(w => w.length > 0);
    if (words.length > 7) {
        return words.slice(0, 7).join(' ');
    }
    return words.join(' ');
}

// ==========================================
// 2. DOM Builder
// ==========================================
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
                <span id="top-line-text">${BroadcastConfig.topBand.lines[0] || ""}</span>
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
    fetchGooglePunjabiNews();
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

// ==========================================
// 3. ਲਾਈਵ ਨਿਊਜ਼ ਇੰਜਣ
// ==========================================
let allNewsItems = [];
let sideNewsIndex = 0;
let lowerNewsIndex = 0;
let isUpdatingSide = false;

async function fetchGooglePunjabiNews() {
    let collectedItems = [];
    for (const feedUrl of GOOGLE_PUNJABI_FEEDS) {
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
            const res = await fetch(proxyUrl);
            const data = await res.json();
            if (data && data.contents) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, "text/xml");
                const items = xmlDoc.querySelectorAll("item");
                items.forEach((item, index) => {
                    if (index < 6) {
                        const rawTitle = item.querySelector("title")?.textContent || "";
                        if (rawTitle.trim().length > 0) {
                            const shortBreaking = formatToBreakingLength(rawTitle);
                            collectedItems.push({
                                shortTitle: shortBreaking,
                                fullTitle: rawTitle.split(' - ')[0],
                                image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80"
                            });
                        }
                    }
                });
            }
        } catch (e) {}
    }

    if (collectedItems.length === 0) {
        collectedItems = [
            { shortTitle: "ਪੰਜਾਬ ਸਰਕਾਰ ਵੱਲੋਂ ਨਵੀਂ ਨੀਤੀ ਦਾ ਐਲਾਨ", fullTitle: "ਪੰਜਾਬ ਸਰਕਾਰ ਵੱਲੋਂ ਸੂਬੇ ਦੇ ਵਿਕਾਸ ਲਈ ਨਵੀਂ ਨੀਤੀ ਦਾ ਐਲਾਨ ਕੀਤਾ ਗਿਆ" },
            { shortTitle: "ਮੰਤਰੀ ਮੰਡਲ ਦੀ ਮੀਟਿੰਗ ਵਿੱਚ ਅਹਿਮ ਫ਼ੈਸਲੇ", fullTitle: "ਮੰਤਰੀ ਮੰਡਲ ਦੀ ਉੱਚ ਪੱਧਰੀ ਮੀਟਿੰਗ ਵਿੱਚ ਕਈ ਵੱਡੇ ਲੋਕ-ਪੱਖੀ ਫ਼ੈਸਲੇ ਲਏ ਗਏ" },
            { shortTitle: "ਸੂਬੇ ਭਰ ਵਿੱਚ ਸੁਰੱਖਿਆ ਪ੍ਰਬੰਧ ਹੋਰ ਸਖ਼ਤ", fullTitle: "ਸੂਬੇ ਭਰ ਦੇ ਸਾਰੇ ਜ਼ਿਲ੍ਹਿਆਂ ਵਿੱਚ ਸੁਰੱਖਿਆ ਪ੍ਰਬੰਧ ਹੋਰ ਸਖ਼ਤ ਕਰਨ ਦੇ ਆਦੇਸ਼" },
            { shortTitle: "ਕਿਸਾਨਾਂ ਲਈ ਨਵੀਆਂ ਯੋਜਨਾਵਾਂ ਦੀ ਹੋਈ ਸ਼ੁਰੂਆਤ", fullTitle: "ਖੇਤੀਬਾੜੀ ਖੇਤਰ ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਨ ਲਈ ਕਿਸਾਨਾਂ ਲਈ ਨਵੀਆਂ ਯੋਜਨਾਵਾਂ ਦੀ ਸ਼ੁਰੂਆਤ" }
        ];
    }

    allNewsItems = collectedItems.sort(() => Math.random() - 0.5);
    BroadcastConfig.lowerBand.lines = allNewsItems.map(i => i.shortTitle);

    const ticker = document.getElementById('sub-ticker-render');
    if (ticker) {
        ticker.innerText = allNewsItems.map(i => i.fullTitle).join("   ★★★   ");
        const speed = Math.max(80, Math.floor(ticker.innerText.length * 0.18));
        ticker.style.animationDuration = `${speed}s`;
    }

    const slot = document.getElementById('lower-udt-slot');
    const textRender = document.getElementById('lower-line-text');
    const container = document.querySelector('.lower-headline-container');
    if (slot && textRender && container && BroadcastConfig.lowerBand.lines.length > 0) {
        textRender.innerText = BroadcastConfig.lowerBand.lines[0];
        fitHeadlineToOneLine(slot, container);
    }
    cycleSideRSS();
}

function cycleSideRSS() {
    if (allNewsItems.length === 0 || isUpdatingSide) return;
    isUpdatingSide = true;
    const cur = allNewsItems[sideNewsIndex];
    const sideImg = document.getElementById('side-img-render');
    const sideCaption = document.getElementById('side-caption-render');
    const sidePanel = document.getElementById('side-breaking');

    if (sidePanel) {
        sidePanel.style.opacity = '0.3';
        setTimeout(() => {
            if (cur.image && sideImg) sideImg.src = cur.image;
            if (cur.shortTitle && sideCaption) sideCaption.innerText = cur.shortTitle;
            sidePanel.style.opacity = '1';
            isUpdatingSide = false;
        }, 350);
    }
    sideNewsIndex = (sideNewsIndex + 1) % allNewsItems.length;
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

// ==========================================
// 4. ਟੌਪ ਬੈਂਡ ਐਨੀਮੇਸ਼ਨ ਇੰਜਣ (Editable Lines)
// ==========================================
let topUDTIndex = 0;
let topTimer = null;
let lowerTimer = null;
let sideTimer = null;

function cycleTopUDT() {
    const lines = BroadcastConfig.topBand.lines;
    if (!lines || lines.length === 0) return;

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

// ==========================================
// 5. ਕੰਟਰੋਲਰ ਸਿੰਕ (ਟੌਪ ਬੈਂਡ ਐਡੀਟੇਬਲ ਸਪੋਰਟ)
// ==========================================
function applyBroadcastState(newState) {
    if (!newState) return;

    // ਟੌਪ ਬੈਂਡ ਦੀਆਂ ਲਾਈਨਾਂ ਅਤੇ ਸੈਟਿੰਗਜ਼ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਲਾਈਵ ਅੱਪਡੇਟ ਕਰੋ
    if (newState.topBand) {
        BroadcastConfig.topBand.enabled = newState.topBand.enabled;
        BroadcastConfig.topBand.badgeText = newState.topBand.badgeText;
        BroadcastConfig.topBand.fontSize = newState.topBand.fontSize;
        BroadcastConfig.topBand.switchSpeed = newState.topBand.switchSpeed;
        
        if (newState.topBand.lines && newState.topBand.lines.length > 0) {
            BroadcastConfig.topBand.lines = newState.topBand.lines;
            const textRender = document.getElementById('top-line-text');
            if (textRender && BroadcastConfig.topBand.lines[topUDTIndex]) {
                textRender.innerText = BroadcastConfig.topBand.lines[topUDTIndex];
            }
        }
    }

    if (newState.sideBreaking) {
        BroadcastConfig.sideBreaking.enabled = newState.sideBreaking.enabled;
        BroadcastConfig.sideBreaking.position = newState.sideBreaking.position;
        BroadcastConfig.sideBreaking.tagText = newState.sideBreaking.tagText;
        BroadcastConfig.sideBreaking.fontSize = newState.sideBreaking.fontSize;
    }
    if (newState.liveBug) Object.assign(BroadcastConfig.liveBug, newState.liveBug);

    if (newState.lowerBand) {
        BroadcastConfig.lowerBand.enabled = newState.lowerBand.enabled;
        BroadcastConfig.lowerBand.badgeText = newState.lowerBand.badgeText;
        BroadcastConfig.lowerBand.fontSize = newState.lowerBand.fontSize;
        BroadcastConfig.lowerBand.switchSpeed = newState.lowerBand.switchSpeed;
    }

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
    const sideCaption = document.getElementById('side-caption-render');
    const sidePanel = document.getElementById('side-breaking');
    if (sideTag && BroadcastConfig.sideBreaking.tagText) sideTag.innerText = BroadcastConfig.sideBreaking.tagText;
    if (sideCaption && BroadcastConfig.sideBreaking.fontSize) sideCaption.style.fontSize = BroadcastConfig.sideBreaking.fontSize;
    if (sidePanel) {
        sidePanel.className = `mirror-sheen broadcast-border pos-${BroadcastConfig.sideBreaking.position}`;
        sidePanel.style.display = BroadcastConfig.sideBreaking.enabled ? 'block' : 'none';
    }

    const bugName = document.getElementById('live-bug-name-render');
    const bugPill = document.getElementById('live-bug-pill');
    if (bugName && BroadcastConfig.liveBug.channelName) bugName.innerText = BroadcastConfig.liveBug.channelName;
    if (bugPill) bugPill.style.display = BroadcastConfig.liveBug.enabled ? 'flex' : 'none';

    // ਰੀਸਟਾਰਟ ਟਾਈਮਰ ਜੇਕਰ ਸਪੀਡ ਬਦਲੀ ਹੋਵੇ
    startUDTEngines();
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

setInterval(fetchGooglePunjabiNews, 300000);
window.addEventListener('DOMContentLoaded', initBroadcastOverlay);
