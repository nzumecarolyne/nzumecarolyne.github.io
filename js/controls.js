// ============================================================
//  🎵 CONTROL BUTTONS - SEPARATE SCRIPT
//  Works alongside your existing music.js
// ============================================================

(function() {
    'use strict';

    // Wait for DOM to be ready
    function initControls() {
        console.log('🎮 Initializing control buttons...');

        // ====== PLAY/PAUSE BUTTON ======
        const playBtn = document.getElementById('musicPlayBtn');
        if (playBtn) {
            // Remove any existing listeners
            const newPlayBtn = playBtn.cloneNode(true);
            playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
            
            newPlayBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Use the global musicPlayer if available
                if (window.musicPlayer) {
                    window.musicPlayer.toggle();
                } else {
                    // Fallback: try to control audio directly
                    const audio = document.getElementById('bgMusic');
                    if (audio) {
                        if (audio.paused) {
                            audio.play().catch(function() {});
                        } else {
                            audio.pause();
                        }
                    }
                }
                return false;
            });
            
            console.log('✅ Play button attached');
        } else {
            console.warn('⚠️ Play button not found');
        }

        // ====== VOLUME SLIDER ======
        const volumeSlider = document.getElementById('musicVolume');
        if (volumeSlider) {
            const newSlider = volumeSlider.cloneNode(true);
            volumeSlider.parentNode.replaceChild(newSlider, volumeSlider);
            
            newSlider.addEventListener('input', function() {
                const val = parseFloat(this.value);
                
                if (window.musicPlayer) {
                    window.musicPlayer.setVolume(val);
                } else {
                    const audio = document.getElementById('bgMusic');
                    if (audio) {
                        audio.volume = val;
                    }
                }
                
                // Update icon
                const volIcon = document.querySelector('.volume-icon i');
                if (volIcon) {
                    if (val === 0) {
                        volIcon.className = 'fas fa-volume-mute';
                    } else if (val < 0.5) {
                        volIcon.className = 'fas fa-volume-down';
                    } else {
                        volIcon.className = 'fas fa-volume-up';
                    }
                }
            });
            
            // Set initial value
            const audio = document.getElementById('bgMusic');
            if (audio && audio.volume !== undefined) {
                newSlider.value = audio.volume;
            }
            
            console.log('✅ Volume slider attached');
        } else {
            console.warn('⚠️ Volume slider not found');
        }

        // ====== HERO MUSIC BUTTON ======
        const heroBtn = document.getElementById('heroMusicBtn');
        if (heroBtn) {
            const newHeroBtn = heroBtn.cloneNode(true);
            heroBtn.parentNode.replaceChild(newHeroBtn, heroBtn);
            
            newHeroBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Scroll to music player
                const musicSection = document.getElementById('music-section');
                if (musicSection) {
                    musicSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Play if paused
                const audio = document.getElementById('bgMusic');
                if (audio && audio.paused) {
                    if (window.musicPlayer) {
                        window.musicPlayer.toggle();
                    } else {
                        audio.play().catch(function() {});
                    }
                }
                return false;
            });
            
            console.log('✅ Hero button attached');
        } else {
            console.warn('⚠️ Hero button not found');
        }

        // ====== UPDATE UI ON PAGE LOAD ======
        function updateUI() {
            const audio = document.getElementById('bgMusic');
            if (!audio) return;
            
            const isPlaying = !audio.paused;
            
            // Update play icon
            const playIcon = document.getElementById('musicPlayIcon');
            if (playIcon) {
                playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
            
            // Update play button class
            const playBtn = document.getElementById('musicPlayBtn');
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

        // Update UI when audio events fire
        const audio = document.getElementById('bgMusic');
        if (audio) {
            audio.addEventListener('play', updateUI);
            audio.addEventListener('pause', updateUI);
        }

        // Update UI after setup
        setTimeout(updateUI, 200);
        
        console.log('🎮 Control buttons initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initControls);
    } else {
        initControls();
    }

})();