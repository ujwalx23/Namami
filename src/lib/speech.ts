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
  const segments: { text: string; isHindi: boolean }[] = [];
  const regex = /(\[[^\]]+\]|\([^)]+\))/g;
  const parts = text.split(regex);
  
  for (const part of parts) {
    if (!part.trim()) continue;
    
    const isHindi = /[\u0900-\u097F]/.test(part);
    
    let cleanPart = part.trim();
    if (cleanPart.startsWith('[') && cleanPart.endsWith(']')) {
      cleanPart = cleanPart.substring(1, cleanPart.length - 1).trim();
    } else if (cleanPart.startsWith('(') && cleanPart.endsWith(')')) {
      cleanPart = cleanPart.substring(1, cleanPart.length - 1).trim();
    }
    
    if (cleanPart) {
      segments.push({
        text: cleanPart,
        isHindi
      });
    }
  }
  
  return segments;
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
  synth.cancel();

  // Split text into Hindi and English segments
  const segments = splitTextIntoSegments(text);
  if (segments.length === 0) {
    options?.onEnd?.();
    return;
  }

  console.log("[SpeechSynthesis] Split text into segments:", segments);

  let started = false;
  
  // Unblock frozen browser speech states
  synth.resume();

  segments.forEach((seg, index) => {
    const isSegHindi = seg.isHindi;
    const selectedVoice = selectVoice(voices, seg.text);
    
    console.log(`[SpeechSynthesis] Segment ${index} selected voice:`, selectedVoice ? `"${selectedVoice.name}" [${selectedVoice.lang}]` : "None");

    let textToSpeak = seg.text;
    const isSelectedVoiceHindi = selectedVoice && selectedVoice.lang.toLowerCase().startsWith("hi");
    const hasHindiVoice = voices.some((v) => v.lang.toLowerCase().startsWith("hi"));

    if (isSegHindi && (!hasHindiVoice || (selectedVoice && !isSelectedVoiceHindi))) {
      console.log(`[SpeechSynthesis] Segment ${index} Fallback: Transliterating to Roman script.`);
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
      console.log(`[SpeechSynthesis] Segment ${index} finished speaking.`);
      if (index === segments.length - 1) {
        console.log("[SpeechSynthesis] Speech synthesis completed successfully (last segment).");
        currentUtterance = null;
        options?.onEnd?.();
      }
    };

    utterance.onerror = (event) => {
      console.error(`[SpeechSynthesis] Segment ${index} error:`, event);
      if (event.error === "interrupted" || event.error === "canceled") {
        console.log(`[SpeechSynthesis] Segment ${index} was interrupted or canceled.`);
        return;
      }
      options?.onError?.(new Error(event.error ? `Speech synthesis error: ${event.error}` : "Speech synthesis failed."));
    };

    currentUtterance = utterance;
    synth.speak(utterance);
  });
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
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  if (synth) {
    if (synth.speaking || synth.pending) {
      console.log("[SpeechSynthesis] Stopping current speech synthesis.");
      synth.cancel();
    }
  }
  currentUtterance = null;
}
