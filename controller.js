/**
 * Clean Broadcast Studio Controller Engine
 */

const syncChannel = new BroadcastChannel('news_studio_sync');

function updateLbl(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val + 'px';
}

function sync() {
    // 1. Bulk Parse Lines (1 Line Per Item)
    const rawTopLines = document.getElementById('top-bulk-lines').value;
    const topLinesArray = rawTopLines.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const rawPlateBullets = document.getElementById('plate-bullets').value;
    const plateBulletsArray = rawPlateBullets.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const config = {
        topBand: {
            enabled: document.getElementById('top-enable').checked,
            badgeText: document.getElementById('top-badge').value,
            fontSize: document.getElementById('top-font').value + 'px',
            switchSpeed: parseInt(document.getElementById('top-speed').value, 10) * 1000,
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
            imageUrl: document.getElementById('side-img').value,
            fontSize: document.getElementById('side-font').value + 'px'
        },
        lowerBand: {
            enabled: document.getElementById('lower-enable').checked,
            badgeText: document.getElementById('lower-badge').value,
            fontSize: document.getElementById('lower-font').value + 'px',
            switchSpeed: parseInt(document.getElementById('lower-speed').value, 10) * 1000
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

// Load Saved State on Refresh
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
            if (data.sideBreaking) {
                document.getElementById('side-enable').checked = data.sideBreaking.enabled !== false;
                document.getElementById('side-pos').value = data.sideBreaking.position || "left";
                document.getElementById('side-tag').value = data.sideBreaking.tagText || "ਸਿੱਧੀਆਂ ਤਸਵੀਰਾਂ";
                document.getElementById('side-img').value = data.sideBreaking.imageUrl || "";
                document.getElementById('side-font').value = parseInt(data.sideBreaking.fontSize, 10) || 24;
                updateLbl('side-font-lbl', parseInt(data.sideBreaking.fontSize, 10) || 24);
            }
            if (data.lowerBand) {
                document.getElementById('lower-enable').checked = data.lowerBand.enabled !== false;
                document.getElementById('lower-badge').value = data.lowerBand.badgeText || "BREAKING NEWS";
                document.getElementById('lower-font').value = parseInt(data.lowerBand.fontSize, 10) || 32;
                updateLbl('lower-font-lbl', parseInt(data.lowerBand.fontSize, 10) || 32);
            }
            if (data.liveBug) {
                document.getElementById('bug-name').value = data.liveBug.channelName || "NEWS PUNJAB";
            }
        } catch (e) {}
    }
});
