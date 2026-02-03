// Audio Player Functionality
let currentAudio = null;
let currentCard = null;

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function createBeatCard(beat) {
    const card = document.createElement('div');
    card.className = 'beat-card';
    card.innerHTML = `
        <div class="beat-header">
            <h2 class="beat-name">${beat.name}</h2>
        </div>
        <div class="audio-controls">
            <button class="play-button" data-beat-id="${beat.id}">
                <span class="play-icon"></span>
            </button>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
            <div class="time-display">0:00 / 0:00</div>
        </div>
        <audio class="audio-element" src="${beat.audioFile}" preload="metadata"></audio>
        <a href="contact.html">
  <button class="purchase-button">Contact Us</button>
</a>
    `;
    
    return card;
}

function loadBeats() {
    const beatsGrid = document.getElementById('beatsGrid');
    if (!beatsGrid) return;
    
    beatsGrid.innerHTML = '';
    
    beatsData.forEach(beat => {
        const card = createBeatCard(beat);
        beatsGrid.appendChild(card);
        
        const playButton = card.querySelector('.play-button');
        const audio = card.querySelector('.audio-element');
        const progressBar = card.querySelector('.progress-bar');
        const progressContainer = card.querySelector('.progress-container');
        const timeDisplay = card.querySelector('.time-display');
        
        // Update time display
        audio.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
        });
        
        // Update progress
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = progress + '%';
                timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
            }
        });
        
        // Handle play/pause
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (currentAudio && currentAudio !== audio) {
                // Stop other audio
                currentAudio.pause();
                currentAudio.currentTime = 0;
                if (currentCard) {
                    const prevButton = currentCard.querySelector('.play-button');
                    const prevProgress = currentCard.querySelector('.progress-bar');
                    prevButton.classList.remove('playing');
                    prevProgress.style.width = '0%';
                }
            }
            
            if (audio.paused) {
                audio.play();
                playButton.classList.add('playing');
                currentAudio = audio;
                currentCard = card;
            } else {
                audio.pause();
                playButton.classList.remove('playing');
                if (currentAudio === audio) {
                    currentAudio = null;
                    currentCard = null;
                }
            }
        });
        
        // Handle progress bar click
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            audio.currentTime = percentage * audio.duration;
        });
        
        // Reset when audio ends
        audio.addEventListener('ended', () => {
            playButton.classList.remove('playing');
            progressBar.style.width = '0%';
            audio.currentTime = 0;
            if (currentAudio === audio) {
                currentAudio = null;
                currentCard = null;
            }
        });
    });
}

// Load beats when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBeats);
} else {
    // DOM is already loaded
    loadBeats();
}

// Also try loading after a short delay to ensure beatsData is available
setTimeout(() => {
    if (typeof beatsData !== 'undefined' && beatsData.length > 0) {
        const beatsGrid = document.getElementById('beatsGrid');
        if (beatsGrid && beatsGrid.children.length === 0) {
            loadBeats();
        }
    }
}, 100);
