function speak() {
    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance("Welcome to my chess game, Enjoy");
  
    // Select a voice
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0]; // Choose a specific voice
  
    // Speak the text
    speechSynthesis.speak(utterance);
  }
