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
                <div class="progress-bar">
                    <div class="progress-handle"></div>
                </div>
            </div>
            <div class="time-display">0:00 / 0:00</div>
            <div class="volume-control">
                <button class="volume-button" data-beat-id="${beat.id}">
                    <span class="volume-icon">🔊</span>
                </button>
                <div class="volume-slider-container">
                    <input type="range" class="volume-slider" min="0" max="100" value="100" data-beat-id="${beat.id}">
                </div>
            </div>
        </div>
        <audio class="audio-element" src="${beat.audioFile}" preload="metadata"></audio>
        <button class="purchase-button">Interested in buying? Contact us on Instagram</button>
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
        const progressHandle = card.querySelector('.progress-handle');
        const progressContainer = card.querySelector('.progress-container');
        const timeDisplay = card.querySelector('.time-display');
        const volumeButton = card.querySelector('.volume-button');
        const volumeSlider = card.querySelector('.volume-slider');
        const volumeIcon = card.querySelector('.volume-icon');
        
        // Set initial volume
        audio.volume = 1.0;
        
        let isDragging = false;
        
        // Update progress
        const updateProgress = () => {
            if (audio.duration && !isDragging) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = progress + '%';
                timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
            }
        };
        
        // Update time display when metadata loads
        audio.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
            updateProgress();
        });
        
        audio.addEventListener('timeupdate', updateProgress);
        
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
                const prevProgressContainer = currentCard.querySelector('.progress-container');
                if (prevProgressContainer) {
                    prevProgressContainer.classList.remove('dragging');
                }
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
        
        // Handle progress bar interaction (click and drag)
        const setProgress = (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const percentage = clickX / rect.width;
            audio.currentTime = percentage * audio.duration;
            progressBar.style.width = (percentage * 100) + '%';
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        };
        
        progressContainer.addEventListener('click', (e) => {
            if (!isDragging) {
                setProgress(e);
            }
        });
        
        // Drag functionality
        progressContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            progressContainer.classList.add('dragging');
            setProgress(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging && currentAudio === audio) {
                setProgress(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                progressContainer.classList.remove('dragging');
            }
        });
        
        // Touch support for mobile
        progressContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            progressContainer.classList.add('dragging');
            const touch = e.touches[0];
            setProgress(touch);
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isDragging && currentAudio === audio) {
                const touch = e.touches[0];
                setProgress(touch);
            }
        });
        
        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                progressContainer.classList.remove('dragging');
            }
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
        
        // Handle volume slider
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            audio.volume = volume;
            
            // Update icon based on volume level
            if (volume === 0) {
                volumeIcon.textContent = '🔇';
            } else if (volume < 0.5) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        });
        
        // Handle volume button (mute/unmute)
        volumeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (audio.volume > 0) {
                // Store current volume and mute
                volumeSlider.dataset.previousVolume = volumeSlider.value;
                audio.volume = 0;
                volumeSlider.value = 0;
                volumeIcon.textContent = '🔇';
            } else {
                // Restore previous volume or default to 100
                const previousVolume = volumeSlider.dataset.previousVolume || 100;
                audio.volume = previousVolume / 100;
                volumeSlider.value = previousVolume;
                
                if (previousVolume < 50) {
                    volumeIcon.textContent = '🔉';
                } else {
                    volumeIcon.textContent = '🔊';
                }
            }
        });
    });
}

// Load beats when page loads
document.addEventListener('DOMContentLoaded', loadBeats);
