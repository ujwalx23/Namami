/**
 * Detects if the given text contains Devanagari Hindi characters.
 */
export function isHindiText(text: string): boolean {
  const containsHindi = /[\u0900-\u097F]/.test(text);
  return containsHindi;
}

const VOWELS: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah', 'ॐ': 'om'
};

const CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'क़': 'q', 'ख़': 'kh', 'ग़': 'g', 'ज़': 'z', 'ड़': 'd', 'ढ़': 'dh', 'फ़': 'f'
};

const MATRAS: Record<string, string> = {
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'an', 'ँ': 'an', 'ः': 'h', 'ॅ': 'e', 'ॉ': 'o', '्': ''
};

export function transliterateHindi(text: string): string {
  let result = '';
  let i = 0;
  
  while (i < text.length) {
    const char = text[i];
    
    if (VOWELS[char]) {
      result += VOWELS[char];
      i++;
    } 
    else if (CONSONANTS[char]) {
      const baseConsonant = CONSONANTS[char];
      
      if (i + 1 < text.length) {
        const nextChar = text[i + 1];
        
        if (nextChar === '्') {
          result += baseConsonant;
          i += 2;
        }
        else if (MATRAS[nextChar] !== undefined) {
          result += baseConsonant + MATRAS[nextChar];
          i += 2;
        }
        else if (nextChar === ' ' || nextChar === '\n' || !/[\u0900-\u097F]/.test(nextChar)) {
          result += baseConsonant;
          i++;
        }
        else {
          result += baseConsonant + 'a';
          i++;
        }
      } else {
        result += baseConsonant;
        i++;
      }
    }
    else if (MATRAS[char] !== undefined) {
      result += MATRAS[char];
      i++;
    }
    else {
      result += char;
      i++;
    }
  }
  
  return result
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/\s+/g, ' ');
}

export function splitTextIntoSegments(text: string): { text: string; isHindi: boolean }[] {
  const bracketRegex = /(\[[^\]]+\]|\([^)]+\))/g;
  const bracketParts = text.split(bracketRegex);
  
  const rawSegments: { text: string; isHindi: boolean }[] = [];
  
  for (const part of bracketParts) {
    if (!part) continue;
    
    // Check if it is a bracketed/parenthesized part
    const isBracketed = (part.startsWith('[') && part.endsWith(']')) || 
                        (part.startsWith('(') && part.endsWith(')'));
    
    if (isBracketed) {
      const cleanPart = part.slice(1, -1).trim();
      if (cleanPart) {
        rawSegments.push({
          text: cleanPart,
          isHindi: isHindiText(cleanPart)
        });
      }
    } else {
      // Split by clause and sentence delimiters:
      // । (Hindi danda), . (period), ! (exclamation), ? (question mark),
      // \n (newline), | (pipe), —, -, /, :, ,, ;
      const delimiterRegex = /([।\.!\?\n|—\-\/:,;]+)/g;
      const subParts = part.split(delimiterRegex);
      
      let currentText = '';
      let currentIsHindi: boolean | null = null;
      
      for (const subPart of subParts) {
        if (!subPart) continue;
        
        // If it's only punctuation/whitespace, it's neutral delimiter
        const isDelimiter = /^[।\.!\?\n|—\-\/:,;\s]+$/.test(subPart);
        
        if (isDelimiter) {
          if (currentText) {
            currentText += subPart;
          } else {
            // Append neutral delimiters to the last saved segment if exists
            if (rawSegments.length > 0) {
              rawSegments[rawSegments.length - 1].text += subPart;
            } else {
              currentText = subPart;
              currentIsHindi = false;
            }
          }
        } else {
          const isHindi = isHindiText(subPart);
          
          if (currentIsHindi === null) {
            currentText = subPart;
            currentIsHindi = isHindi;
          } else if (currentIsHindi === isHindi) {
            currentText += subPart;
          } else {
            // Language switch occurred! Save current segment and start a new one
            if (currentText.trim()) {
              rawSegments.push({
                text: currentText,
                isHindi: currentIsHindi
              });
            }
            currentText = subPart;
            currentIsHindi = isHindi;
          }
        }
      }
      
      if (currentText.trim()) {
        rawSegments.push({
          text: currentText,
          isHindi: currentIsHindi ?? false
        });
      }
    }
  }
  
  // Merge consecutive segments of the same language
  const mergedSegments: { text: string; isHindi: boolean }[] = [];
  
  for (const seg of rawSegments) {
    const trimmedText = seg.text.trim();
    if (!trimmedText) continue;
    
    if (mergedSegments.length > 0 && mergedSegments[mergedSegments.length - 1].isHindi === seg.isHindi) {
      mergedSegments[mergedSegments.length - 1].text += ' ' + seg.text;
    } else {
      mergedSegments.push({
        text: seg.text,
        isHindi: seg.isHindi
      });
    }
  }
  
  // Final cleanup and formatting
  return mergedSegments
    .map(seg => ({
      text: seg.text.trim().replace(/\s+/g, ' '),
      isHindi: seg.isHindi
    }))
    .filter(seg => seg.text.length > 0);
}

