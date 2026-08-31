/**
 * Professional News Broadcast Overlay Engine
 * Mode: 100% Force Live RSS Data (Controller Cannot Override News Content)
 * Features: 6-7 Words Punjabi Formatter, Multi-Proxy RSS, OBS Auto-Fit (up to 72px)
 */

// 1. ਮੁੱਢਲੀ ਕੌਨਫਿਗਰੇਸ਼ਨ
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
        lines: ["ਲਾਈਵ ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼ ਅੱਪਡੇਟ ਹੋ ਰਹੀ ਹੈ..."],
        subTickerText: "ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ • ਸਾਡੇ ਨਾਲ ਜੁੜੇ ਰਹੋ"
    }
};

// 2. ਸਿੱਧੀਆਂ ਪੰਜਾਬੀ RSS ਫੀਡਸ
const RSS_SOURCES = [
    "https://jagbani.punjabkesari.in/rss/punjab.xml",
    "https://jagbani.punjabkesari.in/rss/national.xml",
    "https://publish.tribuneindia.com/state/punjab/feed/"
];

// 3. 6 ਤੋਂ 7 ਸ਼ਬਦਾਂ ਵਿੱਚ ਬ੍ਰੇਕਿੰਗ ਲਾਈਨ ਫਾਰਮੈਟਰ
function formatToBreakingLength(headline) {
    if (!headline) return "";
    const cleanText = headline
        .replace(/[:|,\-–—"'\(\)\[\]#]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const words = cleanText.split(' ').filter(w => w.length > 0);
    if (words.length > 7) {
        return words.slice(0, 7).join(' ');
    }
    return words.join(' ');
}

// 4. DOM Builder
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
    
    // ਤੁਰੰਤ RSS ਖ਼ਬਰਾਂ ਲਿਆਓ
    fetchAllPunjabiFeeds();
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

// 5. ਮਲਟੀ-ਪ੍ਰੌਕਸੀ RSS ਫੈੱਚਰ (ਕਦੇ ਫੇਲ੍ਹ ਨਾ ਹੋਣ ਵਾਲਾ)
let allNewsItems = [];
let sideNewsIndex = 0;
let lowerNewsIndex = 0;
let isUpdatingSide = false;

async function fetchAllPunjabiFeeds() {
    let combined = [];

    for (const feedUrl of RSS_SOURCES) {
        let items = null;

        // ਕੋਸ਼ਿਸ਼ 1: rss2json
        try {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
            const data = await res.json();
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                items = data.items;
            }
        } catch (e) {}

        // ਕੋਸ਼ਿਸ਼ 2: allorigins proxy
        if (!items) {
            try {
                const res2 = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`);
                const data2 = await res2.json();
                if (data2.contents) {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(data2.contents, "text/xml");
                    const xmlItems = xml.querySelectorAll("item");
                    items = Array.from(xmlItems).map(it => ({
                        title: it.querySelector("title")?.textContent || "",
                        description: it.querySelector("description")?.textContent || ""
                    }));
                }
            } catch (e) {}
        }

        if (items && items.length > 0) {
            const list = items.slice(0, 4);
            for (let item of list) {
                let img = '';
                if (item.enclosure && item.enclosure.link) img = item.enclosure.link;
                else if (item.thumbnail) img = item.thumbnail;
                else if (item.description && item.description.includes('<img')) {
                    const m = item.description.match(/src=["'](.*?)["']/);
                    if (m) img = m[1];
                }

                if (item.title && item.title.trim().length > 0) {
                    const shortTitle = formatToBreakingLength(item.title);
                    combined.push({
                        shortTitle: shortTitle,
                        fullTitle: item.title,
                        image: img || BroadcastConfig.sideBreaking.imageUrl
                    });
                }
            }
        }
    }

    if (combined.length > 0) {
        allNewsItems = combined.sort(() => Math.random() - 0.5);
        
        // ਲੋਅਰ ਬੈਂਡ ਵਿੱਚ ਸਿਰਫ਼ RSS ਦਾ 6-7 ਸ਼ਬਦਾਂ ਵਾਲਾ ਡਾਟਾ ਹੀ ਜਾਵੇਗਾ
        BroadcastConfig.lowerBand.lines = allNewsItems.map(i => i.shortTitle);

        // ਹੇਠਲੇ ਟਿੱਕਰ ਵਿੱਚ ਪੂਰੀ ਖ਼ਬਰ ਚੱਲੇਗੀ
        const ticker = document.getElementById('sub-ticker-render');
        if (ticker) {
            ticker.innerText = allNewsItems.map(i => i.fullTitle).join("   ★★★   ");
            const speed = Math.max(80, Math.floor(ticker.innerText.length * 0.18));
            ticker.style.animationDuration = `${speed}s`;
        }

        // ਪਹਿਲੀ ਖ਼ਬਰ ਤੁਰੰਤ ਸਕ੍ਰੀਨ 'ਤੇ ਪਾਓ
        const slot = document.getElementById('lower-udt-slot');
        const textRender = document.getElementById('lower-line-text');
        const container = document.querySelector('.lower-headline-container');
        if (slot && textRender && container && BroadcastConfig.lowerBand.lines.length > 0) {
            textRender.innerText = BroadcastConfig.lowerBand.lines[0];
            fitHeadlineToOneLine(slot, container);
        }

        cycleSideRSS();
    }
}

// 6. ਸਾਈਡ ਪੈਨਲ ਰੋਟੇਸ਼ਨ (6-7 ਸ਼ਬਦ RSS)
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

// 7. OBS Auto-Fit Engine (Single Line)
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

// 8. ਕੰਟਰੋਲਰ ਸਿੰਕ (ਕੰਟਰੋਲਰ ਸਿਰਫ਼ ਸਟਾਈਲ ਬਦਲੇਗਾ, RSS ਦੀਆਂ ਖ਼ਬਰਾਂ ਨੂੰ ਨਹੀਂ ਛੇੜੇਗਾ)
function applyBroadcastState(newState) {
    if (!newState) return;

    if (newState.topBand) Object.assign(BroadcastConfig.topBand, newState.topBand);
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

setInterval(fetchAllPunjabiFeeds, 300000);
window.addEventListener('DOMContentLoaded', initBroadcastOverlay);
