// ============================================================
//  APP.JS – Common functionality for all pages
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Navigation Toggle ----------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const expanded = navMenu.classList.contains('open');
            navToggle.setAttribute('aria-expanded', expanded);
        });
        // Close on link click (mobile)
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---------- Music Player ----------
    const audio = document.getElementById('bgMusic');
    const playBtn = document.getElementById('musicPlayBtn');
    const playIcon = document.getElementById('musicPlayIcon');
    const volumeSlider = document.getElementById('musicVolume');
    const heroMusicBtn = document.getElementById('heroMusicBtn');

    let isPlaying = false;

    // Attempt to auto-play if user interacted (click on hero button)
    function togglePlay() {
        if (audio.paused) {
            audio.play().catch(() => {});
            playIcon.className = 'fas fa-pause';
            isPlaying = true;
        } else {
            audio.pause();
            playIcon.className = 'fas fa-play';
            isPlaying = false;
        }
    }

    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }

    if (heroMusicBtn) {
        heroMusicBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // scroll to music player
            document.getElementById('music-section').scrollIntoView({ behavior: 'smooth' });
            // if not playing, start
            if (audio.paused) {
                togglePlay();
            }
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value;
        });
        audio.volume = volumeSlider.value;
    }

    // ---------- Intersection Observer for fade-up ----------
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // ---------- Fix for hero button music ----------
    // ensure the hero music button works even if music section isn't rendered yet
    // (already handled above)
});