// Global cache of voices to enable synchronous matching
let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Updates the global cache of available voices from the browser.
 */
function updateCachedVoices(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length > 0) {
      cachedVoices = voices;
      console.log("[SpeechSynthesis] Loaded/updated cached voices list:");
      voices.forEach((v) => {
        console.log(`  - Name: "${v.name}", Lang: "${v.lang}"`);
      });
    }
  }
}

// Subscribe to browser voices change event immediately to keep cache hot
if (typeof window !== "undefined" && window.speechSynthesis) {
  updateCachedVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    console.log("[SpeechSynthesis] Event onvoiceschanged fired.");
    updateCachedVoices();
  };
}

/**
 * Loads the browser speech synthesis voices asynchronously.
 * Uses onvoiceschanged event and falls back to a timeout if voices aren't loaded.
 */
export function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  return new Promise((resolve) => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!synth) {
      resolve([]);
      return;
    }

    const voices = synth.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    const handleVoicesChanged = () => {
      const updatedVoices = synth.getVoices() || [];
      if (updatedVoices.length > 0) {
        cachedVoices = updatedVoices;
        synth.onvoiceschanged = null;
        resolve(updatedVoices);
      }
    };

    synth.onvoiceschanged = handleVoicesChanged;

    // Fallback timeout of 2 seconds in case onvoiceschanged does not fire
    setTimeout(() => {
      if (synth.onvoiceschanged === handleVoicesChanged) {
        synth.onvoiceschanged = null;
        const finalVoices = synth.getVoices() || [];
        cachedVoices = finalVoices;
        resolve(finalVoices);
      }
    }, 2000);
  });
}

/**
 * Selects the best matching voice based on the text language (Hindi vs. English/Hinglish)
 * and the user-specified priority requirements.
 */
