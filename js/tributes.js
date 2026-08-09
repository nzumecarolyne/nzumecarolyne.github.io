// ============================================================
//  TRIBUTES.JS – Firebase tribute wall logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is initialized
    if (typeof window.db === 'undefined') {
        console.error('❌ Firebase not initialized. Check firebase.js');
        alert('Firebase not configured. Please set up your Firebase credentials in js/firebase.js');
        return;
    }

    const db = window.db;
    const tributeRef = window.ref(db, 'tributes');
    const form = document.getElementById('tributeForm');
    const list = document.getElementById('tributeList');
    const previewContainer = document.getElementById('tributePreview');

    // Helper: Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Helper: Format timestamp
    function formatTimestamp(timestamp) {
        if (!timestamp) return 'Just now';
        try {
            const date = new Date(timestamp);
            return date.toLocaleString();
        } catch {
            return 'Just now';
        }
    }

    // ---------- RENDER: Single tribute ----------
    function renderTribute(data, key) {
        const name = data.name || 'Anonymous';
        const message = data.message || '';
        const timestamp = data.timestamp || Date.now();
        const date = formatTimestamp(timestamp);

        const div = document.createElement('div');
        div.className = 'tribute-item';
        div.dataset.key = key;
        div.innerHTML = `
            <strong>${escapeHtml(name)}</strong>
            <p>${escapeHtml(message)}</p>
            <span class="tribute-time">${date}</span>
        `;
        return div;
    }

    // ---------- LOAD & LISTEN for tributes ----------
    if (list) {
        // Clear placeholder
        list.innerHTML = '<p style="color: var(--gray); text-align:center; padding: 2rem;">Loading tributes...</p>';

        // Listen for new tributes (real-time)
        window.onChildAdded(tributeRef, (snapshot) => {
            const data = snapshot.val();
            const key = snapshot.key;
            
            // Remove loading message if present
            const loadingMsg = list.querySelector('p');
            if (loadingMsg && loadingMsg.textContent.includes('Loading')) {
                list.innerHTML = '';
            }

            const item = renderTribute(data, key);
            list.prepend(item); // newest at top
        });

        // Also listen for changes (in case of updates)
        window.onChildChanged(tributeRef, (snapshot) => {
            const data = snapshot.val();
            const key = snapshot.key;
            const existingItem = list.querySelector(`[data-key="${key}"]`);
            if (existingItem) {
                const newItem = renderTribute(data, key);
                existingItem.replaceWith(newItem);
            }
        });

        // Handle removal
        window.onChildRemoved(tributeRef, (snapshot) => {
            const key = snapshot.key;
            const existingItem = list.querySelector(`[data-key="${key}"]`);
            if (existingItem) {
                existingItem.remove();
            }
        });
    }

    // ---------- PREVIEW on home page ----------
    if (previewContainer) {
        // Fetch last 3 tributes
        window.get(tributeRef)
            .then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const entries = Object.entries(data);
                    const sorted = entries.sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));
                    const latest = sorted.slice(0, 3);
                    
                    previewContainer.innerHTML = '';
                    if (latest.length === 0) {
                        previewContainer.innerHTML = '<p style="color: var(--gray); text-align:center;">No tributes yet. Be the first to share.</p>';
                        return;
                    }
                    
                    latest.forEach(([key, value]) => {
                        const div = document.createElement('div');
                        div.className = 'tribute-preview-item';
                        div.innerHTML = `
                            <p class="tribute-preview-text">"${escapeHtml(value.message || '')}"</p>
                            <span class="tribute-preview-name">— ${escapeHtml(value.name || 'Anonymous')}</span>
                        `;
                        previewContainer.appendChild(div);
                    });
                } else {
                    previewContainer.innerHTML = '<p style="color: var(--gray); text-align:center;">No tributes yet. Be the first to share.</p>';
                }
            })
            .catch((err) => {
                console.warn('Error loading preview tributes:', err);
                if (previewContainer) {
                    previewContainer.innerHTML = '<p style="color: var(--gray); text-align:center;">Unable to load tributes. Please check Firebase configuration.</p>';
                }
            });
    }

    // ---------- FORM SUBMISSION ----------
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('tributeName');
            const messageInput = document.getElementById('tributeMessage');
            
            const name = nameInput.value.trim() || 'Anonymous';
            const message = messageInput.value.trim();
            
            if (!message) {
                alert('Please write a message.');
                return;
            }

            // Disable button to prevent double submission
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                await window.push(tributeRef, {
                    name: name,
                    message: message,
                    timestamp: Date.now()
                });
                
                // Success
                form.reset();
                alert('✅ Thank you for your tribute!');
                submitBtn.textContent = 'Submit Tribute';
                submitBtn.disabled = false;
                
            } catch (error) {
                console.error('Error submitting tribute:', error);
                alert('❌ Could not save tribute. Please check:\n1. Firebase credentials in firebase.js\n2. Database rules (read/write permissions)\n3. Internet connection');
                submitBtn.textContent = 'Submit Tribute';
                submitBtn.disabled = false;
            }
        });
    }

    // ---------- TEST: Check if Firebase is working ----------
    // Test write to verify configuration
    const testRef = window.ref(db, 'test');
    window.set(testRef, { test: true, timestamp: Date.now() })
        .then(() => {
            console.log('✅ Firebase write test successful');
            window.remove(testRef).catch(() => {});
        })
        .catch((err) => {
            console.error('❌ Firebase write test failed:', err);
            console.warn('Please check your Firebase credentials and database rules.');
        });
});