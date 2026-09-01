/**
 * News Studio Controller Logic
 * Real-time Broadcast Synchronization for OBS & Browser
 */

const syncChannel = new BroadcastChannel('news_studio_sync');

const sidePresets = {
    news1: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
    press: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    police: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    assembly: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80'
};

function setSidePreset(key) {
    if (sidePresets[key]) {
        document.getElementById('ctrl-side-img').value = sidePresets[key];
        syncController();
    }
}

function updateSliderLbl(elementId, val) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = val + 'px';
}

function syncController() {
    const linesArr = [
        document.getElementById('ctrl-top-line-1').value,
        document.getElementById('ctrl-top-line-2').value,
        document.getElementById('ctrl-top-line-3').value,
        document.getElementById('ctrl-top-line-4').value
    ].map(l => l.trim()).filter(l => l !== '');

    const config = {
        theme: {
            red: '#D50000',
            yellow: '#FFD000',
            white: '#FFFFFF',
            black: '#0D0D11'
        },
        liveBug: {
            enabled: document.getElementById('ctrl-bug-enable').value === 'true',
            channelName: document.getElementById('ctrl-channel-name').value,
            tag: "LIVE"
        },
        topBand: {
            enabled: document.getElementById('ctrl-top-enable').checked,
            badgeText: document.getElementById('ctrl-top-badge').value,
            fontSize: document.getElementById('ctrl-top-fontsize').value + 'px',
            switchSpeed: parseInt(document.getElementById('ctrl-top-speed').value, 10) * 1000,
            lines: linesArr.length > 0 ? linesArr : ["ਵੱਡੀ ਖ਼ਬਰ: ਲਾਈਵ ਅੱਪਡੇਟ"]
        },
        sideBreaking: {
            enabled: document.getElementById('ctrl-side-enable').checked,
            position: document.getElementById('ctrl-side-pos').value,
            tagText: document.getElementById('ctrl-side-tag').value,
            imageUrl: document.getElementById('ctrl-side-img').value,
            captionText: document.getElementById('ctrl-side-caption') ? document.getElementById('ctrl-side-caption').value : "",
            fontSize: document.getElementById('ctrl-side-fontsize').value + 'px'
        },
        lowerBand: {
            enabled: document.getElementById('ctrl-lower-enable').checked,
            badgeText: document.getElementById('ctrl-lower-badge').value,
            fontSize: document.getElementById('ctrl-lower-fontsize').value + 'px',
            switchSpeed: parseInt(document.getElementById('ctrl-lower-speed').value, 10) * 1000
        }
    };

    localStorage.setItem('broadcast_studio_state', JSON.stringify(config));
    localStorage.setItem('broadcast_sync_timestamp', Date.now().toString());

    try {
        syncChannel.postMessage({
            type: 'UPDATE_BROADCAST',
            config: config
        });
    } catch(e) {}
}

function pushLiveData() {
    syncController();
    const toast = document.getElementById('save-toast');
    if (toast) {
        toast.style.display = 'inline-block';
        setTimeout(() => { toast.style.display = 'none'; }, 1800);
    }
}

function scalePreviewMonitor() {
    const card = document.getElementById('preview-box');
    const iframe = document.getElementById('preview-frame');
    if (!card || !iframe) return;
    const scale = card.clientWidth / 1920;
    iframe.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', scalePreviewMonitor);

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('broadcast_studio_state');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.topBand) {
                document.getElementById('ctrl-top-badge').value = data.topBand.badgeText || "ਖ਼ਾਸ ਖ਼ਬਰਾਂ";
                document.getElementById('ctrl-top-fontsize').value = parseInt(data.topBand.fontSize, 10) || 36;
                updateSliderLbl('top-font-val', parseInt(data.topBand.fontSize, 10) || 36);
                if (data.topBand.lines) {
                    if (data.topBand.lines[0]) document.getElementById('ctrl-top-line-1').value = data.topBand.lines[0];
                    if (data.topBand.lines[1]) document.getElementById('ctrl-top-line-2').value = data.topBand.lines[1];
                    if (data.topBand.lines[2]) document.getElementById('ctrl-top-line-3').value = data.topBand.lines[2];
                    if (data.topBand.lines[3]) document.getElementById('ctrl-top-line-4').value = data.topBand.lines[3];
                }
            }
            if (data.sideBreaking) {
                document.getElementById('ctrl-side-pos').value = data.sideBreaking.position || "left";
                document.getElementById('ctrl-side-tag').value = data.sideBreaking.tagText || "ਸਿੱਧੀਆਂ ਤਸਵੀਰਾਂ";
                document.getElementById('ctrl-side-img').value = data.sideBreaking.imageUrl || "";
                if (document.getElementById('ctrl-side-caption')) {
                    document.getElementById('ctrl-side-caption').value = data.sideBreaking.captionText || "";
                }
                document.getElementById('ctrl-side-fontsize').value = parseInt(data.sideBreaking.fontSize, 10) || 24;
                updateSliderLbl('side-font-val', parseInt(data.sideBreaking.fontSize, 10) || 24);
            }
            if (data.lowerBand) {
                document.getElementById('ctrl-lower-badge').value = data.lowerBand.badgeText || "BREAKING NEWS";
                document.getElementById('ctrl-lower-fontsize').value = parseInt(data.lowerBand.fontSize, 10) || 32;
                updateSliderLbl('lower-font-val', parseInt(data.lowerBand.fontSize, 10) || 32);
            }
            if (data.liveBug) {
                document.getElementById('ctrl-channel-name').value = data.liveBug.channelName || "NEWS PUNJAB";
            }
        } catch (e) {}
    }
    setTimeout(scalePreviewMonitor, 300);
});