export function selectVoice(voices: SpeechSynthesisVoice[], text: string): SpeechSynthesisVoice | null {
  const isHindi = isHindiText(text);

  // Female Hindi voice priority list
  const hindiFemalePatterns = [
    "google हिन्दी",
    "swara",
    "kalpana",
    "heera",
    "lekha"
  ];

  // Female Indian English voice priority list
  const englishIndiaFemalePatterns = [
    "neerja",
    "veena",
    "google english (india) female",
    "google english (india)"
  ];

  if (isHindi) {
    // 1. Look for female Hindi voices first
    for (const pattern of hindiFemalePatterns) {
      const matched = voices.find((v) => {
        const nameLower = v.name.toLowerCase();
        const langLower = v.lang.toLowerCase().replace("_", "-");
        return nameLower.includes(pattern) && (langLower.startsWith("hi") || langLower.startsWith("hin"));
      });
      if (matched) {
        console.log(`[SpeechSynthesis] Selected female Hindi voice: "${matched.name}" [${matched.lang}]`);
        return matched;
      }
    }

    // 2. Look for any other Hindi voice (e.g. Madhur, Hemant, etc.)
    const anyHiVoice = voices.find((v) => {
      const lang = v.lang.toLowerCase().replace("_", "-");
      return lang.startsWith("hi") || lang.startsWith("hin");
    });
    if (anyHiVoice) {
      console.log(`[SpeechSynthesis] Selected Hindi voice fallback: "${anyHiVoice.name}" [${anyHiVoice.lang}]`);
      return anyHiVoice;
    }

    // 3. Fallback: Look for female Indian English voices (will read transliterated Hinglish with a female Indian accent)
    for (const pattern of englishIndiaFemalePatterns) {
      const matched = voices.find((v) => {
        const nameLower = v.name.toLowerCase();
        const langLower = v.lang.toLowerCase().replace("_", "-");
        return nameLower.includes(pattern) && (langLower === "en-in" || langLower.startsWith("en-in"));
      });
      if (matched) {
        console.warn(`[SpeechSynthesis] Hindi voice not found. Selecting female Indian English fallback: "${matched.name}" [${matched.lang}]`);
        return matched;
      }
    }

    // 4. Fallback: Any other Indian English voice (e.g., Ravi, Prabhat)
    const anyEnInVoice = voices.find((v) => {
      const nameLower = v.name.toLowerCase();
      const langLower = v.lang.toLowerCase().replace("_", "-");
      return (
        langLower === "en-in" ||
        langLower.startsWith("en-in") ||
        nameLower.includes("india") ||
        nameLower.includes("indian") ||
        nameLower.includes("ravi") ||
        nameLower.includes("neerja") ||
        nameLower.includes("prabhat")
      );
    });
    if (anyEnInVoice) {
      console.warn(`[SpeechSynthesis] Hindi voice not found. Selecting Indian English fallback: "${anyEnInVoice.name}" [${anyEnInVoice.lang}]`);
      return anyEnInVoice;
    }
  } else {
    // English or Hinglish text: Prioritize female Indian English voices for a natural local female accent
    for (const pattern of englishIndiaFemalePatterns) {
      const matched = voices.find((v) => {
        const nameLower = v.name.toLowerCase();
        const langLower = v.lang.toLowerCase().replace("_", "-");
        return nameLower.includes(pattern) && (langLower === "en-in" || langLower.startsWith("en-in"));
      });
      if (matched) {
        return matched;
      }
    }

    // Fallback to any Indian English voice
    const anyEnInVoice = voices.find((v) => {
      const nameLower = v.name.toLowerCase();
      const langLower = v.lang.toLowerCase().replace("_", "-");
      return (
        langLower === "en-in" ||
        langLower.startsWith("en-in") ||
        nameLower.includes("india") ||
        nameLower.includes("indian") ||
        nameLower.includes("ravi") ||
        nameLower.includes("neerja") ||
        nameLower.includes("prabhat")
      );
    });
    if (anyEnInVoice) {
      return anyEnInVoice;
    }

    // Fallback to any English voice
    const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
    if (enVoice) {
      return enVoice;
    }
  }

  // Final fallback to default voice or first available
  const defaultVoice = voices.find((v) => v.default) || voices[0] || null;
  console.log("[SpeechSynthesis] Fallback to default voice:", defaultVoice ? `"${defaultVoice.name}" [${defaultVoice.lang}]` : "None");
  return defaultVoice;
}

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let playbackQueue: { text: string; isHindi: boolean }[] = [];
let currentQueueIndex = -1;
let isPlaybackCancelled = false;

/**
 * Helper to configure and trigger the utterance.
 * Must be called in a synchronous handler or within a safe user gesture window.
 */
