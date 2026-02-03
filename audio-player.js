// Audio Player Functionality
let currentAudio = null;
let currentBeat = null;
let isDragging = false;

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
        <button class="purchase-button">Purchase</button>
    `;
    
    return card;
}

function initializeBottomPlayer() {
    const globalAudio = document.getElementById('globalAudio');
    const playerPlayButton = document.getElementById('playerPlayButton');
    const playerProgressBar = document.getElementById('playerProgressBar');
    const playerProgressContainer = document.querySelector('.player-progress-container');
    const playerTimeDisplay = document.getElementById('playerTimeDisplay');
    const playerVolumeButton = document.getElementById('playerVolumeButton');
    const playerVolumeSlider = document.getElementById('playerVolumeSlider');
    const playerVolumeIcon = document.querySelector('.player-volume-icon');
    const playerTrackName = document.getElementById('playerTrackName');
    const bottomPlayer = document.getElementById('bottomPlayer');
    
    // Set initial volume
    globalAudio.volume = 1.0;
    
    // Update progress
    const updateProgress = () => {
        if (globalAudio.duration && !isDragging) {
            const progress = (globalAudio.currentTime / globalAudio.duration) * 100;
            playerProgressBar.style.width = progress + '%';
            playerTimeDisplay.textContent = `${formatTime(globalAudio.currentTime)} / ${formatTime(globalAudio.duration)}`;
        }
    };
    
    // Update time display when metadata loads
    globalAudio.addEventListener('loadedmetadata', () => {
        playerTimeDisplay.textContent = `0:00 / ${formatTime(globalAudio.duration)}`;
        updateProgress();
    });
    
    globalAudio.addEventListener('timeupdate', updateProgress);
    
    // Handle play/pause
    playerPlayButton.addEventListener('click', () => {
        if (!currentAudio) return;
        
        if (globalAudio.paused) {
            globalAudio.play();
            playerPlayButton.classList.add('playing');
        } else {
            globalAudio.pause();
            playerPlayButton.classList.remove('playing');
        }
    });
    
    // Handle progress bar interaction (click and drag)
    const setProgress = (e) => {
        if (!globalAudio.duration) return;
        const rect = playerProgressContainer.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = clickX / rect.width;
        globalAudio.currentTime = percentage * globalAudio.duration;
        playerProgressBar.style.width = (percentage * 100) + '%';
        playerTimeDisplay.textContent = `${formatTime(globalAudio.currentTime)} / ${formatTime(globalAudio.duration)}`;
    };
    
    playerProgressContainer.addEventListener('click', (e) => {
        if (!isDragging) {
            setProgress(e);
        }
    });
    
    // Drag functionality
    playerProgressContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        playerProgressContainer.classList.add('dragging');
        setProgress(e);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging && currentAudio) {
            setProgress(e);
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            playerProgressContainer.classList.remove('dragging');
        }
    });
    
    // Touch support for mobile
    playerProgressContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        playerProgressContainer.classList.add('dragging');
        const touch = e.touches[0];
        setProgress(touch);
    });
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging && currentAudio) {
            const touch = e.touches[0];
            setProgress(touch);
        }
    });
    
    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            playerProgressContainer.classList.remove('dragging');
        }
    });
    
    // Reset when audio ends
    globalAudio.addEventListener('ended', () => {
        playerPlayButton.classList.remove('playing');
        playerProgressBar.style.width = '0%';
        globalAudio.currentTime = 0;
        currentAudio = null;
        currentBeat = null;
        playerTrackName.textContent = 'No track selected';
        bottomPlayer.classList.remove('active');
    });
    
    // Handle volume slider
    playerVolumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        globalAudio.volume = volume;
        
        // Update icon based on volume level
        if (volume === 0) {
            playerVolumeIcon.textContent = '🔇';
        } else if (volume < 0.5) {
            playerVolumeIcon.textContent = '🔉';
        } else {
            playerVolumeIcon.textContent = '🔊';
        }
    });
    
    // Handle volume button (mute/unmute)
    playerVolumeButton.addEventListener('click', () => {
        if (globalAudio.volume > 0) {
            // Store current volume and mute
            playerVolumeSlider.dataset.previousVolume = playerVolumeSlider.value;
            globalAudio.volume = 0;
            playerVolumeSlider.value = 0;
            playerVolumeIcon.textContent = '🔇';
        } else {
            // Restore previous volume or default to 100
            const previousVolume = playerVolumeSlider.dataset.previousVolume || 100;
            globalAudio.volume = previousVolume / 100;
            playerVolumeSlider.value = previousVolume;
            
            if (previousVolume < 50) {
                playerVolumeIcon.textContent = '🔉';
            } else {
                playerVolumeIcon.textContent = '🔊';
            }
        }
    });
}

function loadBeats() {
    const beatsGrid = document.getElementById('beatsGrid');
    if (!beatsGrid) return;
    
    beatsGrid.innerHTML = '';
    
    const globalAudio = document.getElementById('globalAudio');
    const playerPlayButton = document.getElementById('playerPlayButton');
    const playerTrackName = document.getElementById('playerTrackName');
    const bottomPlayer = document.getElementById('bottomPlayer');
    
    beatsData.forEach(beat => {
        const card = createBeatCard(beat);
        beatsGrid.appendChild(card);
        
        // Make entire card clickable to play
        card.addEventListener('click', (e) => {
            // If clicking the purchase button, don't play
            if (e.target.classList.contains('purchase-button')) {
                return;
            }
            
            // If same beat is playing, toggle play/pause
            if (currentBeat && currentBeat.id === beat.id) {
                if (globalAudio.paused) {
                    globalAudio.play();
                    playerPlayButton.classList.add('playing');
                } else {
                    globalAudio.pause();
                    playerPlayButton.classList.remove('playing');
                }
                return;
            }
            
            // Load and play new beat
            globalAudio.src = beat.audioFile;
            globalAudio.load();
            globalAudio.play();
            
            currentAudio = globalAudio;
            currentBeat = beat;
            playerTrackName.textContent = beat.name;
            playerPlayButton.classList.add('playing');
            bottomPlayer.classList.add('active');
        });
    });
}

// Load beats when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeBottomPlayer();
    loadBeats();
});
