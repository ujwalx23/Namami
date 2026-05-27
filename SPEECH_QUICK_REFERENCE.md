# Quick Reference - Browser Speech Synthesis

## 🚀 Quick Start

```typescript
import { speakText, stopSpeech } from '@/lib/speech';

// Speak Hindi text
await speakText("जय श्री राम", {
  onStart: () => console.log("Started"),
  onEnd: () => console.log("Done"),
  onError: (err) => console.error("Error:", err),
});

// Speak English text
await speakText("Welcome to the temple", {
  onEnd: () => console.log("Speech finished"),
});

// Stop current speech
stopSpeech();
```

---

## 🎤 Voice Selection

| Text Type | Language Detected | Voice Priority | Voice Used |
|-----------|-------------------|-----------------|-----------|
| जय श्री राम | Hindi (Devanagari) | Google हिन्दी → Microsoft Heera → hi-IN | Hindi voice |
| Welcome here | English (Latin) | en-IN → en-US → any English | English India |
| Namaste dosto | English (Latin) | en-IN → en-US → any English | English (Hinglish) |

---

## 📊 Console Output

```
// When speaking Hindi:
[SpeechSynthesis] Selected Hindi prioritized voice: "Google हिन्दी" (hi-IN)
[SpeechSynthesis] Speaking started for text: "जय श्री राम"
[SpeechSynthesis] Speaking ended successfully.

// When speaking English:
[SpeechSynthesis] Selected English India voice: "Microsoft Zira" (en-IN)
[SpeechSynthesis] Speaking started for text: "Welcome"
[SpeechSynthesis] Speaking ended successfully.
```

---

## 🔧 API Reference

### speakText(text, options)
```typescript
interface SpeakOptions {
  onStart?: () => void;        // Called when speech starts
  onEnd?: () => void;          // Called when speech ends
  onError?: (err: Error) => void;  // Called on error
}

// Usage
await speakText("नमस्ते", {
  onStart: () => setSpeaking(true),
  onEnd: () => setSpeaking(false),
  onError: (err) => setError(err.message),
});
```

### stopSpeech()
```typescript
// Stops current speech immediately
stopSpeech();
```

---

## ✅ Testing

### Test in Browser Console
```javascript
// Import and test (in component)
import { speakText, stopSpeech } from '@/lib/speech';

// Test 1: Hindi
await speakText("जय श्री राम। कल मंदिर में भजन संध्या होगी।");

// Test 2: English
await speakText("Welcome everyone to the temple.");

// Test 3: Hinglish (sounds English)
await speakText("Namaste dosto, kal mandir mein maha aarti hogi.");

// Stop
stopSpeech();
```

### Visit Page
1. Open: http://localhost:8080/sandesh
2. Click "Listen to Sandesh" button
3. Check browser console for [SpeechSynthesis] logs
4. Verify voice output

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| No sound | Check browser volume, verify voices loaded |
| Wrong voice | Check console for selected voice, verify Windows has Hindi TTS |
| Slow speech | Normal - rate set to 0.95 for clarity |
| Text not detected as Hindi | Ensure using Devanagari characters (not Latin) |
| Error in console | Check error message, verify browser supports Web Speech API |

---

## 📁 Files

- **Speech Implementation**: `src/lib/speech.ts` (305 lines)
- **Component Using It**: `src/routes/sandesh.tsx`
- **Translations**: `src/i18n/translations.ts`
- **Documentation**: `SPEECH_SYNTHESIS_IMPLEMENTATION.md`

---

## ⚙️ Configuration

**Current Settings**:
```typescript
utterance.rate = 0.95;    // Slightly slower for clarity
utterance.pitch = 1.0;    // Normal pitch
utterance.lang = isHindi ? "hi-IN" : "en-IN";
```

To change, edit `src/lib/speech.ts` around line 165-170.

---

## 🎯 Key Features

✅ No external APIs or dependencies  
✅ Hindi text auto-detection  
✅ Voice prioritization system  
✅ Graceful error handling  
✅ Console logging with [SpeechSynthesis] prefix  
✅ Mobile responsive  
✅ Production ready  
✅ Free (uses browser built-in)

---

## 📞 Support

All functionality is built on **Web Speech API** (browser native).
- Works offline
- No API keys needed
- No monthly costs
- Voice quality depends on system TTS voices

For voice quality, ensure Windows has:
- Google हिन्दी TTS installed (or)
- Microsoft Heera TTS installed
