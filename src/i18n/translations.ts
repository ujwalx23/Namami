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
  "nav.panchang": { en: "Panchang", hi: "पंचांग" },
  "nav.reviews": { en: "Reviews", hi: "समीक्षा" },
  "nav.gallery": { en: "Gallery", hi: "गैलरी" },
  "nav.donation": { en: "Donation", hi: "दान" },
  "nav.contact": { en: "Contact", hi: "संपर्क" },
  "nav.donate_btn": { en: "Donate", hi: "दान करें" },
  "nav.menu": { en: "Menu", hi: "मेनू" },
  "lang.toggle": { en: "हिंदी", hi: "EN" },

  "footer.tagline": {
    en: "A devotional trust dedicated to spreading the divine grace of Maa Vindhyavasini, preserving sacred traditions, and serving devotees through seva, sanskar, and satsang.",
    hi: "एक भक्तिमय न्यास जो माँ विन्ध्यवासिनी की दिव्य कृपा का प्रसार, पवित्र परम्पराओं की रक्षा तथा सेवा, संस्कार और सत्संग के माध्यम से भक्तों की सेवा को समर्पित है।",
  },
  "footer.quick": { en: "Quick Links", hi: "त्वरित लिंक" },
  "footer.reach": { en: "Reach Us", hi: "हमसे संपर्क" },
  "footer.address": { en: "Vindhyachal Dham, Mirzapur, UP", hi: "विन्ध्याचल धाम, मिर्जापुर, उ.प्र." },
  "footer.copy": { en: "Namami Vindhyavasini Sansthan ✦ Jai Maa Vindhyavasini", hi: "नमामि विन्ध्यवासिनी संस्थान ✦ जय माँ विन्ध्यवासिनी" },

  // ---- Home page ----
  "home.badge": { en: "Jai Maa Vindhyavasini", hi: "जय माँ विन्ध्यवासिनी" },
  "home.hero.title1": { en: "Embrace Divine", hi: "दिव्य कृपा का" },
  "home.hero.title2": { en: "Grace", hi: "आलिंगन" },
  "home.hero.desc": {
    en: "Step into the sacred world of Maa Vindhyavasini — Shakti Pitha of the Vindhya range. Our sansthan preserves the ancient rituals of the Devi, organises satsang and seva, and welcomes every devotee into the bhakti of the Mother.",
    hi: "माँ विन्ध्यवासिनी के पावन धाम में प्रवेश करें — विन्ध्य पर्वत की शक्तिपीठ। हमारा संस्थान देवी की प्राचीन परम्पराओं का संरक्षण करता है, सत्संग एवं सेवा का आयोजन करता है, और हर भक्त को माँ की भक्ति में आमंत्रित करता है।",
  },
  "home.cta.today": { en: "Today's Sandesh", hi: "आज का संदेश" },
  "home.cta.about": { en: "Our Sansthan", hi: "हमारा संस्थान" },

  "home.slide.vindhya.title": { en: "Namami Vindhyavasini", hi: "नमामि विन्ध्यवासिनी" },
  "home.slide.vindhya.sub": { en: "Vindhyachal Dham", hi: "विन्ध्याचल धाम" },
  "home.slide.darshan.title": { en: "Divine Darshan", hi: "दिव्य दर्शन" },
  "home.slide.shringar.title": { en: "Maa ka Shringar", hi: "माँ का श्रृंगार" },

  "home.intro.kicker": { en: "Sanatan Parampara", hi: "सनातन परम्परा" },
  "home.intro.title": { en: "Charanon Mein Bhakti", hi: "चरणों में भक्ति" },
  "home.card.purpose.title": { en: "Our Purpose", hi: "हमारा उद्देश्य" },
  "home.card.purpose.text": {
    en: "To spread the divine message of Maa Vindhyavasini, nurture devotion, and serve humanity through seva, satsang and sanskar.",
    hi: "माँ विन्ध्यवासिनी का दिव्य संदेश प्रसारित करना, भक्ति का पोषण और सेवा, सत्संग एवं संस्कार से मानवता की सेवा।",
  },
  "home.card.sansthapana.title": { en: "Sansthapana", hi: "संस्थापना" },
  "home.card.sansthapana.text": {
    en: "Established by Pujya Guru Ji with the blessings of Maa, the trust has been a beacon of dharma — preserving rituals and uplifting devotees for decades.",
    hi: "पूज्य गुरुजी द्वारा माँ के आशीर्वाद से स्थापित यह न्यास दशकों से धर्म का दीप जलाए हुए है — परम्पराओं की रक्षा और भक्तों के उत्थान में रत है।",
  },
  "home.card.vision.title": { en: "Vision", hi: "हमारी दृष्टि" },
  "home.card.vision.text": {
    en: "A united community rooted in Sanatan values — learning, seva and unwavering bhakti at the lotus feet of the Goddess.",
    hi: "सनातन मूल्यों में रचा-बसा एक एकजुट समाज — शिक्षा, सेवा और देवी के चरणों में अटूट भक्ति।",
  },

  "home.sandesh.kicker": { en: "Daily Wisdom", hi: "दैनिक प्रेरणा" },
  "home.sandesh.title": { en: "Sandesh", hi: "संदेश" },
  "home.sandesh.quote": {
    en: "“Where there is shraddha, there resides the Mother. Keep your heart pure — Devi's grace will find you on its own.”",
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
  "home.shakti.title": { en: "Maa Vindhyavasini Dhaam", hi: "माँ विन्ध्यवासिनी धाम" },
  "home.shakti.text": {
    en: "On the holy banks of the Ganga, in the Vindhya hills of Mirzapur, sits one of India's most powerful Shakti Pithas. Devi Vindhyavasini is worshipped here as the protector of dharma — the eternal Mother who chose this land after slaying Mahishasura.",
    hi: "गंगा के पावन तट पर, मिर्जापुर के विन्ध्य पर्वतों में, भारत के अत्यंत प्रतापी शक्तिपीठों में से एक विराजमान है। यहाँ देवी विन्ध्यवासिनी धर्म की रक्षिका के रूप में पूजित हैं — वही सनातन माँ जिन्होंने महिषासुर का वध करके इस भूमि को अपना धाम बनाया।",
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
  "about.sanskrit": { en: "॥ माँ विन्ध्यवासिनी की कृपा ॥", hi: "॥ माँ विन्ध्यवासिनी की कृपा ॥" },
  "about.title": { en: "Maa Vindhyavasini Dhaam", hi: "माँ विन्ध्यवासिनी धाम" },
  "about.subtitle": {
    en: "One of the most ancient Shakti Pithas of Bharat — abode of Devi Durga in the Vindhya hills.",
    hi: "भारत के प्राचीनतम शक्तिपीठों में से एक — विन्ध्य पर्वत में विराजमान देवी दुर्गा का धाम।",
  },
  "about.intro": {
    en: "Vindhyachal Temple, also known as Maa Vindhyavasini Temple, is a Hindu shrine dedicated to the mother goddess Vindhyavasini, situated on the bank of the river Ganga at Vindhyachal in Mirzapur district, Uttar Pradesh. It is one of the celebrated Shakti Pithas of India. The Goddess is also revered as Kajari (or Kajali) Devi — a name derived from her kohl-like complexion.",
    hi: "विन्ध्याचल मंदिर, जिसे माँ विन्ध्यवासिनी मंदिर भी कहा जाता है, उत्तर प्रदेश के मिर्जापुर जनपद में विन्ध्याचल नामक स्थान पर गंगा के तट पर स्थित देवी विन्ध्यवासिनी को समर्पित हिन्दू तीर्थ है। यह भारत के प्रसिद्ध शक्तिपीठों में से एक है। देवी को कजरी (या कजली) देवी के नाम से भी पूजा जाता है — यह नाम उनके काजल जैसे श्याम वर्ण से आता है।",
  },

  "about.history.title": { en: "History & Sacred Origin", hi: "इतिहास एवं पौराणिक उत्पत्ति" },
  "about.history.text": {
    en: "The temple finds mention in the Rig Veda, Markandeya Purana, Devi Bhagavata and the Durga Saptashati — making it one of the oldest continuously worshipped Shakti shrines of Bharat. Tradition holds that Goddess Durga took birth from the womb of Yashoda on the same night Krishna was born in Mathura. When Kansa attempted to dash the infant against a stone, she slipped from his grasp, revealed her eight-armed divine form in the sky, and declared the demon's doom. After slaying Mahishasura, Shumbha and Nishumbha, the Devi chose the Vindhya range as her eternal abode — and from that moment she has been worshipped as Vindhyavasini, 'She who dwells in the Vindhyas.' The Devi is also revered here as Kajari (Kajali) Devi — a name born of her kohl-dark, monsoon-cloud complexion. Sages such as Markandeya, Vyasa and the Pandavas during their vanvas are believed to have offered worship at this very spot.",
    hi: "इस मंदिर का उल्लेख ऋग्वेद, मार्कण्डेय पुराण, देवी भागवत एवं दुर्गा सप्तशती में मिलता है — जिससे यह भारत के सबसे प्राचीन एवं निरन्तर पूजित शक्तिपीठों में से एक है। पौराणिक कथा के अनुसार जिस रात्रि भगवान कृष्ण मथुरा में अवतरित हुए, उसी रात्रि देवी दुर्गा ने यशोदा के गर्भ से जन्म लिया। जब कंस ने उन्हें शिला पर पटकना चाहा, तो वे उनके हाथों से छूटकर आकाश में अष्टभुज दिव्य रूप में प्रकट हुईं और कंस के अंत की घोषणा की। महिषासुर, शुम्भ एवं निशुम्भ के संहार के पश्चात देवी ने विन्ध्य पर्वत को अपना सनातन निवास चुना — तभी से वे ‘विन्ध्यवासिनी’ अर्थात ‘विन्ध्य में निवास करने वाली’ रूप में पूजित हैं। देवी यहाँ ‘कजरी (कजली) देवी’ के रूप में भी विराजित हैं — यह नाम उनके मेघ-श्याम काजल जैसे वर्ण से उत्पन्न है। मार्कण्डेय, व्यास तथा वनवास काल में पाण्डवों द्वारा भी इसी स्थल पर देवी की उपासना मानी जाती है।",
  },

  "about.sanctum.title": { en: "The Sanctum & Sacred Mahima", hi: "गर्भगृह एवं देवी की महिमा" },
  "about.sanctum.text": {
    en: "The garbhagriha houses a self-manifested (svayambhu) stone vigraha of the Devi — adorned daily with silken vastra, gold ornaments, fresh flowers and fragrant chandan. Unlike most temples, the Devi's mukut and shringar change every day, and devotees can witness the Mangala Aarti before sunrise, the Madhyahna Aarti at noon, and the breathtaking Sandhya Aarti as oil lamps illuminate the entire prangan. The temple shikhara is built in the Nagara style of North Indian architecture, with intricately carved gold-plated kalash. Bali (offering of pumpkin/coconut) is a unique tradition followed at Vindhyavasini, symbolising the surrender of ego at the Mother's feet.",
    hi: "गर्भगृह में देवी का स्वयंभू पाषाण विग्रह स्थापित है — जिसका प्रतिदिन रेशमी वस्त्र, स्वर्ण आभूषण, ताजे पुष्प एवं चन्दन से शृंगार होता है। यहाँ देवी का मुकुट एवं शृंगार प्रतिदिन बदला जाता है। भक्त सूर्योदय से पूर्व मंगला आरती, मध्याह्न आरती एवं सायंकाल सन्ध्या आरती के अद्भुत दर्शन कर सकते हैं, जब समस्त प्रांगण दीपों से जगमगा उठता है। मंदिर का शिखर उत्तर भारतीय नागर शैली में निर्मित है, जिस पर सूक्ष्म नक्काशीदार स्वर्ण-कलश सुशोभित है। यहाँ ‘बलि’ (कूष्माण्ड/नारियल अर्पण) एक विशिष्ट परम्परा है — जो माँ के चरणों में अहंकार-त्याग का प्रतीक है।",
  },

  "about.importance.title": { en: "Spiritual Importance", hi: "आध्यात्मिक महत्व" },
  "about.importance.text": {
    en: "Vindhyachal is counted among the 51/108 Shakti Pithas of Bharat. It is one of the very few sites where the Devi is worshipped in three living forms — Mahalakshmi at the main temple, Mahakali at Kali Khoh, and Mahasaraswati as Ashtabhuja. Completing the Trikona Parikrama is considered as fruitful as visiting all the Char Dhams. The dham draws sadhakas of the Sri Vidya tradition, tantric upasakas, classical poets and singers (the Kajari Mahotsav has nurtured generations of folk-poets), and millions of householder devotees who come for blessings of progeny, prosperity, learning and protection.",
    hi: "विन्ध्याचल भारत के ५१/१०८ शक्तिपीठों में परिगणित है। यह उन विरले स्थलों में से एक है जहाँ देवी तीन जीवन्त रूपों में पूजित हैं — मुख्य मंदिर में महालक्ष्मी, काली खोह में महाकाली एवं अष्टभुजा रूप में महासरस्वती। त्रिकोण परिक्रमा को चार धाम यात्रा के समान फलदायी माना गया है। यह धाम श्रीविद्या परम्परा के साधक, तांत्रिक उपासक, शास्त्रीय कवि एवं गायक (कजरी महोत्सव ने अनगिनत लोक-कवियों को जन्म दिया है), तथा सन्तान, समृद्धि, विद्या एवं रक्षा की कामना से आये करोड़ों गृहस्थ भक्तों को आकर्षित करता है।",
  },

  "about.trikona.title": { en: "Trikona Parikrama — The Sacred Triangle", hi: "त्रिकोण परिक्रमा — पावन त्रिकोण" },
  "about.trikona.text": {
    en: "Vindhyachal is unique because three forms of the Devi are worshipped here as the Maha Trishakti — Maha Lakshmi, Maha Kali and Maha Saraswati. Devotees complete the Trikona Parikrama by visiting all three temples in one circuit.",
    hi: "विन्ध्याचल इसलिए अद्वितीय है क्योंकि यहाँ देवी के तीन रूपों — महालक्ष्मी, महाकाली एवं महासरस्वती — की महात्रिशक्ति के रूप में उपासना होती है। भक्तगण तीनों मंदिरों के दर्शन कर त्रिकोण परिक्रमा सम्पन्न करते हैं।",
  },
  "about.tri.1.title": { en: "Vindhyavasini Mandir", hi: "विन्ध्यवासिनी मंदिर" },
  "about.tri.1.text": { en: "Main shrine — Devi as Maha Lakshmi / Yogmaya, on the bank of the Ganga.", hi: "मुख्य मंदिर — गंगा तट पर देवी महालक्ष्मी / योगमाया के रूप में।" },
  "about.tri.2.title": { en: "Kali Khoh Mandir", hi: "काली खोह मंदिर" },
  "about.tri.2.text": { en: "Ancient cave shrine, ~6 km away — Devi as Maha Kali, slayer of Raktabeeja.", hi: "प्राचीन गुफा मंदिर, लगभग ६ किमी दूर — रक्तबीज के संहारक रूप में देवी महाकाली।" },
  "about.tri.3.title": { en: "Ashtabhuja Devi Mandir", hi: "अष्टभुजा देवी मंदिर" },
  "about.tri.3.text": { en: "Hilltop shrine, ~8 km away — Devi as Maha Saraswati, eight-armed form.", hi: "पर्वत-शिखर मंदिर, लगभग ८ किमी दूर — अष्टभुज रूप में देवी महासरस्वती।" },

  "about.corridor.title": { en: "Vindhya Corridor", hi: "विन्ध्य कॉरिडोर" },
  "about.corridor.text": {
    en: "Modeled after the Kashi Vishwanath Corridor, the Vindhya Corridor is being developed at an estimated cost of ₹224+ crore. Built using pink Ahraura stone crafted by Jaipur artisans, the project widens the parikrama path to 50 ft and creates world-class facilities for pilgrims. Once complete, Maa Vindhyavasini's temple will be visible directly from the banks of the Ganga.",
    hi: "काशी विश्वनाथ कॉरिडोर की भांति, विन्ध्य कॉरिडोर का निर्माण ₹२२४+ करोड़ की लागत से हो रहा है। जयपुर के शिल्पकारों द्वारा तराशे गये अहरौरा के गुलाबी पत्थरों से निर्मित यह परियोजना परिक्रमा मार्ग को ५० फीट चौड़ा करती है तथा तीर्थयात्रियों के लिए विश्वस्तरीय सुविधाएँ उपलब्ध कराती है। पूर्ण होने पर माँ विन्ध्यवासिनी का मंदिर सीधे गंगा तट से दृष्टिगोचर होगा।",
  },

  "about.fest.title": { en: "Festivals & Pilgrimage", hi: "उत्सव एवं तीर्थयात्रा" },
  "about.fest.text": {
    en: "On the occasion of Vindhyavasini Jayanti, the Kajari festival is organised in honour of the Devi. During Navaratri, the temple town glows with lamps and flowers, and millions of devotees throng the dham. During the 2025 Prayag Maha Kumbh, more than 10 million pilgrims also visited Vindhyachal — placing it among the world's largest peaceful gatherings.",
    hi: "विन्ध्यवासिनी जयन्ती के अवसर पर देवी के सम्मान में कजरी महोत्सव का आयोजन होता है। नवरात्रि के दिनों में सम्पूर्ण नगरी दीप-पुष्पों से जगमगा उठती है और लाखों भक्त धाम में दर्शनार्थ पधारते हैं। २०२५ के प्रयाग महाकुम्भ के समय एक करोड़ से अधिक श्रद्धालु विन्ध्याचल भी पधारे — जिसने इसे विश्व के सबसे बड़े शान्तिपूर्ण समागमों में स्थान दिलाया।",
  },

  "about.access.title": { en: "How to Reach", hi: "कैसे पहुँचें" },
  "about.access.air": { en: "Air: Lal Bahadur Shastri Airport, Varanasi (~72 km).", hi: "वायुमार्ग: लाल बहादुर शास्त्री हवाई अड्डा, वाराणसी (~७२ किमी)।" },
  "about.access.rail": { en: "Rail: Vindhyachal Railway Station (BDL) ~1 km, Mirzapur (MZP) ~9 km.", hi: "रेलमार्ग: विन्ध्याचल रेलवे स्टेशन (BDL) ~१ किमी, मिर्जापुर (MZP) ~९ किमी।" },
  "about.access.road": { en: "Road: Connected via NH-2; state buses, taxis and local cars available.", hi: "सड़क मार्ग: NH-2 से जुड़ा; राज्य परिवहन की बसें, टैक्सी एवं स्थानीय वाहन उपलब्ध।" },

  "about.sansthan.title": { en: "Our Sansthan", hi: "हमारा संस्थान" },
  "about.sansthan.text": {
    en: "Namami Vindhyavasini Sansthan is a devotional trust established under the divine inspiration of Pujya Guru Ji to preserve the sacred rituals of Maa Vindhyavasini and to serve every devotee who seeks her refuge. We organise satsang, annakut bhandara, vidya daan and seva activities — making the temple a living centre of bhakti.",
    hi: "नमामि विन्ध्यवासिनी संस्थान पूज्य गुरुजी की दिव्य प्रेरणा से स्थापित एक भक्तिमय न्यास है, जिसका उद्देश्य माँ विन्ध्यवासिनी की पावन परम्पराओं की रक्षा और प्रत्येक शरणागत भक्त की सेवा करना है। हम सत्संग, अन्नकूट भंडारा, विद्या दान और सेवा गतिविधियों का आयोजन करते हैं — जिससे यह मंदिर भक्ति का एक जीवंत केंद्र बनता है।"
  },

  "about.values.vision.t": { en: "Vision", hi: "दृष्टि" },
  "about.values.vision.v": { en: "A world rooted in dharma, devotion and seva.", hi: "धर्म, भक्ति और सेवा में रचा-बसा एक संसार।" },
  "about.values.mission.t": { en: "Mission", hi: "ध्येय" },
  "about.values.mission.v": { en: "To preserve sacred traditions and serve devotees with bhakti and humility.", hi: "पवित्र परम्पराओं की रक्षा तथा विनम्रता एवं भक्ति से भक्तों की सेवा।" },
  "about.values.values.t": { en: "Values", hi: "मूल्य" },
  "about.values.values.v": { en: "Shraddha • Seva • Satsang • Sanskar • Shanti", hi: "श्रद्धा • सेवा • सत्संग • संस्कार • शान्ति" },

  "reviews.sanskrit": { en: "॥ भक्त वाणी ॥", hi: "॥ भक्त वाणी ॥" },
  "reviews.title": { en: "Devotee Reviews & Feedback", hi: "भक्तों के विचार और अनुभव" },
  "reviews.subtitle": { en: "Read what devotees say about their experience and share your own feedback with the trust.", hi: "भक्तों के पावन अनुभव पढ़ें और संस्थान के साथ अपने विचार साझा करें।" },
  "reviews.leave": { en: "Leave a Comment", hi: "टिप्पणी दीजिये" },
  "reviews.name": { en: "Your Name", hi: "आपका नाम" },
  "reviews.name.ph": { en: "Devotee name", hi: "भक्त का नाम" },
  "reviews.comment": { en: "Your Comment", hi: "आपकी टिप्पणी" },
  "reviews.comment.ph": { en: "Share your blessings, feedback or experience...", hi: "अपना अनुभव, आशीर्वाद या प्रतिक्रिया साझा करें..." },
  "reviews.submit": { en: "Submit Comment", hi: "टिप्पणी भेजें" },
  "reviews.submitting": { en: "Submitting...", hi: "भेज रहे हैं..." },
  "reviews.what": { en: "What Devotees Say", hi: "भक्त क्या कहते हैं" },
  "reviews.first": { en: "Be the first to share your experience.", hi: "अनुभव साझा करने वाले प्रथम बनें।" },
  "reviews.thanks": { en: "Dhanyavaad! Your comment has been received.", hi: "धन्यवाद! आपकी टिप्पणी प्राप्त हो गयी है।" },
  "reviews.error": { en: "Could not submit your comment. Please try again.", hi: "टिप्पणी सबमिट नहीं हो सकी। कृपया पुनः प्रयास करें।" },

  // ---- Donation ----
  "don.sanskrit": { en: "॥ दानं परम धर्मः ॥", hi: "॥ दानं परम धर्मः ॥" },
  "don.title": { en: "Donation & Seva", hi: "दान एवं सेवा" },
  "don.subtitle": { en: "Your contribution is a sacred offering at the lotus feet of Maa Vindhyavasini.", hi: "आपका योगदान माँ विन्ध्यवासिनी के चरणकमलों पर एक पावन अर्पण है।" },
  "don.bless": { en: "Bless this Seva", hi: "इस सेवा को आशीर्वाद दें" },
  "don.kicker": { en: "Daan Punya", hi: "दान-पुण्य" },
  "don.h2": { en: "Be Part of the Seva", hi: "सेवा का अंग बनें" },
  "don.text": {
    en: "Every rupee you offer becomes a flower at Maa's feet — feeding devotees, lighting lamps, educating children and preserving sacred traditions. To donate, please contact us directly for bank details, UPI or in-person seva.",
    hi: "आपका दिया हुआ हर रुपया माँ के चरणों में पुष्प बन जाता है — जिससे भक्तों को भोजन, दीप प्रज्वलन, बच्चों की शिक्षा और परम्पराओं की रक्षा होती है। दान हेतु बैंक/UPI विवरण के लिए कृपया हमसे सीधे सम्पर्क करें।",
  },
  "don.quick": { en: "Quick Donate", hi: "त्वरित दान" },
  "don.quick.bank": { en: "Bank / UPI details available on request", hi: "बैंक / UPI विवरण अनुरोध पर उपलब्ध" },
  "don.contactbtn": { en: "Contact for Donation", hi: "दान हेतु संपर्क" },
  "don.where": { en: "Where Your Contribution Goes", hi: "आपका योगदान कहाँ लगता है" },
  "don.cause.1.t": { en: "Mandir Seva", hi: "मंदिर सेवा" },
  "don.cause.1.x": { en: "Daily aarti, decoration, lighting and upkeep of the temple.", hi: "दैनिक आरती, श्रृंगार, प्रकाश एवं मंदिर का रख-रखाव।" },
  "don.cause.2.t": { en: "Annadanam / Bhandara", hi: "अन्नदानम / भण्डारा" },
  "don.cause.2.x": { en: "Sponsor prasad and meals for devotees and the needy.", hi: "भक्तों एवं ज़रूरतमंदों के लिए प्रसाद एवं भोजन का सहयोग।" },
  "don.cause.3.t": { en: "Vidya Daan", hi: "विद्या दान" },
  "don.cause.3.x": { en: "Support free Vedic, Sanskrit and value education for children.", hi: "बच्चों हेतु निःशुल्क वैदिक, संस्कृत एवं मूल्य-शिक्षा का सहयोग।" },
  "don.cause.4.t": { en: "Festival Mahotsav", hi: "उत्सव महोत्सव" },
  "don.cause.4.x": { en: "Help organise Navratri, Janmashtami and other utsavas.", hi: "नवरात्रि, जन्माष्टमी एवं अन्य उत्सवों के आयोजन में सहयोग।" },

  // ---- Contact ----
  "ct.sanskrit": { en: "॥ अतिथि देवो भव ॥", hi: "॥ अतिथि देवो भव ॥" },
  "ct.title": { en: "Contact & Appointment", hi: "संपर्क एवं समय" },
  "ct.subtitle": { en: "Reach out, write to us, or book a personal sitting with Pujya Guru Ji.", hi: "हमसे संपर्क करें, पत्र लिखें, या पूज्य गुरुजी से व्यक्तिगत भेंट का समय लें।" },
  "ct.visit": { en: "Visit", hi: "दर्शन" },
  "ct.call": { en: "Call", hi: "फ़ोन" },
  "ct.email": { en: "Email", hi: "ईमेल" },
  "ct.address": { en: "Vindhyachal Dham, Mirzapur, Uttar Pradesh 231307", hi: "विन्ध्याचल धाम, मिर्जापुर, उत्तर प्रदेश २३१३०७" },
  "ct.send.title": { en: "Send a Message", hi: "संदेश भेजें" },
  "ct.f.name": { en: "Your Name", hi: "आपका नाम" },
  "ct.f.email": { en: "Email Address", hi: "ईमेल पता" },
  "ct.f.phone": { en: "Phone (optional)", hi: "फ़ोन (वैकल्पिक)" },
  "ct.f.msg": { en: "Your Message", hi: "आपका संदेश" },
  "ct.f.send": { en: "Send Message", hi: "संदेश भेजें" },
  "ct.f.sending": { en: "Sending…", hi: "भेज रहे हैं…" },
  "ct.f.thanks": { en: "Your message has been received.", hi: "आपका संदेश प्राप्त हो गया है।" },
  "ct.f.thanksH": { en: "धन्यवाद 🙏", hi: "धन्यवाद 🙏" },
  "ct.f.toast": { en: "Message received 🙏", hi: "संदेश प्राप्त हुआ 🙏" },
  "ct.appt.title": { en: "Book Appointment with Guru Ji", hi: "गुरुजी से समय निर्धारण" },
  "ct.appt.phone": { en: "Phone Number", hi: "फ़ोन नंबर" },
  "ct.appt.email": { en: "Email (optional)", hi: "ईमेल (वैकल्पिक)" },
  "ct.appt.date": { en: "Date", hi: "तिथि" },
  "ct.appt.slot": { en: "Time slot", hi: "समय" },
  "ct.appt.purpose": { en: "Purpose of meeting (darshan, blessings, guidance...)", hi: "भेंट का उद्देश्य (दर्शन, आशीर्वाद, मार्गदर्शन...)" },
  "ct.appt.submit": { en: "Request Appointment", hi: "समय की अर्ज़" },
  "ct.appt.submitting": { en: "Submitting…", hi: "भेज रहे हैं…" },
  "ct.appt.thanksH": { en: "शुभ संकल्प 🙏", hi: "शुभ संकल्प 🙏" },
  "ct.appt.thanks": { en: "Your appointment request was received.", hi: "आपकी अर्ज़ प्राप्त हो गयी है।" },
  "ct.appt.confirm": { en: "We will confirm via phone or email soon.", hi: "हम शीघ्र ही फ़ोन या ईमेल से पुष्टि करेंगे।" },
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
  "sandesh.sanskrit": { en: "॥ गुरुर्ब्रह्मा गुरुर्विष्णुः ॥", hi: "॥ गुरुर्ब्रह्मा गुरुर्विष्णुः ॥" },
  "sandesh.title": { en: "Sandesh", hi: "संदेश" },
  "sandesh.subtitle": { en: "Daily wisdom, blessings and reflections.", hi: "दैनिक प्रेरणा, आशीर्वाद और चिन्तन।" },
  "sandesh.today": { en: "Sandesh", hi: "संदेश" },
  "sandesh.another": { en: "Show another", hi: "एक और दिखायें" },
  "sandesh.listen": { en: "Listen", hi: "सुनें" },
  "sandesh.stop": { en: "Stop", hi: "रोकें" },
  "sandesh.empty": { en: "No sandesh available yet. Please check back soon.", hi: "अभी कोई संदेश उपलब्ध नहीं है। कृपया शीघ्र पुनः पधारें।" },
  "sandesh.more": { en: "More Sandesh", hi: "अन्य संदेश" },
  "sandesh.error": { en: "Could not load sandesh.", hi: "संदेश लोड नहीं हो सके।" },
  "sandesh.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "sandesh.api_key_missing": { en: "ElevenLabs API key is missing. Please set VITE_ELEVENLABS_API_KEY.", hi: "ElevenLabs API कुंजी अनुपलब्ध है। कृपया VITE_ELEVENLABS_API_KEY सेट करें।" },
  "sandesh.audio_error": { en: "Failed to generate or play audio.", hi: "ऑडियो उत्पन्न करने या बजाने में विफल।" },

  // ---- Events page ----
  "events.sanskrit": { en: "॥ उत्सव हर भक्त का अधिकार है ॥", hi: "॥ उत्सव प्रत्येक भक्त का अधिकार है ॥" },
  "events.title": { en: "Temple Events", hi: "मंदिर के कार्यक्रम" },
  "events.subtitle": { en: "Festivals, satsang and seva programmes — join us in devotion.", hi: "उत्सव, सत्संग एवं सेवा कार्यक्रम — भक्ति में हमारे साथ जुड़ें।" },
  "events.upcoming": { en: "Upcoming Events", hi: "आगामी कार्यक्रम" },
  "events.past": { en: "Past Events", hi: "पूर्व कार्यक्रम" },
  "events.empty.up": { en: "No upcoming events scheduled. Please check back soon.", hi: "अभी कोई आगामी कार्यक्रम निर्धारित नहीं है।" },
  "events.empty.past": { en: "No past events yet.", hi: "अभी कोई पूर्व कार्यक्रम नहीं।" },
  "events.error": { en: "Could not load events.", hi: "कार्यक्रम लोड नहीं हो सके।" },

  // ---- Videos page ----
  "videos.sanskrit": { en: "॥ ज्ञानं परमं ध्येयम् ॥", hi: "॥ ज्ञानं परमं ध्येयम् ॥" },
  "videos.title": { en: "Videos", hi: "वीडियो" },
  "videos.subtitle": { en: "Watch our latest darshan, kirtan and pravachan from Vindhyachal Dham.", hi: "विन्ध्याचल धाम से नवीनतम दर्शन, कीर्तन एवं प्रवचन देखिये।" },
  "videos.tab.videos": { en: "Videos", hi: "वीडियो" },
  "videos.tab.shorts": { en: "Shorts", hi: "शॉर्ट्स" },
  "videos.featured": { en: "Featured Videos", hi: "मुख्य वीडियो" },
  "videos.shorts": { en: "Shorts", hi: "शॉर्ट्स" },

  // ---- Trikona Parikrama page ----
  "nav.parikrama": { en: "Parikrama Map", hi: "परिक्रमा मार्ग" },
  "parikrama.sanskrit": { en: "॥ त्रिगुणात्मिकायै नमः ॥", hi: "॥ त्रिगुणात्मिकायै नमः ॥" },
  "parikrama.title": { en: "Trikona Parikrama", hi: "त्रिकोण परिक्रमा" },
  "parikrama.subtitle": {
    en: "Experience the sacred triangular pilgrim path of Vindhyachal Dham, linking the Maha Trishakti temples.",
    hi: "महात्रिशक्ति मंदिरों को जोड़ने वाले विन्ध्याचल धाम के पावन त्रिकोणीय तीर्थ मार्ग का अनुभव करें।"
  },
  "parikrama.map.title": { en: "Sacred Pilgrim Circuit Map", hi: "पावन तीर्थ परिक्रमा मानचित्र" },
  "parikrama.map.info": {
    en: "Tap on any location marker to view details and listen to the sacred history of that spot.",
    hi: "विवरण देखने और उस स्थान के पावन इतिहास को सुनने के लिए किसी भी स्थान के मार्कर पर टैप करें।"
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
  "parikrama.stage0.subtitle": { en: "Sacred Purification at Ram Gaya Ghat", hi: "राम गया घाट पर पावन स्नान" },
  "parikrama.stage0.text": {
    en: "We begin our Trikona Parikrama by taking a holy dip in the sacred River Ganges. Feel the pure waters purify your body and soul. Chant, Om Namo Gangayei Vishwarupinyei Narayanyei Namo Namah.",
    hi: "हम अपनी त्रिकोण परिक्रमा की शुरुआत पतित पावनि गंगा नदी में पवित्र स्नान के साथ करते हैं। अनुभव करें कि यह दिव्य जल आपके तन और मन को पवित्र कर रहा है। बोलें, ॐ नमो गंगायै विश्वरूपिण्यै नारायण्यै नमो नमः।"
  },
  "parikrama.stage0.btn": { en: "Take Holy Dip", hi: "गंगा स्नान करें" },
  "parikrama.stage0.action_done": { en: "Purification Complete! You are ready.", hi: "स्नान संपन्न हुआ! आप परिक्रमा के लिए तैयार हैं।" },

  "parikrama.stage1.title": { en: "Stage 2: Maa Vindhyavasini Mandir", hi: "द्वितीय चरण: माँ विन्ध्यवासिनी मंदिर" },
  "parikrama.stage1.subtitle": { en: "Maha Lakshmi Swaroop — The Main Shrine", hi: "महालक्ष्मी स्वरूप — मुख्य मंदिर" },
  "parikrama.stage1.text": {
    en: "Now, arrive at the main temple of Maa Vindhyavasini, who sits on the banks of Ganga as Maha Lakshmi. Ring the bell and offer red flowers to the Mother. She is the Yogmaya child of Yashoda, who declared the doom of demon Kansa.",
    hi: "अब, मुख्य मंदिर माँ विन्ध्यवासिनी के चरणों में पधारें, जो गंगा तट पर महालक्ष्मी के रूप में विराजमान हैं। मंदिर का घंटा बजायें और माँ को लाल पुष्प अर्पित करें। वे यशोदा की वही योगमाया पुत्री हैं, जिन्होंने कंस के विनाश की घोषणा की थी।"
  },
  "parikrama.stage1.btn_bell": { en: "Ring Temple Bell", hi: "मंदिर का घंटा बजायें" },
  "parikrama.stage1.btn_flower": { en: "Offer Red Flowers", hi: "लाल पुष्प अर्पित करें" },

  "parikrama.stage2.title": { en: "Stage 3: Kali Khoh Cave Temple", hi: "तृतीय चरण: काली खोह मंदिर" },
  "parikrama.stage2.subtitle": { en: "Maha Kali Swaroop — The Cave Shrine", hi: "महाकाली स्वरूप — गुफा मंदिर" },
  "parikrama.stage2.text": {
    en: "Proceed to Kali Khoh, the cave temple of Maha Kali, nestled in the Vindhya foothills. It is here that Chamunda Devi resides, having destroyed the demons Chanda and Munda. Bow down in silence and offer your devotion.",
    hi: "विन्ध्य की तलहटी में स्थित महाकाली की गुफा काली खोह की ओर बढ़ें। यहाँ चामुण्डा देवी विराजमान हैं, जिन्होंने चण्ड और मुण्ड का संहार किया था। मौन होकर प्रणाम करें और अपनी भक्ति अर्पित करें।"
  },
  "parikrama.stage2.btn": { en: "Offer Hibiscus (Gudhal)", hi: "गुड़हल का फूल चढ़ाएं" },

  "parikrama.stage3.title": { en: "Stage 4: Maa Ashtabhuja Temple", hi: "चतुर्थ चरण: माँ अष्टभुजा मंदिर" },
  "parikrama.stage3.subtitle": { en: "Maha Saraswati Swaroop — Hilltop Shrine", hi: "महासरस्वती स्वरूप — पर्वत मंदिर" },
  "parikrama.stage3.text": {
    en: "Climb up to Ashtabhuja temple on the hill, dedicated to Maha Saraswati. She is the eighth-armed goddess who guards the holy region. Tie a sacred red thread on the tree, and make your spiritual vow.",
    hi: "पहाड़ी पर स्थित अष्टभुजा देवी मंदिर की ओर प्रस्थान करें, जो महासरस्वती को समर्पित है। वे अष्टभुज धारिणी देवी हैं जो इस पवित्र क्षेत्र की रक्षा करती हैं। यहाँ वृक्ष पर लाल रक्षा सूत्र बाँधें, और अपना आध्यात्मिक संकल्प लें।"
  },
  "parikrama.stage3.btn": { en: "Tie Sacred Thread (Mannat)", hi: "रक्षा सूत्र (मन्नत धागा) बांधें" },

  // Certificate Section
  "parikrama.cert.title": { en: "Sacred Completion", hi: "परिक्रमा पूर्णता" },
  "parikrama.cert.subtitle": { en: "Receive Your Trikona Parikrama Certificate", hi: "त्रिकोण परिक्रमा का प्रमाणपत्र प्राप्त करें" },
  "parikrama.cert.desc": {
    en: "Enter your name to generate and download a personalized Blessing Certificate of Trikona Parikrama from Namami Vindhyavasini Sansthan.",
    hi: "नमामि विन्ध्यवासिनी संस्थान से त्रिकोण परिक्रमा का अपना व्यक्तिगत आशीर्वाद प्रमाणपत्र प्राप्त करने के लिए अपना नाम दर्ज करें।"
  },
  "parikrama.cert.input_ph": { en: "Enter Devotee Name", hi: "श्रद्धालु का नाम दर्ज करें" },
  "parikrama.cert.generate": { en: "Generate Blessing Certificate", hi: "आशीर्वाद प्रमाणपत्र बनायें" },
  "parikrama.cert.download": { en: "Download Certificate", hi: "प्रमाणपत्र डाउनलोड करें" },
} as const;

export type TKey = keyof typeof translations;