function speakWithVoices(
  synth: SpeechSynthesis,
  voices: SpeechSynthesisVoice[],
  text: string,
  isHindi: boolean,
  options?: SpeakOptions
): void {
  // Console logs required:
  console.log("[SpeechSynthesis] available voices:");
  voices.forEach((v) => {
    console.log(`  - "${v.name}" [${v.lang}]`);
  });

  // Cancel any active speech first
  stopSpeech();
  isPlaybackCancelled = false;

  // Split text into Hindi and English segments
  const segments = splitTextIntoSegments(text);
  if (segments.length === 0) {
    options?.onEnd?.();
    return;
  }

  console.log("[SpeechSynthesis] Split text into segments:", segments);
  playbackQueue = segments;
  currentQueueIndex = 0;

  let started = false;
  
  // Unblock frozen browser speech states
  synth.resume();

  function speakNext(): void {
    if (isPlaybackCancelled) {
      console.log("[SpeechSynthesis] Playback was cancelled. Stopping queue execution.");
      return;
    }

    if (currentQueueIndex >= playbackQueue.length) {
      console.log("[SpeechSynthesis] Speech synthesis completed successfully (all segments).");
      currentUtterance = null;
      playbackQueue = [];
      currentQueueIndex = -1;
      options?.onEnd?.();
      return;
    }

    const seg = playbackQueue[currentQueueIndex];
    const isSegHindi = seg.isHindi;
    const selectedVoice = selectVoice(voices, seg.text);
    
    console.log(`[SpeechSynthesis] Segment ${currentQueueIndex} selected voice:`, selectedVoice ? `"${selectedVoice.name}" [${selectedVoice.lang}]` : "None");

    let textToSpeak = seg.text;
    const isSelectedVoiceHindi = selectedVoice && selectedVoice.lang.toLowerCase().startsWith("hi");
    const hasHindiVoice = voices.some((v) => v.lang.toLowerCase().startsWith("hi"));

    if (isSegHindi && (!hasHindiVoice || (selectedVoice && !isSelectedVoiceHindi))) {
      console.log(`[SpeechSynthesis] Segment ${currentQueueIndex} Fallback: Transliterating to Roman script.`);
      textToSpeak = transliterateHindi(seg.text);
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else if (voices.length > 0) {
      utterance.voice = voices[0];
      utterance.lang = voices[0].lang;
    } else {
      utterance.lang = isSegHindi ? "hi-IN" : "en-US";
    }

    // Normal speaking pacing
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (!started) {
        started = true;
        console.log("[SpeechSynthesis] speech start");
        options?.onStart?.();
      }
    };

    utterance.onend = () => {
      console.log(`[SpeechSynthesis] Segment ${currentQueueIndex} finished speaking.`);
      currentQueueIndex++;
      // Speak next segment in the next event loop tick to give TTS engine breathing room
      setTimeout(speakNext, 50);
    };

    utterance.onerror = (event) => {
      console.error(`[SpeechSynthesis] Segment ${currentQueueIndex} error:`, event);
      if (event.error === "interrupted" || event.error === "canceled") {
        console.log(`[SpeechSynthesis] Segment ${currentQueueIndex} was interrupted or canceled.`);
        return;
      }
      options?.onError?.(new Error(event.error ? `Speech synthesis error: ${event.error}` : "Speech synthesis failed."));
    };

    currentUtterance = utterance;
    synth.speak(utterance);
  }

  speakNext();
}

/**
 * Speaks the given text using the best matching browser voice.
 * Keeps execution synchronous if cached voices are ready to preserve user gesture activation.
 */
export function speakText(text: string, options?: SpeakOptions): void {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  if (!synth) {
    const error = new Error("Speech synthesis is not supported in this browser.");
    console.error("[SpeechSynthesis] speech error:", error);
    options?.onError?.(error);
    return;
  }

  // Console logs required:
  console.log("[SpeechSynthesis] detected text:", text);
  const isHindi = isHindiText(text);
  console.log("[SpeechSynthesis] detected language:", isHindi ? "hi-IN" : "en-IN");

  // Query fresh voices directly from browser
  const currentVoices = synth.getVoices() || [];
  const voicesToUse = currentVoices.length > 0 ? currentVoices : cachedVoices;

  const speakImmediately = (voices: SpeechSynthesisVoice[]) => {
    try {
      speakWithVoices(synth, voices, text, isHindi, options);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("[SpeechSynthesis] speech error:", error);
      options?.onError?.(error);
    }
  };

  if (voicesToUse.length > 0) {
    speakImmediately(voicesToUse);
  } else {
    console.log("[SpeechSynthesis] Voices not loaded yet. Waiting for available voices before speaking.");
    getVoicesAsync()
      .then((voices) => {
        if (voices.length > 0) {
          speakImmediately(voices);
        } else {
          console.warn("[SpeechSynthesis] No voices available after load; speaking with fallback settings.");
          speakImmediately([]);
        }
      })
      .catch((err) => {
        const error = err instanceof Error ? err : new Error(String(err));
        console.warn("[SpeechSynthesis] Could not preload voices:", error);
        speakImmediately([]);
      });
  }
}

/**
 * Stops any current speech output in progress.
 */
export function stopSpeech(): void {
  isPlaybackCancelled = true;
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  if (synth) {
    if (synth.speaking || synth.pending) {
      console.log("[SpeechSynthesis] Stopping current speech synthesis.");
      synth.cancel();
    }
  }
  currentUtterance = null;
  playbackQueue = [];
  currentQueueIndex = -1;
}
