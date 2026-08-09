// ============================================================
//  🎵 SIMPLE PERSISTENT MUSIC PLAYER
// ============================================================


(function() {
    'use strict';

    const STORAGE_KEY = 'memorial_music';

    // ====== GET OR CREATE AUDIO ======
    let audio = document.getElementById('bgMusic');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'bgMusic';
        audio.loop = true;
        audio.preload = 'auto';
        audio.src = 'music/Aṣa-Ocean-Litenaija.com-z8.mp3';
        document.body.prepend(audio);
        console.log('🎵 Audio element created');
    }

    // ====== RESTORE STATE ======
    function restoreState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                
                // Restore volume
                if (data.volume !== undefined) {
                    audio.volume = data.volume;
                    const slider = document.getElementById('musicVolume');
                    if (slider) slider.value = data.volume;
                }
                
                // Restore time
                if (data.time) {
                    audio.currentTime = data.time;
                }
                
                // Restore play state
                if (data.playing) {
                    audio.play().catch(() => {});
                }
                
                console.log('📂 Restored music state:', data);
            }
        } catch (e) {
            console.log('Error restoring state:', e);
        }
    }

    // ====== SAVE STATE ======
    function saveState() {
        try {
            const data = {
                playing: !audio.paused,
                time: audio.currentTime,
                volume: audio.volume
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.log('Error saving state:', e);
        }
    }

    // ====== UPDATE UI ======
    function updateUI() {
        const isPlaying = !audio.paused;
        
        // Update play button
        const playIcon = document.getElementById('musicPlayIcon');
        const playBtn = document.getElementById('musicPlayBtn');
        if (playIcon) {
            playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
        if (playBtn) {
            playBtn.classList.toggle('playing', isPlaying);
        }
        
        // Update status
        const status = document.getElementById('musicStatus');
        if (status) {
            if (isPlaying) {
                status.textContent = '● Playing';
                status.className = 'music-status playing';
            } else {
                status.textContent = '● Paused';
                status.className = 'music-status';
            }
        }
        
        // Update icon animation
        const icon = document.getElementById('musicStatusIcon');
        if (icon) {
            icon.style.animation = isPlaying ? 'pulse 2s infinite' : 'none';
        }
    }

    // ====== TOGGLE PLAY ======
    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                saveState();
                updateUI();
            }).catch(() => {});
        } else {
            audio.pause();
            saveState();
            updateUI();
        }
    }

    // ====== SET VOLUME ======
    function setVolume(val) {
        audio.volume = parseFloat(val);
        saveState();
        // Update icon
        const volIcon = document.querySelector('.volume-icon i');
        if (volIcon) {
            if (audio.volume === 0) {
                volIcon.className = 'fas fa-volume-mute';
            } else if (audio.volume < 0.5) {
                volIcon.className = 'fas fa-volume-down';
            } else {
                volIcon.className = 'fas fa-volume-up';
            }
        }
    }

    // ====== SAVE ON EVENTS ======
    audio.addEventListener('play', () => { saveState(); updateUI(); });
    audio.addEventListener('pause', () => { saveState(); updateUI(); });
    audio.addEventListener('timeupdate', () => {
        // Save time every 2 seconds
        if (!audio.paused) {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            data.time = audio.currentTime;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    });

    // ====== EXPOSE GLOBAL ======
    window.musicPlayer = {
        toggle: togglePlay,
        play: () => { audio.play().then(() => { saveState(); updateUI(); }).catch(() => {}); },
        pause: () => { audio.pause(); saveState(); updateUI(); },
        setVolume: setVolume,
        getState: () => ({
            playing: !audio.paused,
            time: audio.currentTime,
            volume: audio.volume
        })
    };

    // ====== INIT ======
    document.addEventListener('DOMContentLoaded', function() {
        // Restore state
        restoreState();
        
        // ====== UPDATED: SETUP CONTROLS WITH BETTER BINDING ======
        // Play button
        const playBtn = document.getElementById('musicPlayBtn');
        if (playBtn) {
            // Remove old listeners by cloning
            const newBtn = playBtn.cloneNode(true);
            playBtn.parentNode.replaceChild(newBtn, playBtn);
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.musicPlayer.toggle();
                return false;
            });
        }
        
        // Volume slider
        const volumeSlider = document.getElementById('musicVolume');
        if (volumeSlider) {
            const newSlider = volumeSlider.cloneNode(true);
            volumeSlider.parentNode.replaceChild(newSlider, volumeSlider);
            newSlider.addEventListener('input', function() {
                window.musicPlayer.setVolume(this.value);
            });
            // Set initial value
            if (audio.volume !== undefined) {
                newSlider.value = audio.volume;
            }
        }
        
        // Hero music button
        const heroBtn = document.getElementById('heroMusicBtn');
        if (heroBtn) {
            // Remove old listeners by cloning
            const newHeroBtn = heroBtn.cloneNode(true);
            heroBtn.parentNode.replaceChild(newHeroBtn, heroBtn);
            newHeroBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const musicSection = document.getElementById('music-section');
                if (musicSection) {
                    musicSection.scrollIntoView({ behavior: 'smooth' });
                }
                if (audio.paused) {
                    window.musicPlayer.toggle();
                }
                return false;
            });
        }
        
        // Update UI after setup
        setTimeout(updateUI, 100);
        
        console.log('🎵 Music player ready');
        console.log('📊 Current state:', window.musicPlayer.getState());
    });

})();