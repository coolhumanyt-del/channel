/**
 * News Studio Master Controller Logic
 * Features: Direct RSS to Side & Lower Breaking with Auto-Translation & Image Extraction
 */

const syncChannel = new BroadcastChannel('news_studio_sync');

function updateLbl(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val + 'px';
}

function formatToBreakingLength(headline) {
    if (!headline) return "";
    let clean = headline.split(' - ')[0];
    clean = clean.replace(/[:|,\-–—"'\(\)\[\]#]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = clean.split(' ').filter(w => w.length > 0);
    if (words.length > 7) return words.slice(0, 7).join(' ');
    return words.join(' ');
}

// Multi-Engine Punjabi Translator
async function translateToPunjabi(text) {
    if (!text || text.trim() === '') return "";
    
    // Engine 1: Google Client Translate
    try {
        const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pa&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(gUrl);
        if (res.ok) {
            const data = await res.json();
            if (data && data[0]) {
                const trans = data[0].map(item => item[0]).join('').trim();
                if (trans) return trans;
            }
        }
    } catch (e) {}

    // Engine 2: AllOrigins CORS Proxy Fallback
    try {
        const target = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pa&dt=t&q=${encodeURIComponent(text)}`;
        const pUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
        const res2 = await fetch(pUrl);
        if (res2.ok) {
            const data2 = await res2.json();
            if (data2 && data2[0]) {
                const trans2 = data2[0].map(item => item[0]).join('').trim();
                if (trans2) return trans2;
            }
        }
    } catch (err) {}

    return text;
}

// RSS Fetch & Translation Router
async function fetchAndTranslateRSS(target) {
    const url = document.getElementById('rss-source-select').value;
    const status = document.getElementById('rss-status');
    status.innerText = "Fetching & Translating...";
    status.style.color = "#FFD000";

    try {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        let newsItems = [];

        if (data.status === 'ok' && data.items && data.items.length > 0) {
            for (let it of data.items.slice(0, 8)) {
                let img = '';
                if (it.enclosure && it.enclosure.link) img = it.enclosure.link;
                else if (it.thumbnail) img = it.thumbnail;
                else if (it.description && it.description.includes('<img')) {
                    const match = it.description.match(/src=["'](.*?)["']/);
                    if (match) img = match[1];
                }

                const punjabiText = await translateToPunjabi(it.title);
                const shortBreaking = formatToBreakingLength(punjabiText);

                newsItems.push({
                    shortTitle: shortBreaking,
                    fullTitle: punjabiText.split(' - ')[0],
                    image: img
                });
            }
        }

        if (newsItems.length > 0) {
            if (target === 'lower') {
                // Populate Lower 6-7 word lines & Ticker
                document.getElementById('lower-bulk-lines').value = newsItems.map(n => n.shortTitle).join('\n');
                document.getElementById('sub-ticker-input').value = newsItems.map(n => n.fullTitle).join('   ★★★   ');
            } else if (target === 'side') {
                // Populate Side Caption & Side Image (if available)
                document.getElementById('side-caption-input').value = newsItems[0].shortTitle;
                if (newsItems[0].image) {
                    document.getElementById('side-img').value = newsItems[0].image;
                }
            } else if (target === 'top') {
                document.getElementById('top-bulk-lines').value = newsItems.map(n => n.shortTitle).join('\n');
            } else if (target === 'plate') {
                document.getElementById('plate-title').value = newsItems[0].fullTitle;
                document.getElementById('plate-bullets').value = newsItems.slice(1, 4).map(n => n.fullTitle).join('\n');
                if (newsItems[0].image) document.getElementById('plate-img').value = newsItems[0].image;
            }

            status.innerText = "Loaded & Synced!";
            status.style.color = "#10B981";
            sync();
            pushUpdates();
        } else {
            status.innerText = "No news found from source.";
            status.style.color = "#FF3333";
        }
    } catch (e) {
        status.innerText = "Fetch error. Try another source.";
        status.style.color = "#FF3333";
    }

    setTimeout(() => {
        status.innerText = "Ready";
        status.style.color = "#FFD000";
    }, 4000);
}

function sync() {
    const rawTopLines = document.getElementById('top-bulk-lines').value;
    const topLinesArray = rawTopLines.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const rawLowerLines = document.getElementById('lower-bulk-lines').value;
    const lowerLinesArray = rawLowerLines.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const rawPlateBullets = document.getElementById('plate-bullets').value;
    const plateBulletsArray = rawPlateBullets.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const config = {
        topBand: {
            enabled: document.getElementById('top-enable').checked,
            badgeText: document.getElementById('top-badge').value,
            fontSize: document.getElementById('top-font').value + 'px',
            switchSpeed: 7000,
            lines: topLinesArray.length > 0 ? topLinesArray : ["ਵੱਡੀ ਖ਼ਬਰ: ਲਾਈਵ ਅੱਪਡੇਟ"]
        },
        fullPlate: {
            enabled: document.getElementById('plate-enable').checked,
            title: document.getElementById('plate-title').value,
            bullets: plateBulletsArray,
            imageUrl: document.getElementById('plate-img').value
        },
        sideBreaking: {
            enabled: document.getElementById('side-enable').checked,
            position: document.getElementById('side-pos').value,
            tagText: document.getElementById('side-tag').value,
            captionText: document.getElementById('side-caption-input').value,
            imageUrl: document.getElementById('side-img').value,
            fontSize: document.getElementById('side-font').value + 'px'
        },
        lowerBand: {
            enabled: document.getElementById('lower-enable').checked,
            badgeText: document.getElementById('lower-badge').value,
            fontSize: document.getElementById('lower-font').value + 'px',
            switchSpeed: 8000,
            lines: lowerLinesArray.length > 0 ? lowerLinesArray : ["ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਲਾਈਵ ਜਾਰੀ..."],
            subTickerText: document.getElementById('sub-ticker-input').value
        },
        liveBug: {
            enabled: true,
            channelName: document.getElementById('bug-name').value,
            tag: "LIVE"
        }
    };

    localStorage.setItem('broadcast_studio_state', JSON.stringify(config));
    localStorage.setItem('broadcast_sync_timestamp', Date.now().toString());

    try {
        syncChannel.postMessage({ type: 'UPDATE_BROADCAST', config: config });
    } catch (e) {}
}

function pushUpdates() {
    sync();
    const toast = document.getElementById('toast-msg');
    if (toast) {
        toast.style.display = 'inline-block';
        setTimeout(() => { toast.style.display = 'none'; }, 1800);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('broadcast_studio_state');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.topBand) {
                document.getElementById('top-enable').checked = data.topBand.enabled !== false;
                document.getElementById('top-badge').value = data.topBand.badgeText || "ਖ਼ਾਸ ਖ਼ਬਰਾਂ";
                document.getElementById('top-font').value = parseInt(data.topBand.fontSize, 10) || 36;
                updateLbl('top-font-lbl', parseInt(data.topBand.fontSize, 10) || 36);
                if (data.topBand.lines) document.getElementById('top-bulk-lines').value = data.topBand.lines.join('\n');
            }
            if (data.fullPlate) {
                document.getElementById('plate-enable').checked = !!data.fullPlate.enabled;
                document.getElementById('plate-title').value = data.fullPlate.title || "";
                if (data.fullPlate.bullets) document.getElementById('plate-bullets').value = data.fullPlate.bullets.join('\n');
                document.getElementById('plate-img').value = data.fullPlate.imageUrl || "";
            }
            if (data.lowerBand) {
                document.getElementById('lower-enable').checked = data.lowerBand.enabled !== false;
                document.getElementById('lower-badge').value = data.lowerBand.badgeText || "BREAKING NEWS";
                document.getElementById('lower-font').value = parseInt(data.lowerBand.fontSize, 10) || 32;
                updateLbl('lower-font-lbl', parseInt(data.lowerBand.fontSize, 10) || 32);
                if (data.lowerBand.lines) document.getElementById('lower-bulk-lines').value = data.lowerBand.lines.join('\n');
                if (data.lowerBand.subTickerText) document.getElementById('sub-ticker-input').value = data.lowerBand.subTickerText;
            }
            if (data.sideBreaking) {
                document.getElementById('side-enable').checked = data.sideBreaking.enabled !== false;
                document.getElementById('side-pos').value = data.sideBreaking.position || "left";
                document.getElementById('side-tag').value = data.sideBreaking.tagText || "ਸਿੱਧੀਆਂ ਤਸਵੀਰਾਂ";
                if (data.sideBreaking.captionText) document.getElementById('side-caption-input').value = data.sideBreaking.captionText;
                if (data.sideBreaking.imageUrl) document.getElementById('side-img').value = data.sideBreaking.imageUrl;
                document.getElementById('side-font').value = parseInt(data.sideBreaking.fontSize, 10) || 24;
                updateLbl('side-font-lbl', parseInt(data.sideBreaking.fontSize, 10) || 24);
            }
            if (data.liveBug) {
                document.getElementById('bug-name').value = data.liveBug.channelName || "NEWS PUNJAB";
            }
        } catch (e) {}
    }
});
