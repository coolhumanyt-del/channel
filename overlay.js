/**
 * Professional News Broadcast Overlay Engine
 * Full Controller & Live RSS Reactive System
 */

const BroadcastConfig = {
    theme: { red: '#D50000', yellow: '#FFD000', white: '#FFFFFF', black: '#0D0D11' },
    liveBug: { enabled: true, channelName: "NEWS PUNJAB", tag: "LIVE" },
    topBand: {
        enabled: true,
        badgeText: "ਖ਼ਾਸ ਖ਼ਬਰਾਂ",
        fontSize: "36px",
        switchSpeed: 7000,
        lines: ["ਵੱਡੀ ਖ਼ਬਰ: ਅੱਜ ਦੀਆਂ ਮੁੱਖ ਗਤੀਵਿਧੀਆਂ 'ਤੇ ਵਿਸ਼ੇਸ਼ ਰਿਪੋਰਟ"]
    },
    fullPlate: {
        enabled: false,
        title: "ਵੱਡਾ ਖ਼ੁਲਾਸਾ: ਸੂਬਾ ਪੱਧਰੀ ਵਿਸ਼ੇਸ਼ ਰਿਪੋਰਟ",
        bullets: ["ਪਹਿਲਾ ਵੱਡਾ ਫ਼ੈਸਲਾ: ਤੁਰੰਤ ਪ੍ਰਭਾਵ ਨਾਲ ਨਵੀਆਂ ਹਦਾਇਤਾਂ ਲਾਗੂ"],
        imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80"
    },
    sideBreaking: {
        enabled: true,
        position: "left",
        tagText: "ਸਿੱਧੀਆਂ ਤਸਵੀਰਾਂ",
        imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
        captionText: "ਮੌਕੇ ਤੋਂ ਵੱਡੀ ਅੱਪਡੇਟ: ਪ੍ਰਸ਼ਾਸਨਿਕ ਟੀਮਾਂ ਤਾਇਨਾਤ",
        fontSize: "24px"
    },
    lowerBand: {
        enabled: true,
        badgeText: "BREAKING NEWS",
        fontSize: "32px",
        switchSpeed: 8000,
        lines: [
            "ਪੰਜਾਬ ਸਰਕਾਰ ਵੱਲੋਂ ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਦਾ ਐਲਾਨ",
            "ਮੰਤਰੀ ਮੰਡਲ ਦੀ ਮੀਟਿੰਗ ਵਿੱਚ ਲਏ ਗਏ ਅਹਿਮ ਫ਼ੈਸਲੇ"
        ],
        subTickerText: "ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਲਾਈਵ ਜਾਰੀ • ਦੇਸ਼-ਵਿਦੇਸ਼ ਅਤੇ ਪੰਜਾਬ ਦੀ ਹਰ ਵੱਡੀ ਅੱਪਡੇਟ"
    }
};

let topUDTIndex = 0;
let lowerNewsIndex = 0;
let topTimer = null;
let lowerTimer = null;

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
                <span id="top-line-text">${BroadcastConfig.topBand.lines[0] || ""}</span>
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

    // 5. Full Screen Graphic Plate
    const fullPlate = document.createElement('div');
    fullPlate.id = 'full-graphic-plate';
    fullPlate.className = 'mirror-sheen broadcast-border';
    fullPlate.style.display = 'none';
    fullPlate.innerHTML = `
        <div class="plate-top-bar">
            <span><i class="fa-solid fa-bullhorn"></i> SPECIAL BROADCAST REPORT</span>
            <span style="color:var(--color-yellow);">BREAKING UPDATE</span>
        </div>
        <div class="plate-content-grid">
            <div class="plate-text-side">
                <h1 id="plate-title-render">ਵੱਡਾ ਖ਼ੁਲਾਸਾ: ਸੂਬਾ ਪੱਧਰੀ ਵਿਸ਼ੇਸ਼ ਰਿਪੋਰਟ</h1>
                <ul id="plate-bullets-render" class="plate-bullet-list">
                    <li>ਪਹਿਲਾ ਵੱਡਾ ਫ਼ੈਸਲਾ: ਤੁਰੰਤ ਪ੍ਰਭਾਵ ਨਾਲ ਨਵੀਆਂ ਹਦਾਇਤਾਂ ਲਾਗੂ</li>
                </ul>
            </div>
            <div class="plate-media-side">
                <img id="plate-img-render" src="${BroadcastConfig.fullPlate.imageUrl}" alt="Graphic">
            </div>
        </div>
    `;

    container.appendChild(topBand);
    container.appendChild(liveBug);
    container.appendChild(sidePanel);
    container.appendChild(lowerBand);
    container.appendChild(fullPlate);
    root.appendChild(container);

    startLiveClock();
    startUDTEngines();
    setupSyncChannel();
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

    topTimer = setInterval(cycleTopUDT, BroadcastConfig.topBand.switchSpeed);
    lowerTimer = setInterval(cycleLowerUDT, BroadcastConfig.lowerBand.switchSpeed);
}

