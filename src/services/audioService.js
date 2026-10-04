let audioContext;

const getAudioContext = () => {
    const AudioContextConstructor =
        window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor)
        throw new Error("Audio alerts are not supported by this browser.");
    audioContext ||= new AudioContextConstructor();
    return audioContext;
};

export const audioService = {
    unlock: async () => {
        const context = getAudioContext();
        if (context.state === "suspended") await context.resume();
    },
    playCompletion: async () => {
        const context = getAudioContext();
        if (context.state === "suspended") await context.resume();
        const startAt = context.currentTime;
        [659.25, 880].forEach((frequency, index) => {
            const start = startAt + index * 0.19;
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(frequency, start);
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(0.12, start + 0.025);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(start);
            oscillator.stop(start + 0.35);
        });
    },
};
