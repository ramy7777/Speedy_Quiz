class SoundManager {
    constructor() {
        this.sounds = {
            background: new Audio('sounds/background.mp3'),
            correct: new Audio('sounds/correct.mp3'),
            incorrect: new Audio('sounds/incorrect.mp3'),
            gameover: new Audio('sounds/gameover.mp3')
        };

        // Configure background music
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.3;

        // Configure sound effects
        this.sounds.correct.volume = 0.5;
        this.sounds.incorrect.volume = 0.5;
        this.sounds.gameover.volume = 0.5;

        // Initialize mute state
        this.isMuted = false;
    }

    playBackground() {
        if (!this.isMuted) {
            this.sounds.background.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    stopBackground() {
        this.sounds.background.pause();
        this.sounds.background.currentTime = 0;
    }

    playCorrect() {
        if (!this.isMuted) {
            this.sounds.correct.currentTime = 0;
            this.sounds.correct.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    playIncorrect() {
        if (!this.isMuted) {
            this.sounds.incorrect.currentTime = 0;
            this.sounds.incorrect.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    playGameOver() {
        if (!this.isMuted) {
            this.stopBackground();
            this.sounds.gameover.currentTime = 0;
            this.sounds.gameover.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBackground();
        } else {
            this.playBackground();
        }
        return this.isMuted;
    }

    preloadAll() {
        // Preload all sounds
        Object.values(this.sounds).forEach(audio => {
            audio.load();
        });
    }
}

// Create a global instance
const soundManager = new SoundManager();