// Controller Live Update Listener
function applyBroadcastState(newState) {
    if (!newState) return;

    // 1. Top Band Lines
    if (newState.topBand) {
        BroadcastConfig.topBand.enabled = newState.topBand.enabled;
        BroadcastConfig.topBand.badgeText = newState.topBand.badgeText;
        BroadcastConfig.topBand.fontSize = newState.topBand.fontSize;
        if (newState.topBand.lines && newState.topBand.lines.length > 0) {
            BroadcastConfig.topBand.lines = newState.topBand.lines;
            topUDTIndex = 0;
            const textRender = document.getElementById('top-line-text');
            if (textRender) textRender.innerText = BroadcastConfig.topBand.lines[0];
        }

        const topBadge = document.getElementById('top-badge-render');
        const topSlot = document.getElementById('top-udt-slot');
        const topBand = document.getElementById('top-band');
        if (topBadge) topBadge.innerText = BroadcastConfig.topBand.badgeText;
        if (topSlot) topSlot.style.fontSize = BroadcastConfig.topBand.fontSize;
        if (topBand) topBand.style.display = BroadcastConfig.topBand.enabled ? 'flex' : 'none';
    }

    // 2. Full Plate Graphic Screen
    if (newState.fullPlate) {
        BroadcastConfig.fullPlate = newState.fullPlate;
        const plateEl = document.getElementById('full-graphic-plate');
        const plateTitle = document.getElementById('plate-title-render');
        const plateBullets = document.getElementById('plate-bullets-render');
        const plateImg = document.getElementById('plate-img-render');

        if (plateEl) plateEl.style.display = BroadcastConfig.fullPlate.enabled ? 'flex' : 'none';
        if (plateTitle) plateTitle.innerText = BroadcastConfig.fullPlate.title;
        if (plateImg && BroadcastConfig.fullPlate.imageUrl) plateImg.src = BroadcastConfig.fullPlate.imageUrl;
        if (plateBullets && BroadcastConfig.fullPlate.bullets) {
            plateBullets.innerHTML = BroadcastConfig.fullPlate.bullets.map(b => `<li>${b}</li>`).join('');
        }
    }

    // 3. Side Panel (Reactive Update)
    if (newState.sideBreaking) {
        BroadcastConfig.sideBreaking.enabled = newState.sideBreaking.enabled;
        BroadcastConfig.sideBreaking.position = newState.sideBreaking.position;
        BroadcastConfig.sideBreaking.tagText = newState.sideBreaking.tagText;
        BroadcastConfig.sideBreaking.fontSize = newState.sideBreaking.fontSize;
        if (newState.sideBreaking.captionText) BroadcastConfig.sideBreaking.captionText = newState.sideBreaking.captionText;
        if (newState.sideBreaking.imageUrl) BroadcastConfig.sideBreaking.imageUrl = newState.sideBreaking.imageUrl;

        const sideTag = document.getElementById('side-tag-render');
        const sideImg = document.getElementById('side-img-render');
        const sideCaption = document.getElementById('side-caption-render');
        const sidePanel = document.getElementById('side-breaking');

        if (sideTag) sideTag.innerText = BroadcastConfig.sideBreaking.tagText;
        if (sideImg && BroadcastConfig.sideBreaking.imageUrl) sideImg.src = BroadcastConfig.sideBreaking.imageUrl;
        if (sideCaption) {
            sideCaption.innerText = BroadcastConfig.sideBreaking.captionText;
            sideCaption.style.fontSize = BroadcastConfig.sideBreaking.fontSize;
        }
        if (sidePanel) {
            sidePanel.className = `mirror-sheen broadcast-border pos-${BroadcastConfig.sideBreaking.position}`;
            sidePanel.style.display = BroadcastConfig.sideBreaking.enabled ? 'block' : 'none';
        }
    }

    // 4. Lower Band (Reactive Lines & Ticker Update)
    if (newState.lowerBand) {
        BroadcastConfig.lowerBand.enabled = newState.lowerBand.enabled;
        BroadcastConfig.lowerBand.badgeText = newState.lowerBand.badgeText;
        BroadcastConfig.lowerBand.fontSize = newState.lowerBand.fontSize;
        if (newState.lowerBand.lines && newState.lowerBand.lines.length > 0) {
            BroadcastConfig.lowerBand.lines = newState.lowerBand.lines;
            lowerNewsIndex = 0;
            const textRender = document.getElementById('lower-line-text');
            if (textRender) textRender.innerText = BroadcastConfig.lowerBand.lines[0];
        }
        if (newState.lowerBand.subTickerText) {
            BroadcastConfig.lowerBand.subTickerText = newState.lowerBand.subTickerText;
            const ticker = document.getElementById('sub-ticker-render');
            if (ticker) {
                ticker.innerText = BroadcastConfig.lowerBand.subTickerText;
                const speed = Math.max(70, Math.floor(ticker.innerText.length * 0.18));
                ticker.style.animationDuration = `${speed}s`;
            }
        }

        const lowerBadge = document.getElementById('lower-badge-render');
        const lowerSlot = document.getElementById('lower-udt-slot');
        const lowerBand = document.getElementById('lower-band');

        if (lowerBadge) lowerBadge.innerText = BroadcastConfig.lowerBand.badgeText;
        if (lowerSlot) lowerSlot.style.fontSize = BroadcastConfig.lowerBand.fontSize;
        if (lowerBand) lowerBand.style.display = BroadcastConfig.lowerBand.enabled ? 'flex' : 'none';

        const container = document.querySelector('.lower-headline-container');
        if (container && lowerSlot) fitHeadlineToOneLine(lowerSlot, container);
    }

    // 5. Live Bug
    if (newState.liveBug) {
        BroadcastConfig.liveBug.channelName = newState.liveBug.channelName;
        const bugName = document.getElementById('live-bug-name-render');
        if (bugName) bugName.innerText = BroadcastConfig.liveBug.channelName;
    }

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
    }, 300);
}

window.addEventListener('DOMContentLoaded', initBroadcastOverlay);
