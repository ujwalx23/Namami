// Central translation dictionary. Keys are dot-paths.
// English is the source; Hindi is the user-facing translation.

export type Lang = "en" | "hi";

export const translations = {
  // ---- Common / Header / Footer ----
  "brand.name": { en: "Namami Vindhyavasini", hi: "नमामि विन्ध्यवासिनी" },
  "brand.tag": { en: "Sansthan ✦ Trust", hi: "संस्थान ✦ ट्रस्ट" },

  "nav.home": { en: "Home", hi: "होम" },
  "nav.about": { en: "About", hi: "हमारे बारे में" },
  "nav.sandesh": { en: "Sandesh", hi: "संदेश" },
  "nav.events": { en: "Events", hi: "कार्यक्रम" },
  "nav.videos": { en: "Videos", hi: "वीडियो" },
  "nav.shorts": { en: "Shorts", hi: "शॉर्ट्स" },
  "nav.panchang": { en: "Panchang", hi: "पंचांग" },
  "nav.reviews": { en: "Reviews", hi: "समीक्षा" },
  "nav.gallery": { en: "Gallery", hi: "गैलरी" },
  "nav.donation": { en: "Donation", hi: "दान" },
  "nav.contact": { en: "Contact", hi: "संपर्क" },
  "nav.donate_btn": { en: "Donate", hi: "दान करें" },
  "nav.menu": { en: "Menu", hi: "मेनू" },
  "lang.toggle": { en: "हिंदी", hi: "EN" },

  "footer.tagline": {
    en: "A devotional trust dedicated to spreading the divine grace of Maa Vindhyavasini, preserving sacred traditions and serving devotees through seva, sanskar and satsang.",
    hi: "एक भक्तिमय न्यास जो माँ विन्ध्यवासिनी की दिव्य कृपा का प्रसार, पवित्र परम्पराओं की रक्षा तथा सेवा, संस्कार और सत्संग के माध्यम से भक्तों की सेवा को समर्पित है।",
  },
  "footer.quick": { en: "Quick Links", hi: "त्वरित लिंक" },
  "footer.reach": { en: "Reach Us", hi: "हमसे संपर्क" },
  "footer.address": {
    en: "Vindhyachal Dham, Mirzapur, UP",
    hi: "विन्ध्याचल धाम, मिर्जापुर, उ.प्र.",
  },
  "footer.copy": {
    en: "Namami Vindhyavasini Sansthan ✦ Jai Maa Vindhyavasini",
    hi: "नमामि विन्ध्यवासिनी संस्थान ✦ जय माँ विन्ध्यवासिनी",
  },

  // ---- Home page ----
  "home.badge": { en: "Jai Maa Vindhyavasini", hi: "जय माँ विन्ध्यवासिनी" },
  "home.hero.title1": { en: "Embrace Divine", hi: "दिव्य कृपा का" },
  "home.hero.title2": { en: "Grace", hi: "आलिंगन" },
  "home.hero.desc": {
    en: "Step into the sacred world of Maa Vindhyavasini, the divine Shakti Pitha of the Vindhya range. Our sansthan preserves the ancient rituals of the Devi, organises satsang and seva and welcomes every devotee into the bhakti of the Mother.",
    hi: "माँ विन्ध्यवासिनी के पावन धाम में प्रवेश करें, जो विन्ध्य पर्वत की जागृत शक्तिपीठ है। हमारा संस्थान देवी की प्राचीन परम्पराओं का संरक्षण करता है, सत्संग एवं सेवा का आयोजन करता है, और हर भक्त को माँ की भक्ति में आमंत्रित करता है।",
  },
  "home.cta.today": { en: "Divine Sandesh", hi: "दिव्य संदेश" },
  "home.cta.about": { en: "About Dham", hi: "धाम के बारे में" },

  "home.slide.vindhya.title": { en: "Namami Vindhyavasini", hi: "नमामि विन्ध्यवासिनी" },
  "home.slide.vindhya.sub": { en: "Vindhyachal Dham", hi: "विन्ध्याचल धाम" },
  "home.slide.darshan.title": { en: "Divine Darshan", hi: "दिव्य दर्शन" },
  "home.slide.shringar.title": { en: "Maa ka Shringar", hi: "माँ का श्रृंगार" },

  "home.intro.kicker": { en: "🌺 SANATAN PARAMPARA", hi: "🌺 सनातन परम्परा" },
  "home.intro.title": { en: "A Legacy of Faith and Seva", hi: "श्रद्धा और सेवा की विरासत" },
  "home.card.purpose.title": { en: "Our Purpose", hi: "हमारा उद्देश्य" },
  "home.card.purpose.text": {
    en: "To serve devotees of Maa Vindhyavasini with devotion, compassion and dedication. Our mission is to preserve Sanatan values, support spiritual growth and create meaningful opportunities for worship, seva and community service.",
    hi: "माँ विन्ध्यवासिनी के भक्तों की भक्ति, करुणा और समर्पण के साथ सेवा करना। हमारा मिशन सनातन मूल्यों को संरक्षित करना, आध्यात्मिक विकास का समर्थन करना और पूजा, सेवा एवं सामुदायिक सेवा के अवसर प्रदान करना है।",
  },
  "home.card.trust.title": { en: "Devotee Support", hi: "भक्त सहायता" },
  "home.card.trust.text": {
    en: "We assist devotees with temple information, appointment bookings and religious activities. Our goal is to provide timely guidance and support for a smooth and meaningful devotional experience.",
    hi: "हम भक्तों को मंदिर की जानकारी, अपॉइंटमेंट बुकिंग और धार्मिक गतिविधियों में सहायता करते हैं। हमारा लक्ष्य एक सुचारु और सार्थक भक्ति अनुभव के लिए समय पर मार्गदर्शन और सहायता प्रदान करना है।",
  },
  "home.card.guidance.title": { en: "Donation Impact", hi: "दान का प्रभाव" },
  "home.card.guidance.text": {
    en: "Your generous contributions support temple operations, religious activities and community service programs. We ensure that every donation is utilized with care, purpose and transparency. 🌺🙏",
    hi: "आपके उदार योगदान से मंदिर संचालन, धार्मिक गतिविधियों और सामुदायिक सेवा कार्यक्रमों को सहायता मिलती है। हम सुनिश्चित करते हैं कि प्रत्येक दान का उपयोग सावधानी, उद्देश्य और पारदर्शिता के साथ हो। 🌺🙏",
  },

  "home.sandesh.kicker": { en: "Daily Wisdom", hi: "दैनिक प्रेरणा" },
  "home.sandesh.title": { en: "Sandesh", hi: "संदेश" },
  "home.sandesh.quote": {
    en: "“Where there is shraddha, there resides the Mother. Keep your heart pure and Devi's grace will find you on its own.”",
    hi: "“जहाँ श्रद्धा है, वहीं माँ का वास है। अपने हृदय को निर्मल रखो, और देवी की कृपा स्वयं तुम्हें खोज लेगी।”",
  },
  "home.sandesh.author": { en: "— Pujya Guru Ji", hi: "— पूज्य गुरुजी" },
  "home.sandesh.read": { en: "Read all sandesh", hi: "सभी संदेश पढ़ें" },
  "home.pillars": { en: "Shanti ✦ Bhakti ✦ Sewa", hi: "शान्ति ✦ भक्ति ✦ सेवा" },
  "home.pillars.sub": { en: "Three pillars of our path", hi: "हमारे मार्ग के तीन स्तम्भ" },

  "home.events.kicker": { en: "What's Happening", hi: "आगामी" },
  "home.events.title": { en: "Upcoming Events", hi: "आगामी कार्यक्रम" },
  "home.events.viewall": { en: "View all", hi: "सभी देखें" },

  "home.shakti.kicker": { en: "Shakti Pitha", hi: "शक्तिपीठ" },
  "home.shakti.title": { en: "Maa Vindhyavasini Dham", hi: "माँ विन्ध्यवासिनी धाम" },
  "home.shakti.text": {
    en: "On the holy banks of the Ganga, in the Vindhya hills of Mirzapur, sits one of India's most powerful Shakti Pithas. Devi Vindhyavasini is worshipped here as the protector of dharma and she is the eternal Mother who chose this land after slaying Mahishasura.",
    hi: "गंगा के पावन तट पर, मिर्जापुर के विन्ध्य पर्वतों में, भारत के अत्यंत प्रतापी शक्तिपीठों में से एक विराजमान है। यहाँ देवी विन्ध्यवासिनी धर्म की रक्षिका के रूप में पूजित हैं, तथा वे ही सनातन माँ हैं जिन्होंने महिषासुर का वध करके इस भूमि को अपना धाम बनाया।",
  },
  "home.shakti.stat1": { en: "Shakti Pitha", hi: "शक्तिपीठ" },
  "home.shakti.stat1v": { en: "of Devi Durga", hi: "देवी दुर्गा का" },
  "home.shakti.stat2": { en: "Maha Trishakti", hi: "महात्रिशक्ति" },
  "home.shakti.stat2v": { en: "Lakshmi • Kali • Saraswati", hi: "लक्ष्मी • काली • सरस्वती" },
  "home.shakti.stat3": { en: "Trikona", hi: "त्रिकोण" },
  "home.shakti.stat3v": { en: "Parikrama route", hi: "परिक्रमा मार्ग" },

  "home.cta2.sanskrit": { en: "॥ सर्वे भवन्तु सुखिनः ॥", hi: "॥ सर्वे भवन्तु सुखिनः ॥" },
  "home.cta2.title": { en: "Be Part of the Divine Journey", hi: "इस दिव्य यात्रा का अंग बनिये" },
  "home.cta2.text": {
    en: "Join our satsang, contribute to seva, or visit the temple. Maa's doors are always open.",
    hi: "सत्संग में जुड़िये, सेवा में सहयोग कीजिये, या मंदिर में दर्शन कीजिये। माँ के द्वार सदा खुले हैं।",
  },
  "home.cta2.donate": { en: "Donate", hi: "दान करें" },
  "home.cta2.contact": { en: "Contact Us", hi: "हमसे संपर्क" },

  // ---- About page ----
  "about.sanskrit": {
    en: "॥ महालक्ष्मी महाकाली महासरस्वती स्वरूपिण्यै नमः ॥",
    hi: "॥ महालक्ष्मी महाकाली महासरस्वती स्वरूपिण्यै नमः ॥",
  },
  "about.title": { en: "Maa Vindhyavasini Dham", hi: "माँ विन्ध्यवासिनी धाम" },
  "about.subtitle": {
    en: "One of the most ancient Shakti Pithas of Bharat, serving as the abode of Devi Durga in the Vindhya hills.",
    hi: "भारत के प्राचीनतम शक्तिपीठों में से एक, जो विन्ध्य पर्वत में विराजमान देवी दुर्गा का पावन धाम है।",
  },
  "about.deity.title": {
    en: "The Divine Descent of Yogmaya",
    hi: "योगमाया का दिव्य अवतरण",
  },
  "about.deity.text": {
    en: "Devi Vindhyavasini is the ultimate manifestation of Adi Parashakti, who descended as Yogmaya. Scriptural tradition states that she took birth from the womb of Yashoda in Nanda Gokul on the same night Sri Krishna was born in Mathura. To save the divine infant, Vasudeva exchanged Krishna with Yogmaya. When the tyrant king Kansa attempted to kill her by dashing her against a stone, she slipped from his grasp, ascended majestically into the sky and assumed her magnificent eight-armed form (Ashtabhuja). She proclaimed Kansa's impending destruction before choosing the sacred Vindhya hills as her eternal residence, where she continues to bless and protect her devotees.",
    hi: "देवी विन्ध्यवासिनी आदिशक्ति का साक्षात स्वरूप हैं, जो योगमाया के रूप में अवतरित हुईं। शास्त्रों के अनुसार, उनका जन्म नन्द गोकुल में यशोदा के गर्भ से उसी रात्रि को हुआ था जिस रात्रि मथुरा में भगवान श्रीकृष्ण का जन्म हुआ था। कंस से नवजात शिशु की रक्षा के लिए वासुदेव ने कृष्ण को योगमाया से बदल दिया। जब अत्याचारी राजा कंस ने शिला पर पटक कर इस कन्या का वध करना चाहा, तो वह उसके हाथों से फिसलकर आकाश में विलीन हो गईं और अपने भव्य अष्टभुज (अष्टभुजा) रूप में प्रकट हुईं। कंस के विनाश की घोषणा करने के पश्चात उन्होंने पावन विन्ध्य पर्वतमाला को अपने सनातन निवास के रूप में चुना, जहाँ वे आज भी अपने भक्तों पर निरंतर कृपा बरसाती हैं।",
  },
  "about.kajari.title": {
    en: "Kajari Folk Music Tradition",
    hi: "कजरी लोक संगीत और सांस्कृतिक धरोहर",
  },
  "about.kajari.text": {
    en: "Vindhyachal is the birth-cradle of Kajari (Kajali), the sublime monsoon folk music tradition of India. Etymologically linked to 'Kajal' (kohl) and the monsoon clouds, it directly celebrates Devi Vindhyavasini's dark-skinned, rainfall-bestowing form as Kajali Devi. During the holy month of Shravana, local classical and folk singers perform Kajari melodies in the temple premises. This beautiful music expresses the deep longing, spiritual devotion and joyous celebrations of the local community, keeping the divine feminine energy alive in every home.",
    hi: "विन्ध्याचल भारत की प्रसिद्ध वर्षाकालीन लोक संगीत परंपरा 'कजरी' (कजली) का उद्गम स्थल है। कजरी शब्द का सीधा संबंध 'काजल' और वर्षा ऋतु के श्याम मेघों से है, जो सीधे माँ विन्ध्यवासिनी के मेघ-श्याम रूप (कजली देवी) की महिमा और वर्षा प्रदान करने वाले स्वरूप की स्तुति करता है। श्रावण के पवित्र महीने में, स्थानीय शास्त्रीय और लोक गायक मंदिर परिसर में कजरी की तान छेड़ते हैं। यह सुंदर संगीत विरह, आध्यात्मिक भक्ति और प्रकृति के उल्लास को व्यक्त करता है, जिससे माँ की दिव्य ऊर्जा जन-जन के हृदय में प्रवाहित होती है।",
  },
  "about.fact.deity.label": { en: "Primary Deity", hi: "मुख्य विग्रह" },
  "about.fact.deity.value": {
    en: "Maa Vindhyavasini (Maha Lakshmi / Yogmaya)",
    hi: "माँ विन्ध्यवासिनी (महालक्ष्मी / योगमाया)",
  },
  "about.fact.location.label": { en: "Location", hi: "भौगोलिक स्थिति" },
  "about.fact.location.value": {
    en: "Vindhyachal, Mirzapur, Uttar Pradesh",
    hi: "विन्ध्याचल, मिर्जापुर, उत्तर प्रदेश",
  },
  "about.fact.river.label": { en: "Sacred River", hi: "पाวน नदी" },
  "about.fact.river.value": {
    en: "Uttar Vahini Ganga (Holy Ganges)",
    hi: "उत्तरवाहिनी गंगा (पतित पावनी गंगा)",
  },
  "about.fact.scriptures.label": { en: "Scriptural Mentions", hi: "शास्त्रों में उल्लेख" },
  "about.fact.scriptures.value": {
    en: "Durga Saptashati, Markandeya Purana, Devi Bhagavata",
    hi: "दुर्गा सप्तशती, मार्कण्डेय पुराण, देवी भागवत पुराण",
  },
  "about.fact.architecture.label": { en: "Architectural Style", hi: "स्थापत्य शैली" },
  "about.fact.architecture.value": {
    en: "Nagara Style (Vindhya Corridor Phase)",
    hi: "नागर शैली (विन्ध्य कॉरिडोर स्वरूप)",
  },
  "about.fact.status.label": { en: "Temple Status", hi: "मंदिर की स्थिति" },
  "about.fact.status.value": {
    en: "Ancient Shakti Pitha (Active Worship)",
    hi: "अति प्राचीन शक्तिपीठ (सक्रिय उपासना)",
  },
  "about.intro": {
    en: "Maa Vindhyavasini Temple at Vindhyachal is a celebrated Hindu shrine dedicated to the mother goddess Vindhyavasini, situated on the holy banks of the Uttar Vahini Ganga in Mirzapur, Uttar Pradesh. Revered as one of the most powerful Shakti Pithas of Bharat, the Goddess is also lovingly worshipped as Kajari Devi, symbolizing her deep kohl-dark monsoon complexion that brings protection and blessings to all devotees.",
    hi: "विन्ध्याचल में स्थित माँ विन्ध्यवासिनी मंदिर उत्तर प्रदेश के मिर्जापुर में पवित्र उत्तरवाहिनी गंगा के तट पर स्थापित एक अत्यंत पूजनीय हिंदू तीर्थ है। भारत के सबसे प्रतापी शक्तिपीठों में से एक के रूप में पूजित, माँ को यहाँ श्रद्धालु प्रेमपूर्वक कजरी देवी के रूप में भी पूजते हैं, जो उनके वर्षाकालीन श्याम-मेघ वर्ण और भक्तों पर उनकी निरंतर बरसती कृपा का प्रतीक है।",
  },

  "about.history.title": { en: "History & Sacred Origin", hi: "इतिहास एवं पौराणिक उत्पत्ति" },
  "about.history.text": {
    en: "Mentioned in the Rig Veda and Durga Saptashati, Maa Vindhyavasini Temple is one of Bharat's oldest Shakti shrines. Scriptural tradition holds that the Devi took birth as Yogmaya (Krishna's sibling) and chose the Vindhya range as her eternal abode after defeating Mahishasura. Worshipped also as Kajari Devi due to her kohl-dark monsoon complexion, this Dham has drawn sages like Markandeya, Vyasa and the Pandavas for millennia.",
    hi: "ऋग्वेद और दुर्गा सप्तशती में वर्णित माँ विन्ध्यवासिनी मंदिर भारत के प्राचीनतम शक्तिपीठों में से एक है। पौराणिक मान्यता है कि देवी ने कृष्ण की बहन योगमाया के रूप में जन्म लिया और महिषासुर का वध करने के बाद विन्ध्य पर्वत को अपना शाश्वत निवास बनाया। अपने मेघ-श्याम वर्ण के कारण वे 'कजरी देवी' के रूप में भी पूजी जाती हैं, जहाँ सदियों से महर्षि मार्कण्डेय, व्यास और पाण्डव आराधना करते आ रहे हैं।",
  },
  "about.history.detailed.p1": {
    en: "The sacred history of Maa Vindhyavasini is deeply woven into the oldest spiritual scriptures of Bharat, including the Rig Veda, Markandeya Purana, Devi Bhagavata and the Durga Saptashati. As one of the most ancient and continuously worshipped Shakti shrines, Vindhyachal Dham stands as an eternal source of spiritual energy where sages, seers and devotees have gathered for millennia.",
    hi: "माँ विन्ध्यवासिनी का पावन इतिहास भारत के प्राचीनतम धर्मग्रंथों में गहराई से समाया हुआ है, जिनमें ऋग्वेद, मार्कण्डेय पुराण, देवी भागवत और श्री दुर्गा सप्तशती प्रमुख हैं। निरंतर आराधना और उपासना का केंद्र रहा विन्ध्याचल धाम एक जागृत सिद्धपीठ है, जहाँ अनादि काल से ऋषि-मुनि, साधक और भक्त ऊर्जा और आशीर्वाद प्राप्त करने के लिए एकत्रित होते रहे हैं।",
  },
  "about.history.detailed.p2": {
    en: "According to the Puranas, the Devi took birth as Yogmaya, the sibling of Bhagavan Sri Krishna, to facilitate his divine escape from the tyrant Kansa. When Kansa attempted to dash the newborn child against a stone, she slipped from his hands, soared into the heavens and revealed her majestic eight-armed divine form. Proclaiming Kansa's doom, she descended upon the sacred Vindhya hills, establishing her permanent throne of protection and grace.",
    hi: "पौराणिक मान्यताओं के अनुसार, देवी ने भगवान श्रीकृष्ण की रक्षा हेतु नन्द गोकुल में योगमाया के रूप में यशोदा माता के गर्भ से अवतार लिया था। जब अत्याचारी कंस ने उस नवजात कन्या को शिला पर पटककर मारना चाहा, तो वे उसके हाथों से फिसलकर आकाश में विलीन हो गईं और अष्टभुज दिव्य रूप धारण किया। कंस के विनाश की घोषणा करने के बाद, उन्होंने इस पावन विन्ध्य पर्वत श्रृंखला को अपना सनातन निवास बनाया।",
  },
  "about.history.detailed.p3": {
    en: "Here, the Mother defeated Mahishasura, Shumbha and Nishumbha, restoring cosmic order. The local traditions also celebrate her as Kajari Devi, a name symbolizing her dark monsoon complexion that brings cooling rain and relief to the earth. Legends state that great sages like Markandeya, Maharishi Vyasa and the Pandavas during their vanvas offered intense penance and received divine boons at this exact spot.",
    hi: "विन्ध्य क्षेत्र में ही देवी ने महिषासुर, शुम्भ और निशुम्भ जैसे महाभयानक असुरों का संहार कर सृष्टि में धर्म की पुनर्स्थापना की। स्थानीय परंपराओं में वे 'कजरी देवी' के नाम से भी पूजी जाती हैं, जो उनके श्याम-मेघ वर्ण और शीतलता प्रदान करने वाले वर्षाकालीन स्वरूप का प्रतीक है। मान्यता है कि महर्षि मार्कण्डेय, वेदव्यास और वनवास के दौरान स्वयं पाण्डवों ने इसी पावन स्थल पर घोर तपस्या कर माता से मनोवांछित वरदान प्राप्त किए थे।",
  },

  "about.sanctum.title": { en: "The Sanctum & Sacred Mahima", hi: "गर्भगृह एवं देवी की महिमा" },
  "about.sanctum.text": {
    en: "The garbhagriha houses a self-manifested (svayambhu) stone vigraha of the Devi, which is adorned daily with silken vastra, gold ornaments, fresh flowers and fragrant chandan. Unlike most temples, the Devi's mukut and shringar change every day and devotees can witness the Mangala Aarti before sunrise, the Madhyahna Aarti at noon and the breathtaking Sandhya Aarti as oil lamps illuminate the entire prangan. The temple shikhara is built in the Nagara style of North Indian architecture, with intricately carved gold-plated kalash. Bali (offering of pumpkin/coconut) is a unique tradition followed at Vindhyavasini, symbolising the surrender of ego at the Mother's feet.",
    hi: "गर्भगृह में देवी का स्वयंभू पाषाण विग्रह स्थापित है, जिसका प्रतिदिन रेशमी वस्त्र, स्वर्ण आभूषण, ताजे पुष्प एवं चन्दन से शृंगार होता है। यहाँ देवी का मुकुट एवं शृंगार प्रतिदिन बदला जाता है। भक्त सूर्योदय से पूर्व मंगला आरती, मध्याह्न आरती एवं सायंकाल सन्ध्या आरती के अद्भुत दर्शन कर सकते हैं, जब समस्त प्रांगण दीपों से जगमगा उठता है। मंदिर का शिखर उत्तर भारतीय नागर शैली में निर्मित है, जिस पर सूक्ष्म नक्काशीदार स्वर्ण-कलश सुशोभित है। यहाँ ‘बलि’ (कूष्माण्ड/नारियल अर्पण) एक विशिष्ट परम्परा है, जो माँ के चरणों में अहंकार-त्याग का प्रतीक है।",
  },

  "about.importance.title": { en: "Spiritual Importance", hi: "आध्यात्मिक महत्व" },
  "about.importance.text": {
    en: "Vindhyachal is counted among the 51/108 Shakti Pithas of Bharat. It is one of the very few sites where the Devi is worshipped in three living forms: Mahalakshmi at the main temple, Mahakali at Kali Khoh and Mahasaraswati as Ashtabhuja. Completing the Trikona Parikrama is considered as fruitful as visiting all the Char Dhams. The dham draws sadhakas of the Sri Vidya tradition, tantric upasakas, classical poets and singers (the Kajari Mahotsav has nurtured generations of folk-poets), and millions of householder devotees who come for blessings of progeny, prosperity, learning and protection.",
    hi: "विन्ध्याचल भारत के ५१/१०८ शक्तिपीठों में परिगणित है। यह उन विरले स्थलों में से एक है जहाँ देवी तीन जीवन्त रूपों में पूजित हैं: मुख्य मंदिर में महालक्ष्मी, काली खोह में महाकाली एवं अष्टभुजा रूप में महासरस्वती। त्रिकोण परिक्रमा को चार धाम यात्रा के समान फलदायी माना गया है। यह धाम श्रीविद्या परम्परा के साधक, तांत्रिक उपासक, शास्त्रीय कवि एवं गायक (कजरी महोत्सव ने अनगिनत लोक-कवियों को जन्म दिया है), तथा सन्तान, समृद्धि, विद्या एवं रक्षा की कामना से आये करोड़ों गृहस्थ भक्तों को आकर्षित करता है।",
  },

  "about.trikona.title": {
    en: "Trikona Parikrama: The Sacred Triangle",
    hi: "त्रिकोण परिक्रमा: पावन त्रिकोण",
  },
  "about.kunds.title": {
    en: "Sacred Kunds & Ghats",
    hi: "पवित्र कुंड और पावन घाट",
  },
  "about.kunds.text": {
    en: "The Vindhya region features several sacred water bodies essential to pilgrimage. Ram Gaya Ghat on the Ganges is revered as the site where Sri Rama offered pind daan to his ancestors. Gerua Talab and Kali Kund are ancient natural ponds located along the parikrama paths where pilgrims perform specialized purification rituals before worship.",
    hi: "विन्ध्य क्षेत्र अनेक पवित्र कुंडों और घाटों से परिपूर्ण है। पतित पावनी गंगा तट पर स्थित 'राम गया घाट' वह स्थान है जहाँ श्री राम ने अपने पूर्वजों का पिंडदान किया था। परिक्रमा मार्ग पर स्थित 'गेरुआ तालाब' और 'काली कुंड' प्राचीन जलकुंड हैं जहाँ श्रद्धालु दर्शन से पूर्व विशेष शुद्धि और अनुष्ठान करते हैं।",
  },
  "about.trikona.text": {
    en: "Vindhyachal is unique because three forms of the Devi are worshipped here as the Maha Trishakti, comprising Maha Lakshmi, Maha Kali and Maha Saraswati. Devotees complete the Trikona Parikrama by visiting all three temples in one circuit.",
    hi: "विन्ध्याचल इसलिए अद्वितीय है क्योंकि यहाँ देवी के तीन रूपों (महालक्ष्मी, महाकाली एवं महासरस्वती) की महात्रिशक्ति के रूप में उपासना होती है। भक्तगण तीनों मंदिरों के दर्शन कर त्रिकोण परिक्रमा सम्पन्न करते हैं।",
  },
  "about.tri.1.title": { en: "Vindhyavasini Mandir", hi: "विन्ध्यवासिनी मंदिर" },
  "about.tri.1.text": {
    en: "Main shrine of the Devi as Maha Lakshmi / Yogmaya, situated on the bank of the Ganga.",
    hi: "मुख्य मंदिर जहाँ देवी गंगा तट पर महालक्ष्मी / योगमाया के रूप में विराजित हैं।",
  },
  "about.tri.2.title": { en: "Kali Khoh Mandir", hi: "काली खोह मंदिर" },
  "about.tri.2.text": {
    en: "Ancient cave shrine, located approximately 6 km away, dedicated to Devi as Maha Kali, the slayer of Raktabeeja.",
    hi: "प्राचीन गुफा मंदिर, जो लगभग ६ किमी दूर है और रक्तबीज के संहारक रूप में देवी महाकाली को समर्पित है।",
  },
  "about.tri.3.title": { en: "Ashtabhuja Devi Mandir", hi: "अष्टभुजा देवी मंदिर" },
  "about.tri.3.text": {
    en: "Hilltop shrine, situated approximately 8 km away, dedicated to Devi as Maha Saraswati in her eight-armed form.",
    hi: "पर्वत-शिखर मंदिर, जो लगभग ८ किमी दूर है और अष्टभुज रूप में देवी महासरस्वती को समर्पित है।",
  },

  "about.legend.title": {
    en: "The Legend of Mahishasura Mardini",
    hi: "महिषासुर मर्दिनी की पावन कथा",
  },
  "about.legend.text": {
    en: "Vindhyachal is the sacred land where Adi Parashakti manifested to destroy the tyrant demon king Mahishasura. After a fierce battle described in the Puranas, the Devi vanquished his army and restored cosmic order. Celebrating her victory, she established her permanent seat in the Vindhyas, choosing to dwell here eternally for the protection of all creation.",
    hi: "विन्ध्याचल वह पावन सिद्धपीठ है जहाँ आदिशक्ति ने अत्याचारी असुर महिषासुर का संहार करने के लिए अवतार लिया था। पुराणों में वर्णित एक भीषण युद्ध में देवी ने महिषासुर का अंत कर ब्रह्मांडीय संतुलन बहाल किया। अपनी इस विजय के पश्चात, उन्होंने चराचर जगत के कल्याण और रक्षा के लिए विन्ध्य पर्वत श्रृंखला को अपना शाश्वत निवास बनाया।",
  },

  "about.fest.title": { en: "Festivals & Pilgrimage", hi: "उत्सव एवं तीर्थयात्रा" },
  "about.fest.text": {
    en: "On the occasion of Vindhyavasini Jayanti, the Kajari festival is organised in honour of the Devi. During Navaratri, the temple town glows with lamps and flowers and millions of devotees throng the dham. During the 2025 Prayag Maha Kumbh, more than 10 million pilgrims also visited Vindhyachal, placing it among the world's largest peaceful gatherings.",
    hi: "विन्ध्यवासिनी जयन्ती के अवसर पर देवी के सम्मान में कजरी महोत्सव का आयोजन होता है। नवरात्रि के दिनों में सम्पूर्ण नगरी दीप-पुष्पों से जगमगा उठती है और लाखों भक्त धाम में दर्शनार्थ पधारते हैं। २०२५ के प्रयाग महाकुम्भ के समय एक करोड़ से अधिक श्रद्धालु विन्ध्याचल भी पधारे, जिसने इसे विश्व के सबसे बड़े शान्तिपूर्ण समागमों में स्थान दिलाया।",
  },

  "about.access.title": { en: "How to Reach", hi: "कैसे पहुँचें" },
  "about.access.air": {
    en: "Air: Lal Bahadur Shastri Airport, Varanasi (~72 km).",
    hi: "वायुमार्ग: लाल बहादुर शास्त्री हवाई अड्डा, वाराणसी (~७२ किमी)।",
  },
  "about.access.rail": {
    en: "Rail: Vindhyachal Railway Station (BDL) ~1 km, Mirzapur (MZP) ~9 km.",
    hi: "रेलमार्ग: विन्ध्याचल रेलवे स्टेशन (BDL) ~१ किमी, मिर्जापुर (MZP) ~९ किमी।",
  },
  "about.access.road": {
    en: "Road: Connected via NH-2; state buses, taxis and local cars available.",
    hi: "सड़क मार्ग: NH-2 से जुड़ा; राज्य परिवहन की बसें, टैक्सी एवं स्थानीय वाहन उपलब्ध।",
  },

  "about.sansthan.title": { en: "Our Sansthan", hi: "हमारा संस्थान" },
  "about.sansthan.text": {
    en: "Namami Vindhyavasini Sansthan is a premier socio-spiritual charitable trust dedicated to the eternal service of Adi Parashakti Maa Vindhyavasini. Rooted in the rich spiritual lineage of Sanatan Dharma and established under the divine guidance of Pujya Guru Ji, the Sansthan serves as a spiritual bridge connecting devotees across the globe to the sacred traditions of the Vindhya Dham. Beyond preserving and performing the ancient Vedic rituals, the Sansthan actively runs extensive charitable programs. This includes 'Annakut Bhandara' providing free sanctified meals to pilgrims and the underprivileged, 'Vidya Daan' supporting the education of young Vedic scholars, and organizing daily spiritual discourses (Satsang) and meditative retreats. Through its dedicated efforts, the Sansthan strives to nurture a community driven by selfless service (Seva), spiritual learning and unwavering devotion, ensuring that the divine grace of the Mother reaches every seeking heart.",
    hi: "नमामि विन्ध्यवासिनी संस्थान पूज्य गुरुजी के दिव्य मार्गदर्शन और आशीर्वाद से स्थापित एक अग्रणी सामाजिक-आध्यात्मिक धार्मिक न्यास (ट्रस्ट) है, जो आदि पराशक्ति माँ विन्ध्यवासिनी की अनवरत सेवा को समर्पित है। सनातन धर्म की समृद्ध आध्यात्मिक विरासत में रचा-बसा यह संस्थान, देश-विदेश के श्रद्धालुओं को विन्ध्य धाम की पावन परंपराओं से जोड़ने वाले एक दिव्य सेतु के रूप में कार्य करता है। देवी के प्राचीन वैदिक अनुष्ठानों एवं पूजन पद्धतियों के संरक्षण के साथ-साथ, संस्थान विभिन्न सामाजिक एवं परमार्थिक सेवा कार्यों का संचालन भी करता है। इसके अंतर्गत तीर्थयात्रियों और निर्धनों के लिए निरंतर 'अन्नकूट भंडारा' (निःशुल्क भोजन सेवा), युवा बटुकों (वैदिक छात्रों) की शिक्षा के लिए 'विद्या दान', एवं दैनिक आध्यात्मिक सत्संग तथा ध्यान शिविरों का आयोजन सम्मिलित है। संस्थान का प्रत्येक प्रयास माँ के चरणों में समर्पण, निःस्वार्थ सेवा, आध्यात्मिक ज्ञान के प्रसार और शांति की स्थापना के लिए प्रतिबद्ध है, ताकि जगज्जननी की असीम कृपा हर भक्त के जीवन को आलोकित कर सके।",
  },

  "about.values.vision.t": { en: "Vision", hi: "दृष्टि" },
  "about.values.vision.v": {
    en: "A world rooted in dharma, devotion and seva.",
    hi: "धर्म, भक्ति और सेवा में रचा-बसा एक संसार।",
  },
  "about.values.mission.t": { en: "Mission", hi: "ध्येय" },
  "about.values.mission.v": {
    en: "To preserve sacred traditions and serve devotees with bhakti and humility.",
    hi: "पवित्र परम्पराओं की रक्षा तथा विनम्रता एवं भक्ति से भक्तों की सेवा।",
  },
  "about.values.values.t": { en: "Values", hi: "मूल्य" },
  "about.values.values.v": {
    en: "Shraddha • Seva • Satsang • Sanskar • Shanti",
    hi: "श्रद्धा • सेवा • सत्संग • संस्कार • शान्ति",
  },

  "reviews.sanskrit": { en: "॥ भक्त वाणी ॥", hi: "॥ भक्त वाणी ॥" },
  "reviews.title": { en: "Devotee Reviews & Feedback", hi: "भक्तों के विचार और अनुभव" },
  "reviews.subtitle": {
    en: "Read what devotees say about their experience and share your own feedback with the trust.",
    hi: "भक्तों के पावन अनुभव पढ़ें और संस्थान के साथ अपने विचार साझा करें।",
  },
  "reviews.leave": { en: "Leave a Comment", hi: "टिप्पणी दीजिये" },
  "reviews.name": { en: "Your Name", hi: "आपका नाम" },
  "reviews.name.ph": { en: "Devotee name", hi: "भक्त का नाम" },
  "reviews.comment": { en: "Your Comment", hi: "आपकी टिप्पणी" },
  "reviews.comment.ph": {
    en: "Share your blessings, feedback or experience...",
    hi: "अपना अनुभव, आशीर्वाद या प्रतिक्रिया साझा करें...",
  },
  "reviews.submit": { en: "Submit Comment", hi: "टिप्पणी भेजें" },
  "reviews.submitting": { en: "Submitting...", hi: "भेज रहे हैं..." },
  "reviews.what": { en: "What Devotees Say", hi: "भक्त क्या कहते हैं" },
  "reviews.first": {
    en: "Be the first to share your experience.",
    hi: "अनुभव साझा करने वाले प्रथम बनें।",
  },
  "reviews.thanks": {
    en: "Dhanyavaad! Your comment has been received.",
    hi: "धन्यवाद! आपकी टिप्पणी प्राप्त हो गयी है।",
  },
  "reviews.error": {
    en: "Could not submit your comment. Please try again.",
    hi: "टिप्पणी सबमिट नहीं हो सकी। कृपया पुनः प्रयास करें।",
  },

  // ---- Donation ----
  "don.sanskrit": { en: "॥ दानं परम धर्मः ॥", hi: "॥ दानं परम धर्मः ॥" },
  "don.title": { en: "Donation & Seva", hi: "दान एवं सेवा" },
  "don.subtitle": {
    en: "Your contribution is a sacred offering at the lotus feet of Maa Vindhyavasini.",
    hi: "आपका योगदान माँ विन्ध्यवासिनी के चरणकमलों पर एक पावन अर्पण है।",
  },
  "don.bless": { en: "Bless this Seva", hi: "इस सेवा को आशीर्वाद दें" },
  "don.kicker": { en: "Daan Punya", hi: "दान-पुण्य" },
  "don.h2": { en: "Be Part of the Seva", hi: "सेवा का अंग बनें" },
  "don.text": {
    en: "Every rupee you offer becomes a flower at Maa's feet, supporting the feeding of devotees, lighting of lamps, educating of children and preserving of sacred traditions. You can scan the verified UPI QR code directly or transfer funds to our official bank account details listed below.",
    hi: "आपका दिया हुआ हर रुपया माँ के चरणों में पुष्प बन जाता है, जिससे भक्तों को भोजन, दीप प्रज्वलन, बच्चों की शिक्षा और परम्पराओं की रक्षा होती है। आप सीधे यूपीआई क्यूआर कोड स्कैन करके या नीचे दिए गए आधिकारिक बैंक विवरण में राशि स्थानांतरित कर सकते हैं।",
  },
  "don.quick": { en: "Quick Donate", hi: "त्वरित दान" },
  "don.quick.bank": {
    en: "Bank / UPI details available on request",
    hi: "बैंक / UPI विवरण अनुरोध पर उपलब्ध",
  },
  "don.contactbtn": { en: "Contact for Donation", hi: "दान हेतु संपर्क" },
  "don.where": { en: "Where Your Contribution Goes", hi: "आपका योगदान कहाँ लगता है" },
  "don.cause.1.t": { en: "Mandir Seva", hi: "मंदिर सेवा" },
  "don.cause.1.x": {
    en: "Daily aarti, decoration, lighting and upkeep of the temple.",
    hi: "दैनिक आरती, श्रृंगार, प्रकाश एवं मंदिर का रख-रखाव।",
  },
  "don.cause.2.t": { en: "Annadanam / Bhandara", hi: "अन्नदानम / भण्डारा" },
  "don.cause.2.x": {
    en: "Sponsor prasad and meals for devotees and the needy.",
    hi: "भक्तों एवं ज़रूरतमंदों के लिए प्रसाद एवं भोजन का सहयोग।",
  },
  "don.cause.3.t": { en: "Vidya Daan", hi: "विद्या दान" },
  "don.cause.3.x": {
    en: "Support free Vedic, Sanskrit and value education for children.",
    hi: "बच्चों हेतु निःशुल्क वैदिक, संस्कृत एवं मूल्य-शिक्षा का सहयोग।",
  },
  "don.cause.4.t": { en: "Festival Mahotsav", hi: "उत्सव महोत्सव" },
  "don.cause.4.x": {
    en: "Help organise Navratri, Janmashtami and other utsavas.",
    hi: "नवरात्रि, जन्माष्टमी एवं अन्य उत्सवों के आयोजन में सहयोग।",
  },

  // ---- Contact ----
  "ct.sanskrit": { en: "॥ अतिथि देवो भव ॥", hi: "॥ अतिथि देवो भव ॥" },
  "ct.title": { en: "Contact & Appointment", hi: "संपर्क एवं समय" },
  "ct.subtitle": {
    en: "Reach out, write to us, or book a personal sitting with Pujya Guru Ji.",
    hi: "हमसे संपर्क करें, पत्र लिखें, या पूज्य गुरुजी से व्यक्तिगत भेंट का समय लें।",
  },
  "ct.visit": { en: "Visit", hi: "दर्शन" },
  "ct.call": { en: "Call", hi: "फ़ोन" },
  "ct.email": { en: "Email", hi: "ईमेल" },
  "ct.address": {
    en: "Vindhyachal Dham, Mirzapur, Uttar Pradesh 231307",
    hi: "विन्ध्याचल धाम, मिर्जापुर, उत्तर प्रदेश २३१३०७",
  },
  "ct.send.title": { en: "Send a Message", hi: "संदेश भेजें" },
  "ct.f.name": { en: "Your Name", hi: "आपका नाम" },
  "ct.f.email": { en: "Email Address", hi: "ईमेल पता" },
  "ct.f.phone": { en: "Phone Number", hi: "फ़ोन नंबर" },
  "ct.f.msg": { en: "Your Message", hi: "आपका संदेश" },
  "ct.f.send": { en: "Send Message", hi: "संदेश भेजें" },
  "ct.f.sending": { en: "Sending…", hi: "भेज रहे हैं…" },
  "ct.f.thanks": { en: "Your message has been received.", hi: "आपका संदेश प्राप्त हो गया है।" },
  "ct.f.thanksH": { en: "धन्यवाद 🙏", hi: "धन्यवाद 🙏" },
  "ct.f.toast": { en: "Message received 🙏", hi: "संदेश प्राप्त हुआ 🙏" },
  "ct.appt.title": { en: "Book Appointment with Guru Ji", hi: "गुरुजी से समय निर्धारण" },
  "ct.appt.phone": { en: "Phone Number", hi: "फ़ोन नंबर" },
  "ct.appt.email": { en: "Email Address", hi: "ईमेल पता" },
  "ct.appt.date": { en: "Date", hi: "तिथि" },
  "ct.appt.slot": { en: "Time slot", hi: "समय" },
  "ct.appt.purpose": {
    en: "Purpose of meeting (darshan, blessings, guidance...)",
    hi: "भेंट का उद्देश्य (दर्शन, आशीर्वाद, मार्गदर्शन...)",
  },
  "ct.appt.submit": { en: "Request Appointment", hi: "समय की अर्ज़" },
  "ct.appt.submitting": { en: "Submitting…", hi: "भेज रहे हैं…" },
  "ct.appt.thanksH": { en: "शुभ संकल्प 🙏", hi: "शुभ संकल्प 🙏" },
  "ct.appt.thanks": {
    en: "Your appointment request was received.",
    hi: "आपकी अर्ज़ प्राप्त हो गयी है।",
  },
  "ct.appt.confirm": {
    en: "We will confirm via phone or email soon.",
    hi: "हम शीघ्र ही फ़ोन या ईमेल से पुष्टि करेंगे।",
  },
  "ct.appt.toast": { en: "Appointment requested 🙏", hi: "समय की अर्ज़ प्राप्त 🙏" },
  "ct.slot.morning": { en: "Morning (8–10 AM)", hi: "प्रातः (८–१० बजे)" },
  "ct.slot.late": { en: "Late Morning (10 AM–12 PM)", hi: "पूर्वाह्न (१०–१२ बजे)" },
  "ct.slot.noon": { en: "Afternoon (2–4 PM)", hi: "अपराह्न (२–४ बजे)" },
  "ct.slot.evening": { en: "Evening (5–7 PM)", hi: "सायं (५–७ बजे)" },
  // ---- Home Panchang strip ----
  "home.panch.kicker": { en: "Aaj Ka Panchang", hi: "आज का पंचांग" },
  "home.panch.title": { en: "Today at Vindhyachal Dham", hi: "आज विन्ध्याचल धाम पर" },
  "home.panch.tithi": { en: "Tithi", hi: "तिथि" },
  "home.panch.nak": { en: "Nakshatra", hi: "नक्षत्र" },
  "home.panch.sunrise": { en: "Sunrise", hi: "सूर्योदय" },
  "home.panch.sunset": { en: "Sunset", hi: "सूर्यास्त" },
  "home.panch.full": { en: "View full Panchang", hi: "पूर्ण पंचांग देखें" },

  // ---- Sandesh page ----
  "sandesh.sanskrit": {
    en: "॥ गुरुर्ब्रह्मा गुरुर्विष्णुः ॥",
    hi: "॥ गुरुर्ब्रह्मा गुरुर्विष्णुः ॥",
  },
  "sandesh.title": { en: "Sandesh", hi: "संदेश" },
  "sandesh.subtitle": {
    en: "Daily wisdom, blessings and reflections.",
    hi: "दैनिक प्रेरणा, आशीर्वाद और चिन्तन।",
  },
  "sandesh.today": { en: "Sandesh", hi: "संदेश" },
  "sandesh.another": { en: "Show another", hi: "एक और दिखायें" },
  "sandesh.listen": { en: "Listen", hi: "सुनें" },
  "sandesh.stop": { en: "Stop", hi: "रोकें" },
  "sandesh.empty": {
    en: "No sandesh available yet. Please check back soon.",
    hi: "अभी कोई संदेश उपलब्ध नहीं है। कृपया शीघ्र पुनः पधारें।",
  },
  "sandesh.more": { en: "More Sandesh", hi: "अन्य संदेश" },
  "sandesh.error": { en: "Could not load sandesh.", hi: "संदेश लोड नहीं हो सके।" },
  "sandesh.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "sandesh.api_key_missing": {
    en: "ElevenLabs API key is missing. Please set VITE_ELEVENLABS_API_KEY.",
    hi: "ElevenLabs API कुंजी अनुपलब्ध है। कृपया VITE_ELEVENLABS_API_KEY सेट करें।",
  },
  "sandesh.audio_error": {
    en: "Failed to generate or play audio.",
    hi: "ऑडियो उत्पन्न करने या बजाने में विफल।",
  },

  // ---- Events page ----
  "events.sanskrit": {
    en: "॥ उत्सव हर भक्त का अधिकार है ॥",
    hi: "॥ उत्सव प्रत्येक भक्त का अधिकार है ॥",
  },
  "events.title": { en: "Temple Events", hi: "मंदिर के कार्यक्रम" },
  "events.today": { en: "Today's Events", hi: "आज के कार्यक्रम" },
  "events.subtitle": {
    en: "Festivals, satsang and seva programmes to join us in devotion.",
    hi: "उत्सव, सत्संग एवं सेवा कार्यक्रम, हमसे भक्तिपूर्वक जुड़ने हेतु।",
  },
  "events.upcoming": { en: "Upcoming Events", hi: "आगामी कार्यक्रम" },
  "events.past": { en: "Past Events", hi: "पूर्व कार्यक्रम" },
  "events.empty.up": {
    en: "No upcoming events scheduled. Please check back soon.",
    hi: "अभी कोई आगामी कार्यक्रम निर्धारित नहीं है।",
  },
  "events.empty.past": { en: "No past events yet.", hi: "अभी कोई पूर्व कार्यक्रम नहीं।" },
  "events.error": { en: "Could not load events.", hi: "कार्यक्रम लोड नहीं हो सके।" },

  // ---- Videos page ----
  "videos.sanskrit": { en: "॥ ज्ञानं परमं ध्येयम् ॥", hi: "॥ ज्ञानं परमं ध्येयम् ॥" },
  "videos.title": { en: "Videos", hi: "वीडियो" },
  "videos.subtitle": {
    en: "Watch our latest darshan, kirtan and pravachan from Vindhyachal Dham.",
    hi: "विन्ध्याचल धाम से नवीनतम दर्शन, कीर्तन एवं प्रवचन देखिये।",
  },
  "videos.tab.videos": { en: "Videos", hi: "वीडियो" },
  "videos.tab.shorts": { en: "Shorts", hi: "शॉर्ट्स" },
  "videos.featured": { en: "Featured Videos", hi: "मुख्य वीडियो" },
  "videos.shorts": { en: "Shorts", hi: "शॉर्ट्स" },

  // ---- Shorts page ----
  "shorts.sanskrit": { en: "॥ दिव्य लीला दर्शनम् ॥", hi: "॥ दिव्य लीला दर्शनम् ॥" },
  "shorts.title": { en: "Shorts", hi: "शॉर्ट्स" },
  "shorts.subtitle": {
    en: "Watch quick divine moments and devotional shorts from Vindhyachal Dham.",
    hi: "विन्ध्याचल धाम से त्वरित दिव्य क्षण एवं भक्तिमय शॉर्ट्स देखिये।",
  },

  // ---- Trikona Parikrama page ----
  "nav.parikrama": { en: "Parikrama Map", hi: "परिक्रमा मार्ग" },
  "parikrama.sanskrit": { en: "॥ त्रिगुणात्मिकायै नमः ॥", hi: "॥ त्रिगुणात्मिकायै नमः ॥" },
  "parikrama.title": { en: "Trikona Parikrama", hi: "त्रिकोण परिक्रमा" },
  "parikrama.subtitle": {
    en: "Experience the sacred triangular pilgrim path of Vindhyachal Dham, linking the Maha Trishakti temples.",
    hi: "महात्रिशक्ति मंदिरों को जोड़ने वाले विन्ध्याचल धाम के पावन त्रिकोणीय तीर्थ मार्ग का अनुभव करें।",
  },
  "parikrama.map.title": { en: "Sacred Pilgrim Circuit Map", hi: "पावन तीर्थ परिक्रमा मानचित्र" },
  "parikrama.map.info": {
    en: "Tap on any location marker to view details and listen to the sacred history of that spot.",
    hi: "विवरण देखने और उस स्थान के पावन इतिहास को सुनने के लिए किसी भी स्थान के मार्कर पर टैप करें।",
  },
  "parikrama.start": { en: "Start Virtual Parikrama", hi: "परिक्रमा आरम्भ करें" },
  "parikrama.reset": { en: "Restart Parikrama", hi: "पुनः आरम्भ करें" },
  "parikrama.listen": { en: "Listen to Guide", hi: "कथा सुनें" },
  "parikrama.stop": { en: "Stop Audio", hi: "ऑडियो रोकें" },
  "parikrama.next": { en: "Next Stage", hi: "अगला चरण" },
  "parikrama.prev": { en: "Previous Stage", hi: "पिछला चरण" },
  "parikrama.complete": { en: "Complete Parikrama", hi: "परिक्रमा पूर्ण करें" },

  // Stages & Rituals
  "parikrama.stage0.title": { en: "Stage 1: Ganga Snan", hi: "प्रथम चरण: गंगा स्नान" },
  "parikrama.stage0.subtitle": {
    en: "Sacred Purification at Ram Gaya Ghat",
    hi: "राम गया घाट पर पावन स्नान",
  },
  "parikrama.stage0.text": {
    en: "We begin our Trikona Parikrama by taking a holy dip in the sacred River Ganges. Feel the pure waters purify your body and soul. Chant, Om Namo Gangayei Vishwarupinyei Narayanyei Namo Namah.",
    hi: "हम अपनी त्रिकोण परिक्रमा की शुरुआत पतित पावनि गंगा नदी में पवित्र स्नान के साथ करते हैं। अनुभव करें कि यह दिव्य जल आपके तन और मन को पवित्र कर रहा है। बोलें, ॐ नमो गंगायै विश्वरूपिण्यै नारायण्यै नमो नमः।",
  },
  "parikrama.stage0.btn": { en: "Take Holy Dip", hi: "गंगा स्नान करें" },
  "parikrama.stage0.action_done": {
    en: "Purification Complete! You are ready.",
    hi: "स्नान संपन्न हुआ! आप परिक्रमा के लिए तैयार हैं।",
  },

  "parikrama.stage1.title": {
    en: "Stage 2: Maa Vindhyavasini Mandir",
    hi: "द्वितीय चरण: माँ विन्ध्यवासिनी मंदिर",
  },
  "parikrama.stage1.subtitle": {
    en: "Maha Lakshmi Swaroop: The Main Shrine",
    hi: "महालक्ष्मी स्वरूप: मुख्य मंदिर",
  },
  "parikrama.stage1.text": {
    en: "Now, arrive at the main temple of Maa Vindhyavasini, who sits on the banks of Ganga as Maha Lakshmi. Ring the bell and offer red flowers to the Mother. She is the Yogmaya child of Yashoda, who declared the doom of demon Kansa.",
    hi: "अब, मुख्य मंदिर माँ विन्ध्यवासिनी के चरणों में पधारें, जो गंगा तट पर महालक्ष्मी के रूप में विराजमान हैं। मंदिर का घंटा बजायें और माँ को लाल पुष्प अर्पित करें। वे यशोदा की वही योगमाया पुत्री हैं, जिन्होंने कंस के विनाश की घोषणा की थी।",
  },
  "parikrama.stage1.btn_bell": { en: "Ring Temple Bell", hi: "मंदिर का घंटा बजायें" },
  "parikrama.stage1.btn_flower": { en: "Offer Red Flowers", hi: "लाल पुष्प अर्पित करें" },

  "parikrama.stage2.title": {
    en: "Stage 3: Kali Khoh Cave Temple",
    hi: "तृतीय चरण: काली खोह मंदिर",
  },
  "parikrama.stage2.subtitle": {
    en: "Maha Kali Swaroop: The Cave Shrine",
    hi: "महाकाली स्वरूप: गुफा मंदिर",
  },
  "parikrama.stage2.text": {
    en: "Proceed to Kali Khoh, the cave temple of Maha Kali, nestled in the Vindhya foothills. It is here that Chamunda Devi resides, having destroyed the demons Chanda and Munda. Bow down in silence and offer your devotion.",
    hi: "विन्ध्य की तलहटी में स्थित महाकाली की गुफा काली खोह की ओर बढ़ें। यहाँ चामुण्डा देवी विराजमान हैं, जिन्होंने चण्ड और मुण्ड का संहार किया था। मौन होकर प्रणाम करें और अपनी भक्ति अर्पित करें।",
  },
  "parikrama.stage2.btn": { en: "Offer Hibiscus (Gudhal)", hi: "गुड़हल का फूल चढ़ाएं" },

  "parikrama.stage3.title": {
    en: "Stage 4: Maa Ashtabhuja Temple",
    hi: "चतुर्थ चरण: माँ अष्टभुजा मंदिर",
  },
  "parikrama.stage3.subtitle": {
    en: "Maha Saraswati Swaroop: Hilltop Shrine",
    hi: "महासरस्वती स्वरूप: पर्वत मंदिर",
  },
  "parikrama.stage3.text": {
    en: "Climb up to Ashtabhuja temple on the hill, dedicated to Maha Saraswati. She is the eighth-armed goddess who guards the holy region. Tie a sacred red thread on the tree and make your spiritual vow.",
    hi: "पहाड़ी पर स्थित अष्टभुजा देवी मंदिर की ओर प्रस्थान करें, जो महासरस्वती को समर्पित है। वे अष्टभुज धारिणी देवी हैं जो इस पवित्र क्षेत्र की रक्षा करती हैं। यहाँ वृक्ष पर लाल रक्षा सूत्र बाँधें, और अपना आध्यात्मिक संकल्प लें।",
  },
  "parikrama.stage3.btn": {
    en: "Tie Sacred Thread (Mannat)",
    hi: "रक्षा सूत्र (मन्नत धागा) बांधें",
  },

  // Certificate Section
  "parikrama.cert.title": { en: "Sacred Completion", hi: "परिक्रमा पूर्णता" },
  "parikrama.cert.subtitle": {
    en: "Receive Your Trikona Parikrama Certificate",
    hi: "त्रिकोण परिक्रमा का प्रमाणपत्र प्राप्त करें",
  },
  "parikrama.cert.desc": {
    en: "Enter your name to generate and download a personalized Blessing Certificate of Trikona Parikrama from Namami Vindhyavasini Sansthan.",
    hi: "नमामि विन्ध्यवासिनी संस्थान से त्रिकोण परिक्रमा का अपना व्यक्तिगत आशीर्वाद प्रमाणपत्र प्राप्त करने के लिए अपना नाम दर्ज करें।",
  },
  "parikrama.cert.input_ph": { en: "Enter Devotee Name", hi: "श्रद्धालु का नाम दर्ज करें" },
  "parikrama.cert.generate": {
    en: "Generate Blessing Certificate",
    hi: "आशीर्वाद प्रमाणपत्र बनायें",
  },
  "parikrama.cert.download": { en: "Download Certificate", hi: "प्रमाणपत्र डाउनलोड करें" },
} as const;

export type TKey = keyof typeof translations;
