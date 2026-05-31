/* ===============================================
   ПРИЛОЖЕНИЕ ДЛЯ ИЗУЧЕНИЯ СЛОВ КОРАНА
   Версия 5.0 - с горизонтальным скроллом
   
   ОСНОВНЫЕ ФУНКЦИИ:
   - 300 самых частотных слов Корана
   - Интервальное повторение (система 6 уровней)
   - Сохранение прогресса в localStorage
   - Светлая/темная тема
   - 5 режимов: Карточки, Разделы, Прогресс, Случайное, Изученные
   - Горизонтальный скролл для навигации и вкладок
=============================================== */

/* ===============================================
   БАЗА ДАННЫХ СЛОВ (255+ слов)
   Каждое слово имеет:
   - id: уникальный идентификатор
   - ar: арабское написание
   - tr: транслитерация (латиница)
   - ru: перевод на русский
   - cat: категория (Глаголы, Существительные и т.д.)
   - freq: частота упоминания в Коране
=============================================== */
const RAW = [
    {id: 2, ar:"اللَّهُ", tr:"Allāh", ru:"Аллах", cat:"Религиозные", freq:2698},
    {id: 3, ar: "رَبِّ", tr: "rabb", ru: "Господь", cat: "Основные", freq: 980},
    {id: 4, ar: "إِنَّ", tr: "inna", ru: "поистине", cat: "Частицы", freq: 1735},
    {id: 5, ar: "كَانَ", tr: "kāna", ru: "был / есть", cat: "Глаголы", freq: 1360},
    {id: 6, ar: "مَا", tr: "mā", ru: "что / не", cat: "Частицы", freq: 2000},
    {id: 7, ar: "مِن", tr: "min", ru: "из / от", cat: "Предлоги", freq: 3226},
    {id: 8, ar: "وَ", tr: "wa", ru: "и / а", cat: "Частицы", freq: 45000},
    {id: 9, ar: "فِي", tr: "fī", ru: "в", cat: "Предлоги", freq: 1716},
    {id: 10, ar: "عَلَى", tr: "ʿalā", ru: "на / над", cat: "Предлоги", freq: 1400},
    {id: 11, ar: "إِلَى", tr: "ilā", ru: "к / до", cat: "Предлоги", freq: 742},
    {id: 12, ar: "أَنَّ", tr: "anna", ru: "что (союз)", cat: "Частицы", freq: 1500},
    {id: 13, ar: "كُلُّ", tr: "kull", ru: "каждый / весь", cat: "Местоимения", freq: 360},
    {id: 14, ar: "لَا", tr: "lā", ru: "нет / не", cat: "Частицы", freq: 5000},
    {id: 15, ar: "هُوَ", tr: "huwa", ru: "он", cat: "Местоимения", freq: 700},
    {id: 16, ar: "قَدْ", tr: "qad", ru: "уже (усиление)", cat: "Частицы", freq: 407},
    {id: 17, ar: "يَوْمَ", tr: "yawm", ru: "день", cat: "Время и место", freq: 475},
    {id: 18, ar: "عَذَابَ", tr: "ʿadhāb", ru: "наказание", cat: "Религиозные", freq: 322},
    {id: 19, ar: "نَّاسِ", tr: "nās", ru: "люди", cat: "Люди", freq: 241},
    {id: 20, ar: "آيَاتِ", tr: "āyāt", ru: "знамения", cat: "Религиозные", freq: 382},
    {id: 21, ar: "أَرْضِ", tr: "arḍ", ru: "земля", cat: "Природа", freq: 461},
    {id: 22, ar: "سَمَاوَاتِ", tr: "samāwāt", ru: "небеса", cat: "Природа", freq: 190},
    {id: 23, ar: "نَفْسِ", tr: "nafs", ru: "душа / самость", cat: "Человек", freq: 295},
    {id: 24, ar: "مَاءَ", tr: "māʾ", ru: "вода", cat: "Природа", freq: 63},
    {id: 25, ar: "حَقَّ", tr: "ḥaqq", ru: "истина / право", cat: "Религиозные", freq: 287},
    {id: 26, ar: "سَبِيلِ", tr: "sabīl", ru: "путь", cat: "Религиозные", freq: 166},
    {id: 27, ar: "يَعْلَمُ", tr: "yaʿlam", ru: "он знает", cat: "Глаголы", freq: 179},
    {id: 28, ar: "أَهْلِ", tr: "ahl", ru: "народ / семья", cat: "Люди", freq: 127},
    {id: 29, ar: "أَمَرَ", tr: "amara", ru: "приказал", cat: "Глаголы", freq: 247},
    {id: 30, ar: "جَنَّةَ", tr: "janna", ru: "Рай", cat: "Религиозные", freq: 146},
    {id: 31, ar: "نَارِ", tr: "nār", ru: "Огонь / ад", cat: "Религиозные", freq: 145},
    {id: 32, ar: "عِلْمِ", tr: "ʿilm", ru: "знание", cat: "Религиозные", freq: 105},
    {id: 33, ar: "كِتَابِ", tr: "kitāb", ru: "книга", cat: "Религиозные", freq: 261},
    {id: 34, ar: "حَكِيمٌ", tr: "ḥakīm", ru: "мудрый", cat: "Качества", freq: 97},
    {id: 35, ar: "عَلِيمٌ", tr: "ʿalīm", ru: "всезнающий", cat: "Качества", freq: 158},
    {id: 36, ar: "رَحِيمٌ", tr: "raḥīm", ru: "милосердный", cat: "Качества", freq: 115},
    {id: 37, ar: "رَحْمَانُ", tr: "raḥmān", ru: "милостивый", cat: "Качества", freq: 57},
    {id: 38, ar: "عَظِيمٌ", tr: "ʿaẓīm", ru: "великий", cat: "Качества", freq: 107},
    {id: 39, ar: "قَرِيبٌ", tr: "qarīb", ru: "близкий", cat: "Качества", freq: 27},
    {id: 40, ar: "كَبِيرٌ", tr: "kabīr", ru: "большой / великий", cat: "Качества", freq: 52},
    {id: 41, ar: "قُلْ", tr: "qul", ru: "скажи!", cat: "Глаголы", freq: 332},
    {id: 42, ar: "آمَنُوا", tr: "āmanū", ru: "уверовали", cat: "Глаголы", freq: 258},
    {id: 43, ar: "ظَلَمُوا", tr: "ẓalamū", ru: "притесняли", cat: "Глаголы", freq: 148},
    {id: 44, ar: "كَفَرُوا", tr: "kafarū", ru: "не уверовали", cat: "Глаголы", freq: 179},
    {id: 45, ar: "عَمِلُوا", tr: "ʿamilū", ru: "делали (деяния)", cat: "Глаголы", freq: 131},
    {id: 46, ar: "يُؤْمِنُونَ", tr: "yuʾminūn", ru: "они веруют", cat: "Глаголы", freq: 111},
    {id: 47, ar: "يَعْمَلُونَ", tr: "yaʿmalūn", ru: "они делают", cat: "Глаголы", freq: 128},
    {id: 48, ar: "رَسُولَ", tr: "rasūl", ru: "посланник", cat: "Религиозные", freq: 332},
    {id: 49, ar: "نَبِيّ", tr: "nabī", ru: "пророк", cat: "Религиозные", freq: 75},
    {id: 50, ar: "مُؤْمِنِينَ", tr: "muʾminīn", ru: "верующие", cat: "Люди", freq: 179},
    {id: 51, ar: "مُسْلِمِينَ", tr: "muslimīn", ru: "мусульмане", cat: "Люди", freq: 41},
    {id: 52, ar: "كَافِرِينَ", tr: "kāfirīn", ru: "неверующие", cat: "Люди", freq: 109},
    {id: 53, ar: "مُنَافِقِينَ", tr: "munāfiqīn", ru: "лицемеры", cat: "Люди", freq: 31},
    {id: 54, ar: "صَالِحِينَ", tr: "ṣāliḥīn", ru: "праведники", cat: "Люди", freq: 40},
    {id: 55, ar: "ظَالِمِينَ", tr: "ẓālimīn", ru: "притеснители", cat: "Люди", freq: 93},
    {id: 56, ar: "شَيْطَانِ", tr: "shayṭān", ru: "шайтан / дьявол", cat: "Религиозные", freq: 88},
    {id: 57, ar: "مَلَكٌ", tr: "malak", ru: "ангел", cat: "Религиозные", freq: 88},
    {id: 58, ar: "آخِرَةِ", tr: "ākhira", ru: "следующая жизнь", cat: "Религиозные", freq: 115},
    {id: 59, ar: "دُنْيَا", tr: "dunyā", ru: "мирская жизнь", cat: "Религиозные", freq: 115},
    {id: 60, ar: "صَلَاةِ", tr: "ṣalāt", ru: "молитва", cat: "Религиозные", freq: 98},
    {id: 61, ar: "زَكَاةَ", tr: "zakāt", ru: "закят", cat: "Религиозные", freq: 32},
    {id: 62, ar: "حَجِّ", tr: "ḥajj", ru: "паломничество", cat: "Религиозные", freq: 10},
    {id: 63, ar: "صِيَامَ", tr: "ṣiyām", ru: "пост", cat: "Религиозные", freq: 13},
    {id: 64, ar: "جِهَادِ", tr: "jihād", ru: "усердие на пути", cat: "Религиозные", freq: 36},
    {id: 65, ar: "تَوْبَة", tr: "tawba", ru: "покаяние", cat: "Религиозные", freq: 17},
    {id: 66, ar: "مَغْفِرَة", tr: "maghfira", ru: "прощение", cat: "Религиозные", freq: 57},
    {id: 67, ar: "هُدَى", tr: "hudā", ru: "руководство", cat: "Религиозные", freq: 95},
    {id: 68, ar: "إِيمَانَ", tr: "īmān", ru: "вера", cat: "Религиозные", freq: 45},
    {id: 69, ar: "إِسْلَامَ", tr: "islām", ru: "ислам", cat: "Религиозные", freq: 8},
    {id: 70, ar: "تَقْوَى", tr: "taqwā", ru: "богобоязненность", cat: "Религиозные", freq: 17},
    {id: 71, ar: "شُكْرَ", tr: "shukr", ru: "благодарность", cat: "Религиозные", freq: 19},
    {id: 72, ar: "صَبْرَ", tr: "ṣabr", ru: "терпение", cat: "Качества", freq: 45},
    {id: 73, ar: "عَدْلَ", tr: "ʿadl", ru: "справедливость", cat: "Качества", freq: 14},
    {id: 74, ar: "حِكْمَةَ", tr: "ḥikma", ru: "мудрость", cat: "Качества", freq: 20},
    {id: 75, ar: "نِعْمَة", tr: "niʿma", ru: "благодать / милость", cat: "Религиозные", freq: 62},
    {id: 76, ar: "فَضْلَ", tr: "faḍl", ru: "щедрость / превосходство", cat: "Качества", freq: 68},
    {id: 77, ar: "كَرِيمٌ", tr: "karīm", ru: "великодушный", cat: "Качества", freq: 27},
    {id: 78, ar:"رَزَّاقٌ", tr:"Razzāq", ru:"Наделяющий уделом", cat:"Качества", freq:4},
    {id: 79, ar: "عَفُوٌّ", tr: "ʿafuww", ru: "прощающий", cat: "Качества", freq: 6},
    {id: 80, ar: "غَفُورٌ", tr: "ghafūr", ru: "прощающий", cat: "Качества", freq: 91},
    {id: 81, ar: "قَلْبَ", tr: "qalb", ru: "сердце", cat: "Человек", freq: 132},
    {id: 82, ar: "عَقْلَ", tr: "ʿaql", ru: "разум", cat: "Человек", freq: 49},
    {id: 83, ar: "لِسَانَ", tr: "lisān", ru: "язык", cat: "Человек", freq: 25},
    {id: 84, ar: "يَدَ", tr: "yad", ru: "рука", cat: "Человек", freq: 120},
    {id: 85, ar: "عَيْنَ", tr: "ʿayn", ru: "глаз", cat: "Человек", freq: 56},
    {id: 86, ar: "وَجْهَ", tr: "wajh", ru: "лицо", cat: "Человек", freq: 71},
    {id: 87, ar: "أُذُنَ", tr: "udhn", ru: "ухо", cat: "Человек", freq: 19},
    {id: 88, ar: "رُوحَ", tr: "rūḥ", ru: "дух / душа", cat: "Человек", freq: 24},
    {id: 89, ar: "وَلَدَ", tr: "walad", ru: "ребёнок / сын", cat: "Семья", freq: 45},
    {id: 90, ar: "أُمَّ", tr: "umm", ru: "мать", cat: "Семья", freq: 22},
    {id: 91, ar: "أَبَا", tr: "ab", ru: "отец", cat: "Семья", freq: 120},
    {id: 92, ar: "أَخَا", tr: "akh", ru: "брат", cat: "Семья", freq: 52},
    {id: 93, ar: "امْرَأَة", tr: "imraʾa", ru: "женщина / жена", cat: "Семья", freq: 26},
    {id: 94, ar: "زَوْجَ", tr: "zawj", ru: "супруг", cat: "Семья", freq: 82},
    {id: 95, ar: "قَوْمَ", tr: "qawm", ru: "народ", cat: "Люди", freq: 383},
    {id: 96, ar: "أُمَّةَ", tr: "umma", ru: "нация / община", cat: "Люди", freq: 64},
    {id: 97, ar: "مَلِكَ", tr: "malik", ru: "царь", cat: "Люди", freq: 36},
    {id: 98, ar: "عَبْدَ", tr: "ʿabd", ru: "раб / слуга", cat: "Люди", freq: 133},
    {id: 99, ar: "رَجُلَ", tr: "rajul", ru: "мужчина", cat: "Люди", freq: 55},
    {id: 100, ar: "قِصَصَ", tr: "qiṣaṣ", ru: "истории", cat: "Религиозные", freq: 23},
    {id: 101, ar:"أَمَانَة", tr:"amānah", ru:"доверие", cat:"Религиозные", freq:6},
    {id: 102, ar: "فِتْنَة", tr: "fitna", ru: "смута / искушение", cat: "Религиозные", freq: 34},
    {id: 103, ar: "ظُلْمَ", tr: "ẓulm", ru: "несправедливость", cat: "Религиозные", freq: 147},
    {id: 104, ar: "حَرَامَ", tr: "ḥarām", ru: "запретное", cat: "Религиозные", freq: 83},
    {id: 105, ar: "حَلَالَ", tr: "ḥalāl", ru: "дозволенное", cat: "Религиозные", freq: 8},
    {id: 106, ar: "مَوْتَ", tr: "mawt", ru: "смерть", cat: "Религиозные", freq: 163},
    {id: 107, ar: "حَيَاةَ", tr: "ḥayāt", ru: "жизнь", cat: "Религиозные", freq: 72},
    {id: 108, ar: "قِيَامَةَ", tr: "qiyāma", ru: "Судный день", cat: "Религиозные", freq: 70},
    {id: 109, ar: "مِيزَانَ", tr: "mīzān", ru: "весы / баланс", cat: "Религиозные", freq: 15},
    {id: 110, ar: "صِرَاطَ", tr: "ṣirāṭ", ru: "прямой путь", cat: "Религиозные", freq: 45},
    {id: 111, ar: "شَمْسَ", tr: "shams", ru: "солнце", cat: "Природа", freq: 33},
    {id: 112, ar: "قَمَرَ", tr: "qamar", ru: "луна", cat: "Природа", freq: 26},
    {id: 113, ar: "نَجْمَ", tr: "najm", ru: "звезда", cat: "Природа", freq: 13},
    {id: 114, ar: "رِيحَ", tr: "rīḥ", ru: "ветер", cat: "Природа", freq: 29},
    {id: 115, ar: "بَحْرَ", tr: "baḥr", ru: "море", cat: "Природа", freq: 41},
    {id: 116, ar: "نَهْرَ", tr: "nahr", ru: "река", cat: "Природа", freq: 19},
    {id: 117, ar: "شَجَرَ", tr: "shajara", ru: "дерево", cat: "Природа", freq: 26},
    {id: 118, ar: "زَرْعَ", tr: "zarʿ", ru: "посев / урожай", cat: "Природа", freq: 13},
    {id: 120, ar:"نَخْل", tr:"nakhla", ru:"пальма", cat:"Природа", freq:5},
    {id: 119, ar: "ثَمَرَ", tr: "thamara", ru: "плод", cat: "Природа", freq: 20},
    {id: 121, ar: "جَبَلَ", tr: "jabal", ru: "гора", cat: "Природа", freq: 39},
    {id: 122, ar: "لَيْلَ", tr: "layl", ru: "ночь", cat: "Время и место", freq: 92},
    {id: 123, ar: "نَهَارَ", tr: "nahār", ru: "день (светлое время)", cat: "Время и место", freq: 57},
    {id: 124, ar: "سَاعَةَ", tr: "sāʿa", ru: "час / момент", cat: "Время и место", freq: 49},
    {id: 125, ar: "سَنَةَ", tr: "sana", ru: "год", cat: "Время и место", freq: 22},
    {id: 126, ar:"شَهْر", tr:"shahr", ru:"месяц", cat:"Время и место", freq:36},
    {id: 127, ar: "مَكَانَ", tr: "makān", ru: "место", cat: "Время и место", freq: 22},
    {id: 128, ar: "بَيْتَ", tr: "bayt", ru: "дом", cat: "Время и место", freq: 72},
    {id: 129, ar: "مَدِينَةَ", tr: "madīna", ru: "город", cat: "Время и место", freq: 14},
    {id: 130, ar: "قَرْيَةَ", tr: "qarya", ru: "деревня / поселение", cat: "Время и место", freq: 55},
    {id: 131, ar: "أَكَلَ", tr: "akala", ru: "ел", cat: "Глаголы", freq: 109},
    {id: 132, ar: "شَرِبَ", tr: "shariba", ru: "пил", cat: "Глаголы", freq: 39},
    {id: 133, ar: "ذَهَبَ", tr: "dhahaba", ru: "ушёл / пошёл", cat: "Глаголы", freq: 36},
    {id: 134, ar: "جَاءَ", tr: "jāʾa", ru: "пришёл", cat: "Глаголы", freq: 278},
    {id: 135, ar: "رَأَى", tr: "raʾā", ru: "увидел", cat: "Глаголы", freq: 148},
    {id: 136, ar: "سَمِعَ", tr: "samiʿa", ru: "услышал", cat: "Глаголы", freq: 185},
    {id: 137, ar: "خَرَجَ", tr: "kharaja", ru: "вышел", cat: "Глаголы", freq: 80},
    {id: 138, ar: "دَخَلَ", tr: "dakhala", ru: "вошёл", cat: "Глаголы", freq: 120},
    {id: 139, ar: "أَخَذَ", tr: "akhadha", ru: "взял", cat: "Глаголы", freq: 193},
    {id: 140, ar: "تَرَكَ", tr: "taraka", ru: "оставил", cat: "Глаголы", freq: 90},
    {id: 141, ar: "أَرْسَلَ", tr: "arsala", ru: "послал", cat: "Глаголы", freq: 160},
    {id: 142, ar: "أَنْزَلَ", tr: "anzala", ru: "ниспослал", cat: "Глаголы", freq: 293},
    {id: 143, ar: "خَلَقَ", tr: "khalaqa", ru: "создал", cat: "Глаголы", freq: 253},
    {id: 144, ar: "رَزَقَ", tr: "razaqa", ru: "одарил уделом", cat: "Глаголы", freq: 120},
    {id: 145, ar: "أَطَاعَ", tr: "aṭāʿa", ru: "повиновался", cat: "Глаголы", freq: 77},
    {id: 146, ar: "عَبَدَ", tr: "ʿabada", ru: "поклонялся", cat: "Глаголы", freq: 275},
    {id: 147, ar: "دَعَا", tr: "daʿā", ru: "позвал / взывал", cat: "Глаголы", freq: 210},
    {id: 148, ar: "ظَنَّ", tr: "ẓanna", ru: "думал / предполагал", cat: "Глаголы", freq: 67},
    {id: 149, ar: "عَرَفَ", tr: "ʿarafa", ru: "знал / распознал", cat: "Глаголы", freq: 37},
    {id: 150, ar: "وَجَدَ", tr: "wajada", ru: "нашёл", cat: "Глаголы", freq: 107},
    {id: 151, ar: "أَحَبَّ", tr: "aḥabba", ru: "полюбил", cat: "Глаголы", freq: 95},
    {id: 152, ar: "خَافَ", tr: "khāfa", ru: "боялся", cat: "Глаголы", freq: 96},
    {id: 153, ar: "رَجَعَ", tr: "rajaʿa", ru: "вернулся", cat: "Глаголы", freq: 104},
    {id: 154, ar: "كَذَّبَ", tr: "kadhdhaba", ru: "лгал / отвергал", cat: "Глаголы", freq: 168},
    {id: 155, ar: "فَعَلَ", tr: "faʿala", ru: "сделал", cat: "Глаголы", freq: 109},
    {id: 156, ar: "أَنَا", tr: "anā", ru: "я", cat: "Местоимения", freq: 600},
    {id: 157, ar: "نَحْنُ", tr: "naḥnu", ru: "мы", cat: "Местоимения", freq: 600},
    {id: 158, ar: "أَنْتَ", tr: "anta", ru: "ты (м.р.)", cat: "Местоимения", freq: 400},
    {id: 159, ar: "هِيَ", tr: "hiya", ru: "она", cat: "Местоимения", freq: 400},
    {id: 160, ar: "هُمْ", tr: "hum", ru: "они", cat: "Местоимения", freq: 800},
    {id: 161, ar: "أَنْتُمْ", tr: "antum", ru: "вы", cat: "Местоимения", freq: 300},
    {id: 162, ar: "الَّذِي", tr: "alladhī", ru: "тот, кто / который", cat: "Местоимения", freq: 2000},
    {id: 163, ar: "الَّذِينَ", tr: "alladhīna", ru: "те, кто / которые", cat: "Местоимения", freq: 1500},
    {id: 164, ar: "هَذَا", tr: "hādhā", ru: "этот", cat: "Местоимения", freq: 700},
    {id: 165, ar: "ذَلِكَ", tr: "dhālika", ru: "тот", cat: "Местоимения", freq: 500},
    {id: 166, ar: "لَمْ", tr: "lam", ru: "не (прошедшее)", cat: "Частицы", freq: 700},
    {id: 167, ar: "لَنْ", tr: "lan", ru: "не будет (будущее)", cat: "Частицы", freq: 100},
    {id: 168, ar: "إِذَا", tr: "idhā", ru: "когда / если", cat: "Частицы", freq: 400},
    {id: 169, ar: "إِنْ", tr: "in", ru: "если", cat: "Частицы", freq: 600},
    {id: 170, ar: "حَتَّى", tr: "ḥattā", ru: "пока / даже", cat: "Частицы", freq: 300},
    {id: 171, ar: "ثُمَّ", tr: "thumma", ru: "затем", cat: "Частицы", freq: 340},
    {id: 172, ar: "أَوْ", tr: "aw", ru: "или", cat: "Частицы", freq: 550},
    {id: 173, ar: "بَلْ", tr: "bal", ru: "наоборот / но", cat: "Частицы", freq: 110},
    {id: 174, ar: "لَكِنَّ", tr: "lākinna", ru: "но / однако", cat: "Частицы", freq: 120},
    {id: 175, ar:"عَسَى", tr:"ʿasā", ru:"возможно", cat:"Частицы", freq:40},
    {id: 176, ar: "بِ", tr: "bi", ru: "посредством / с", cat: "Предлоги", freq: 4000},
    {id: 177, ar: "لِ", tr: "li", ru: "для / чтобы", cat: "Предлоги", freq: 3000},
    {id: 178, ar: "عَنْ", tr: "ʿan", ru: "о / от", cat: "Предлоги", freq: 700},
    {id: 179, ar: "مَعَ", tr: "maʿa", ru: "вместе с", cat: "Предлоги", freq: 175},
    {id: 180, ar: "بَيْنَ", tr: "bayna", ru: "между", cat: "Предлоги", freq: 90},
    {id: 181, ar: "دُونَ", tr: "dūna", ru: "кроме / помимо", cat: "Предлоги", freq: 98},
    {id: 182, ar: "قَبْلَ", tr: "qabla", ru: "до / перед", cat: "Предлоги", freq: 91},
    {id: 183, ar: "بَعْدَ", tr: "baʿda", ru: "после", cat: "Предлоги", freq: 139},
    {id: 184, ar:"ثُمَّ", tr:"thumma", ru:"потом", cat:"Частицы", freq:340},
    {id: 185, ar: "فَوْقَ", tr: "fawqa", ru: "над", cat: "Предлоги", freq: 24},
    {id: 186, ar:"أَرْض", tr:"arḍ", ru:"земля", cat:"Природа", freq:461},
    {id: 187, ar:"سَمَاء", tr:"samāʾ", ru:"небо", cat:"Природа", freq:310},
    {id: 188, ar: "أَحَدٌ", tr: "aḥad", ru: "один / единственный", cat: "Числа", freq: 85},
    {id: 189, ar: "اثْنَيْنِ", tr: "ithnayn", ru: "два", cat: "Числа", freq: 16},
    {id: 190, ar: "ثَلَاثَةَ", tr: "thalātha", ru: "три", cat: "Числа", freq: 24},
    {id: 191, ar: "أَرْبَعَةَ", tr: "arbaʿa", ru: "четыре", cat: "Числа", freq: 9},
    {id: 192, ar: "سَبْعَةَ", tr: "sabʿa", ru: "семь", cat: "Числа", freq: 24},
    {id: 193, ar: "عَشَرَةَ", tr: "ʿashara", ru: "десять", cat: "Числа", freq: 9},
    {id: 194, ar: "مِئَةَ", tr: "miʾa", ru: "сто", cat: "Числа", freq: 7},
    {id: 195, ar: "أَلْفَ", tr: "alf", ru: "тысяча", cat: "Числа", freq: 11},
    {id: 196, ar: "كَثِيرًا", tr: "kathīr", ru: "много", cat: "Описание", freq: 160},
    {id: 197, ar: "قَلِيلًا", tr: "qalīl", ru: "мало", cat: "Описание", freq: 50},
    {id: 198, ar: "كَبِيرًا", tr: "kabīr", ru: "большой", cat: "Описание", freq: 100},
    {id: 199, ar: "صَغِيرًا", tr: "ṣaghīr", ru: "маленький", cat: "Описание", freq: 22},
    {id: 200, ar: "حَسَنًا", tr: "ḥasan", ru: "хороший / красивый", cat: "Описание", freq: 90},
    {id: 201, ar: "خَيْرًا", tr: "khayr", ru: "добро / лучше", cat: "Описание", freq: 210},
    {id: 202, ar: "شَرًّا", tr: "sharr", ru: "зло / хуже", cat: "Описание", freq: 80},
    {id: 203, ar:"سَيِّئَة", tr:"sayyiʾah", ru:"плохой поступок", cat:"Качества", freq:47},
    {id: 204, ar:"حَسَنَة", tr:"ḥasanah", ru:"хороший поступок", cat:"Качества", freq:64},
    {id: 205, ar:"طَيِّب", tr:"ṭayyib", ru:"благий", cat:"Качества", freq:32},
    {id: 206, ar: "أَوَّلُ", tr: "awwal", ru: "первый", cat: "Описание", freq: 60},
    {id: 207, ar: "آخِرُ", tr: "ākhir", ru: "последний", cat: "Описание", freq: 70},
    {id: 208, ar: "مُوسَى", tr: "Mūsā", ru: "Муса (Моисей)", cat: "Пророки", freq: 136},
    {id: 209, ar: "عِيسَى", tr: "ʿĪsā", ru: "Иса (Иисус)", cat: "Пророки", freq: 25},
    {id: 210, ar: "إِبْرَاهِيمَ", tr: "Ibrāhīm", ru: "Ибрахим (Авраам)", cat: "Пророки", freq: 69},
    {id: 211, ar: "نُوحٍ", tr: "Nūḥ", ru: "Нух (Ной)", cat: "Пророки", freq: 43},
    {id: 212, ar: "يُوسُفَ", tr: "Yūsuf", ru: "Юсуф (Иосиф)", cat: "Пророки", freq: 27},
    {id: 213, ar: "دَاوُودَ", tr: "Dāwūd", ru: "Давуд (Давид)", cat: "Пророки", freq: 16},
    {id: 214, ar: "سُلَيْمَانَ", tr: "Sulaymān", ru: "Сулейман (Соломон)", cat: "Пророки", freq: 17},
    {id: 215, ar: "آدَمَ", tr: "Ādam", ru: "Адам", cat: "Пророки", freq: 25},
    {id: 216, ar: "مُحَمَّد", tr: "Muḥammad", ru: "Мухаммад", cat: "Пророки", freq: 4},
    {id: 217, ar: "مَرْيَمَ", tr: "Maryam", ru: "Мариям (Мария)", cat: "Пророки", freq: 34},
    {id: 218, ar:"هَارُونَ", tr:"Hārūn", ru:"Харун (Аарон)", cat:"Пророки", freq:20},
    {id: 219, ar: "بَاطِلَ", tr: "bāṭil", ru: "ложь / тщетность", cat: "Религиозные", freq: 36},
    {id: 220, ar: "صِدْقَ", tr: "ṣidq", ru: "правдивость", cat: "Качества", freq: 50},
    {id: 221, ar:"صِدِّيق", tr:"ṣiddīq", ru:"правдивейший", cat:"Качества", freq:10},
    {id: 222, ar: "حِسَابَ", tr: "ḥisāb", ru: "расчёт / отчёт", cat: "Религиозные", freq: 39},
    {id: 223, ar: "ثَوَابَ", tr: "thawāb", ru: "награда", cat: "Религиозные", freq: 35},
    {id: 224, ar:"غُرْفَة", tr:"ghurfah", ru:"комната", cat:"Места", freq:5},
    {id: 225, ar: "سَلَامَ", tr: "salām", ru: "мир / приветствие", cat: "Религиозные", freq: 140},
    {id: 226, ar: "رَحْمَةَ", tr: "raḥma", ru: "милость", cat: "Религиозные", freq: 79},
    {id: 227, ar: "نَصْرَ", tr: "naṣr", ru: "помощь / победа", cat: "Религиозные", freq: 78},
    {id: 228, ar: "فَتْحَ", tr: "fatḥ", ru: "открытие / победа", cat: "Религиозные", freq: 24},
    {id: 229, ar:"كُرْسِيّ", tr:"kursiyy", ru:"трон", cat:"Места", freq:2},
    {id: 230, ar:"سَرِير", tr:"sarīr", ru:"ложе", cat:"Места", freq:5},
    {id: 231, ar: "عَهْدَ", tr: "ʿahd", ru: "завет / обещание", cat: "Религиозные", freq: 49},
    {id: 232, ar:"مِصْبَاح", tr:"miṣbāḥ", ru:"светильник", cat:"Места", freq:4},
    {id: 233, ar: "وَعْدَ", tr: "waʿd", ru: "обещание", cat: "Религиозные", freq: 56},
    {id: 234, ar: "حُجَّةَ", tr: "ḥujja", ru: "довод / доказательство", cat: "Религиозные", freq: 10},
    {id: 235, ar:"حَجَر", tr:"ḥajar", ru:"камень", cat:"Природа", freq:12},
    {id: 236, ar:"طِين", tr:"ṭīn", ru:"глина", cat:"Природа", freq:6},
    {id: 237, ar:"تُرَاب", tr:"turāb", ru:"земля/пыль", cat:"Природа", freq:12},
    {id: 238, ar:"نَار", tr:"nār", ru:"огонь", cat:"Религиозные", freq:145},
    {id: 239, ar: "فَسَادَ", tr: "fasād", ru: "нечестие / порча", cat: "Религиозные", freq: 50},
    {id: 240, ar: "إِصْلَاحَ", tr: "iṣlāḥ", ru: "исправление", cat: "Религиозные", freq: 36},
    {id: 241, ar: "بَيِّنَةَ", tr: "bayyina", ru: "ясное доказательство", cat: "Религиозные", freq: 19},
    {id: 242, ar:"آخِر", tr:"ākhir", ru:"последний", cat:"Описание", freq:70},
    {id: 243, ar:"أَوَّل", tr:"awwal", ru:"первый", cat:"Описание", freq:60},
    {id: 244, ar: "أَجَلَ", tr: "ajal", ru: "срок / предел", cat: "Религиозные", freq: 54},
    {id: 245, ar: "رِزْقَ", tr: "rizq", ru: "пропитание", cat: "Религиозные", freq: 123},
    {id: 246, ar: "نُورَ", tr: "nūr", ru: "свет", cat: "Религиозные", freq: 43},
    {id: 247, ar: "ظُلْمَةَ", tr: "ẓulma", ru: "тьма", cat: "Религиозные", freq: 24},
    {id: 248, ar:"ظُلُمَات", tr:"ẓulumāt", ru:"мраки", cat:"Религиозные", freq:24},
    {id: 249, ar: "غَيْبَ", tr: "ghayb", ru: "незримое", cat: "Религиозные", freq: 59},
    {id: 250, ar:"جَهَنَّم", tr:"jahannam", ru:"ад", cat:"Религиозные", freq:77},
    {id: 251, ar: "كُفْرَ", tr: "kufr", ru: "неверие", cat: "Религиозные", freq: 37},
    {id: 252, ar: "شِرْكَ", tr: "shirk", ru: "многобожие", cat: "Религиозные", freq: 41},
    {id: 253, ar: "فِسْقَ", tr: "fisq", ru: "нечестивость", cat: "Религиозные", freq: 54},
    {id: 254, ar:"فَاجِر", tr:"fājir", ru:"нечестивец", cat:"Люди", freq:4},
    {id: 255, ar: "ذَنْبَ", tr: "dhanb", ru: "грех", cat: "Религиозные", freq: 36},
    {id: 256, ar: "إِثْمَ", tr: "ithm", ru: "грех / злодеяние", cat: "Религиозные", freq: 36},
    {id: 257, ar:"خَطِيئَة", tr:"khaṭīʾah", ru:"грех", cat:"Религиозные", freq:24},
    {id: 258, ar:"جُرْم", tr:"jurm", ru:"преступление", cat:"Религиозные", freq:27},
    {id: 259, ar:"حَنِيف", tr:"ḥanīf", ru:"единобожник", cat:"Религиозные", freq:10},
    {id: 260, ar:"كَافِر", tr:"kāfir", ru:"неверующий", cat:"Люди", freq:109},
    {id: 261, ar:"مُشْرِك", tr:"mushrik", ru:"многобожник", cat:"Люди", freq:30},
    {id: 262, ar: "آيَةَ", tr: "āya", ru: "знамение / аят", cat: "Религиозные", freq: 250},
    {id: 263, ar: "قُرْآنَ", tr: "Qurʾān", ru: "Коран", cat: "Религиозные", freq: 70},
    {id: 264, ar:"زَبُور", tr:"Zabūr", ru:"Псалтырь", cat:"Религиозные", freq:3},
    {id: 265, ar: "تَوْرَاةَ", tr: "Tawrāt", ru: "Тора", cat: "Религиозные", freq: 18},
    {id: 266, ar: "إِنْجِيلَ", tr: "Injīl", ru: "Евангелие", cat: "Религиозные", freq: 12},
    {id: 267, ar:"صُحُف", tr:"ṣuḥuf", ru:"свитки", cat:"Религиозные", freq:7},
    {id: 268, ar: "وَحْيَ", tr: "waḥy", ru: "откровение", cat: "Религиозные", freq: 78},
    {id: 269, ar:"بُشْرَى", tr:"bushrā", ru:"благая весть", cat:"Религиозные", freq:12},
    {id: 270, ar:"نَذِير", tr:"nadhīr", ru:"предостерегающий", cat:"Религиозные", freq:38},
    {id: 271, ar: "مَثَلَ", tr: "mathal", ru: "притча / пример", cat: "Религиозные", freq: 169},
    {id: 272, ar:"قَصَص", tr:"qaṣaṣ", ru:"истории", cat:"Религиозные", freq:23},
    {id: 273, ar:"حَدِيث", tr:"ḥadīth", ru:"рассказ/речь", cat:"Религиозные", freq:23},
    {id: 274, ar: "كِبْرَ", tr: "kibr", ru: "высокомерие", cat: "Человек", freq: 27},
    {id: 275, ar:"أَشَدّ", tr:"ashadd", ru:"сильнее", cat:"Описание", freq:21},
    {id: 276, ar:"أَحْسَن", tr:"aḥsan", ru:"лучший", cat:"Описание", freq:35},
    {id: 277, ar: "إِسْرَافَ", tr: "isrāf", ru: "расточительство", cat: "Человек", freq: 23},
    {id: 278, ar:"أَكْثَر", tr:"akthar", ru:"большинство", cat:"Описание", freq:78},
    {id: 279, ar:"أَقَلّ", tr:"aqall", ru:"меньшинство", cat:"Описание", freq:11},
    {id: 280, ar:"أَوْسَط", tr:"awsaṭ", ru:"средний", cat:"Описание", freq:3},
    {id: 281, ar:"شِدَّة", tr:"shiddah", ru:"тяжесть", cat:"Описание", freq:7},
    {id: 282, ar: "ضَلَّ", tr: "ḍalla", ru: "заблудился", cat: "Глаголы", freq: 191},
    {id: 283, ar: "هَدَى", tr: "hadā", ru: "направил на путь", cat: "Глаголы", freq: 316},
    {id: 284, ar: "أَحْيَا", tr: "aḥyā", ru: "оживил", cat: "Глаголы", freq: 60},
    {id: 285, ar: "أَمَاتَ", tr: "amāta", ru: "умертвил", cat: "Глаголы", freq: 23},
    {id: 286, ar: "غَفَرَ", tr: "ghafara", ru: "простил", cat: "Глаголы", freq: 234},
    {id: 287, ar:"أَذِنَ", tr:"adhina", ru:"позволил", cat:"Глаголы", freq:11},
    {id: 288, ar: "شَاءَ", tr: "shāʾa", ru: "пожелал", cat: "Глаголы", freq: 200},
    {id: 289, ar: "قَدَرَ", tr: "qadara", ru: "определил / смог", cat: "Глаголы", freq: 132},
    {id: 290, ar: "تَابَ", tr: "tāba", ru: "покаялся", cat: "Глаголы", freq: 87},
    {id: 291, ar: "سَأَلَ", tr: "saʾala", ru: "спросил", cat: "Глаголы", freq: 130},
    {id: 292, ar: "أَجَابَ", tr: "ajāba", ru: "ответил", cat: "Глаголы", freq: 43},
    {id: 293, ar: "أَنْعَمَ", tr: "anʿama", ru: "облагодетельствовал", cat: "Глаголы", freq: 47},
    {id: 294, ar: "حَكَمَ", tr: "ḥakama", ru: "рассудил / правил", cat: "Глаголы", freq: 89},
    {id: 295, ar: "جَعَلَ", tr: "jaʿala", ru: "сделал / назначил", cat: "Глаголы", freq: 345},
    {id: 296, ar: "أَقَامَ", tr: "aqāma", ru: "установил / выстоял", cat: "Глаголы", freq: 66},
    {id: 297, ar: "نَسِيَ", tr: "nasiya", ru: "забыл", cat: "Глаголы", freq: 42},
    {id: 298, ar: "ذَكَرَ", tr: "dhakara", ru: "вспомнил / упомянул", cat: "Глаголы", freq: 292},
    {id: 299, ar: "فَهِمَ", tr: "fahima", ru: "понял", cat: "Глаголы", freq: 20},
    {id: 300, ar: "تَدَبَّرَ", tr: "tadabbara", ru: "размышлял", cat: "Глаголы", freq: 4},
    {id: 1, ar: "قَالَ", tr: "qāla", ru: "он сказал", cat: "Глаголы", freq: 1625},
];

/* ===============================================
   ПРЕОБРАЗОВАНИЕ КАТЕГОРИЙ
   Объединяем "Основные" и "Нарративные" в "Религиозные"
=============================================== */
const WORDS = RAW.map(w => ({
    ...w,
    cat: (w.cat === "Основные" || w.cat === "Нарративные") ? "Религиозные" : w.cat
}));

/* ===============================================
   КОНСТАНТЫ
=============================================== */
const ALL_CATS = [...new Set(WORDS.map(w => w.cat))];           // Все уникальные категории
const CAT_NAV_CATS = ["Все", "На повторение", ...ALL_CATS];     // Категории для навигации
const LVL_LABELS = ['Новое', 'Знакомое', 'Знаю', 'Хорошо', 'Отлично', 'Мастер'];
const LVL_COLORS = ['#e85555', '#f0a030', '#e8c87a', '#3db87a', '#5bc9c9', '#5b8dee'];

/* ===============================================
   СОСТОЯНИЕ ПРИЛОЖЕНИЯ
=============================================== */
let state = {
    cards: {},           // Прогресс по словам
    sessions: 0,         // Количество сессий
    currentCat: "Все",   // Текущая выбранная категория
    mode: "cards",       // Текущий режим (cards/sections/progress/random/learned)
    queue: [],           // Очередь слов для повторения
    queueIdx: 0,         // Индекс текущего слова
    flipped: false,      // Перевернута ли карточка
    openSections: {},    // Состояние раскрытых разделов
    _lastMode: null      // Последний режим (для random)
};

let darkMode = true;     // Флаг темной темы (по умолчанию темная)

/* ===============================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
=============================================== */

// Плавная прокрутка к элементу по ID
const scrollTo = (id, off = 70) => {
    requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        window.scrollTo({
            top: el.getBoundingClientRect().top + window.pageYOffset - off,
            behavior: 'smooth'
        });
    });
};

// Плавная прокрутка к DOM-элементу
const scrollEl = (el, off = 70) => {
    if (!el) return;
    requestAnimationFrame(() => window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - off,
        behavior: 'smooth'
    }));
};

/* ===============================================
   ТЕМА
=============================================== */
function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('light-mode', !darkMode);
    document.getElementById('theme-btn').textContent = darkMode ? '☀️' : '🌙';
}

/* ===============================================
   ПРОГРЕСС СЛОВА
=============================================== */
function getP(id) {
    return state.cards[id] || { level: 0, nextReview: 0, reviews: 0 };
}

/* ===============================================
   ИНТЕРВАЛЬНОЕ ПОВТОРЕНИЕ
   Интервалы в днях: [0, 1, 3, 7, 14, 30]
=============================================== */
function setP(id, r) {
    const p = getP(id);
    const now = Date.now();
    const ivs = [0, 1, 3, 7, 14, 30];
    let lv = p.level;
    
    if (r === 'easy') lv = Math.min(5, lv + 2);
    else if (r === 'medium') lv = Math.min(5, lv + 1);
    else lv = Math.max(0, lv - 1);
    
    state.cards[id] = {
        level: lv,
        nextReview: now + ivs[lv] * 86400000,
        reviews: p.reviews + 1
    };
    save();
}

/* ===============================================
   СОХРАНЕНИЕ И ЗАГРУЗКА
=============================================== */
function save() {
    localStorage.setItem('qcards_v5', JSON.stringify({
        cards: state.cards,
        sessions: state.sessions
    }));
}

function load() {
    const saved = localStorage.getItem('qcards_v5');
    if (saved) {
        try {
            const d = JSON.parse(saved);
            if (d.cards) state.cards = d.cards;
            if (d.sessions) state.sessions = d.sessions;
        } catch (e) { }
    }
    updateStats();
    renderCatNav();
}

/* ===============================================
   ФИЛЬТРАЦИЯ СЛОВ
=============================================== */

// Слова на повторение (уровень < 2 ИЛИ истекло время)
function weakWords() {
    const now = Date.now();
    return WORDS.filter(w => {
        const p = getP(w.id);
        return p.level < 2 || p.nextReview <= now;
    });
}

// Изученные слова (уровень >= 3)
function learnedWords() {
    return WORDS.filter(w => getP(w.id).level >= 3);
}

function learnedCount() {
    return learnedWords().length;
}

// Слова по категории
function catWords(cat) {
    if (cat === "Все") return WORDS;
    if (cat === "На повторение") return weakWords();
    return WORDS.filter(w => w.cat === cat);
}

// Прогресс по категории (процент освоенных слов)
function catProgress(cat) {
    const ws = catWords(cat);
    const lv = ws.filter(w => getP(w.id).level >= 3).length;
    return ws.length ? Math.round(lv / ws.length * 100) : 0;
}

/* ===============================================
   ОБНОВЛЕНИЕ СТАТИСТИКИ
=============================================== */
function updateStats() {
    document.getElementById('s-total').textContent = WORDS.length;
    document.getElementById('s-learned').textContent = learnedCount();
    document.getElementById('s-review').textContent = weakWords().length;
    document.getElementById('s-streak').textContent = state.sessions;
}

// Создание очереди для повторения (случайный порядок)
function buildQueue(words) {
    state.queue = [...words].sort(() => Math.random() - 0.5);
    state.queueIdx = 0;
    state.flipped = false;
}

/* ===============================================
   НАВИГАЦИЯ ПО КАТЕГОРИЯМ
=============================================== */
function renderCatNav() {
    const rc = weakWords().length;
    document.getElementById('cat-nav').innerHTML = CAT_NAV_CATS.map(c => {
        const ex = c === "На повторение" ? `<span class="review-count">${rc}</span>` : '';
        const a = c === state.currentCat ? 'active' : '';
        const r = c === "На повторение" ? 'review-btn' : '';
        return `<button class="cat-btn ${a} ${r}" onclick="selCat('${c}')">${c}${ex}</button>`;
    }).join('');
}

// Выбор категории
function selCat(cat) {
    state.currentCat = cat;
    if (state.mode !== 'progress' && state.mode !== 'learned') {
        state.mode = 'cards';
    }
    buildQueue(catWords(cat));
    renderCatNav();
    renderMain();
    scrollTo('main-content', 80);
}

/* ===============================================
   ВКЛАДКИ РЕЖИМОВ (горизонтальный скролл)
=============================================== */
function modeTabs() {
    const modes = [
        { id: 'cards', label: '＃ Карточки' },
        { id: 'sections', label: '☰ Разделы' },
        { id: 'progress', label: '📊 Прогресс' },
        { id: 'random', label: '🎲 Случайное' },
        { id: 'learned', label: '✅ Изученные' },
    ];
    return `<div class="mode-tabs scroll-row">${modes.map(m => 
        `<button class="mode-tab ${state.mode === m.id ? 'active' : ''}" onclick="switchMode('${m.id}')">${m.label}</button>`
    ).join('')}</div>`;
}

/* ===============================================
   ОСНОВНОЙ РЕНДЕР
=============================================== */
function renderMain() {
    const el = document.getElementById('main-content');
    const tabs = modeTabs();
    
    if (state.mode === 'cards') renderCards(el, tabs);
    else if (state.mode === 'sections') renderSections(el, tabs);
    else if (state.mode === 'progress') renderProgress(el, tabs);
    else if (state.mode === 'random') renderRandom(el, tabs);
    else if (state.mode === 'learned') renderLearned(el, tabs);
}

// Переключение режима
function switchMode(m) {
    state.mode = m;
    if (m === 'random') buildQueue(WORDS);
    renderMain();
    scrollTo('main-content', 80);
}

/* ===============================================
   РЕЖИМ КАРТОЧЕК
=============================================== */
function renderCards(el, tabs) {
    const words = catWords(state.currentCat);
    if (!words.length) {
        el.innerHTML = tabs + `<div class="empty-state">✨<p style="margin-top:8px">Нет слов для повторения</p></div>`;
        return;
    }
    
    if (state.queueIdx >= state.queue.length) {
        state.sessions++;
        save();
        el.innerHTML = tabs + `<div class="completed-screen" style="padding:28px 16px;text-align:center">
            <div style="font-size:48px;margin-bottom:10px">🌙</div>
            <h2>Сессия завершена</h2>
            <p>Вы прошли ${state.queue.length} слов.</p>
            <button class="btn-primary" onclick="restart()">Ещё раз</button>
        </div>`;
        updateStats();
        return;
    }
    
    const w = state.queue[state.queueIdx];
    const p = getP(w.id);
    const pct = Math.round((state.queueIdx / state.queue.length) * 100);
    
    el.innerHTML = tabs + `
        <div class="card-progress">
            <div class="prog-bar"><div class="prog-fill gold" style="width:${pct}%"></div></div>
        </div>
        <div class="progress-label"><span>${state.queueIdx} / ${state.queue.length}</span><span style="color:${LVL_COLORS[p.level]}">${LVL_LABELS[p.level]}</span></div>
        <div id="card-anchor" class="card-area">
            <div class="card-wrap" onclick="flipCard()">
                <div class="card ${state.flipped ? 'flipped' : ''}">
                    <div class="card-front">
                        <div class="card-tag">${w.cat}</div>
                        <div class="arabic-word">${w.ar}</div>
                        <div class="transliteration">${w.tr}</div>
                        <div class="tap-hint">Нажмите чтобы открыть перевод</div>
                    </div>
                    <div class="card-back">
                        <div class="card-tag">${w.cat}</div>
                        <div class="arabic-small">${w.ar}</div>
                        <div class="translation">${w.ru}</div>
                        <div class="meaning-detail">${w.tr} · ~${w.freq} раз в Коране</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-nav">
            <button class="card-arrow" onclick="navCard(-1)" ${state.queueIdx === 0 ? 'disabled' : ''}>←</button>
            <div class="card-arrow-label">${state.flipped ? 'Оцените слово' : 'Нажмите на карточку'}</div>
            <button class="card-arrow" onclick="navCard(1)">→</button>
        </div>
        <div class="rating-btns ${state.flipped ? '' : 'hidden'}">
            <button class="r-btn r-hard" onclick="rate('hard')">Трудно</button>
            <button class="r-btn r-med" onclick="rate('medium')">Нормально</button>
            <button class="r-btn r-easy" onclick="rate('easy')">Легко!</button>
        </div>`;
}

function flipCard() {
    state.flipped = !state.flipped;
    renderMain();
    scrollTo('card-anchor', 80);
}

function navCard(d) {
    if (d === -1 && state.queueIdx > 0) {
        state.queueIdx--;
        state.flipped = false;
    } else if (d === 1) {
        state.queueIdx++;
        state.flipped = false;
    }
    renderMain();
    scrollTo('card-anchor', 80);
}

function rate(r) {
    setP(state.queue[state.queueIdx].id, r);
    state.queueIdx++;
    state.flipped = false;
    updateStats();
    renderMain();
    scrollTo('card-anchor', 80);
}

function restart() {
    buildQueue(catWords(state.currentCat));
    renderMain();
    scrollTo('card-anchor', 80);
}

/* ===============================================
   РЕЖИМ РАЗДЕЛЫ (аккордеон)
=============================================== */
function renderSections(el, tabs) {
    let html = tabs;
    for (const cat of ALL_CATS) {
        const cw = WORDS.filter(w => w.cat === cat);
        const lv = cw.filter(w => getP(w.id).level >= 3).length;
        const pct = Math.round(lv / cw.length * 100);
        const isOpen = !!state.openSections[cat];
        const fc = pct >= 80 ? '#3db87a' : pct >= 40 ? '#c9a84c' : '#5b8dee';
        const sid = 'sec-' + cat.replace(/\s/g, '_');
        
        html += `<div class="acc-section" id="${sid}">
            <div class="acc-header">
                <div class="acc-top">
                    <div class="acc-left">
                        <div class="acc-title-row">
                            <span class="acc-title">${cat}</span>
                            <span class="acc-meta">${cw.length} сл. · ${lv} освоено</span>
                            <span class="acc-pct">${pct}%</span>
                        </div>
                        <div class="acc-prog"><div class="acc-prog-fill" style="width:${pct}%;background:${fc}"></div></div>
                    </div>
                    <div class="acc-right">
                        <button class="acc-go-btn" onclick="goToSection('${cat}')">▶ Учить</button>
                        <div class="acc-arrow-btn" onclick="toggleSection(event,'${cat}')">
                            <span class="acc-arrow-icon ${isOpen ? 'open' : ''}">▾</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="acc-body ${isOpen ? 'open' : ''}">
                <div class="word-grid">`;
        
        for (const w of cw) {
            const lv2 = getP(w.id).level;
            const lc = lv2 >= 4 ? 'lvl-3' : lv2 >= 2 ? 'lvl-2' : lv2 === 1 ? 'lvl-1' : 'lvl-0';
            const wc = lv2 >= 3 ? 'mastered' : lv2 === 0 ? 'weak' : '';
            html += `<div class="word-card ${wc}">
                <div class="ar">${w.ar}</div>
                <div class="tr">${w.tr}</div>
                <div class="ru">${w.ru}</div>
                <span class="lvl ${lc}">${LVL_LABELS[lv2]}</span>
            </div>`;
        }
        html += `</div></div></div>`;
    }
    el.innerHTML = html;
}

function goToSection(cat) {
    state.currentCat = cat;
    state.mode = 'cards';
    buildQueue(WORDS.filter(w => w.cat === cat));
    renderCatNav();
    renderMain();
    scrollTo('card-anchor', 80);
}

function toggleSection(e, cat) {
    e.stopPropagation();
    state.openSections[cat] = !state.openSections[cat];
    renderMain();
    requestAnimationFrame(() => {
        const sec = document.getElementById('sec-' + cat.replace(/\s/g, '_'));
        scrollEl(sec, 80);
    });
}

/* ===============================================
   РЕЖИМ ПРОГРЕСС
=============================================== */
function renderProgress(el, tabs) {
    const total = WORDS.length;
    const learned = learnedCount();
    const overall = Math.round(learned / total * 100);
    let rows = '';
    
    for (const cat of ALL_CATS) {
        const pct = catProgress(cat);
        const fc = pct >= 80 ? '#3db87a' : pct >= 40 ? '#c9a84c' : '#5b8dee';
        rows += `<div class="prog-cat-row">
            <div class="prog-cat-name">${cat}</div>
            <div class="prog-cat-bar"><div class="prog-cat-fill" style="width:${pct}%;background:${fc}"></div></div>
            <div class="prog-cat-pct">${pct}%</div>
        </div>`;
    }
    
    el.innerHTML = tabs + `<div class="progress-page">
        ${rows}
        <div class="prog-total">
            <div class="prog-big">${overall}%</div>
            <div class="prog-sub">${learned} из ${total} слов изучено</div>
        </div>
    </div>`;
}

/* ===============================================
   РЕЖИМ СЛУЧАЙНОЕ
=============================================== */
function renderRandom(el, tabs) {
    if (!state.queue.length || state._lastMode !== 'random') {
        buildQueue(WORDS);
        state._lastMode = 'random';
    }
    const savedCat = state.currentCat;
    state.currentCat = 'Все';
    renderCards(el, tabs);
    state.currentCat = savedCat;
}

/* ===============================================
   РЕЖИМ ИЗУЧЕННЫЕ СЛОВА
=============================================== */
function renderLearned(el, tabs) {
    const lw = learnedWords();
    if (!lw.length) {
        el.innerHTML = tabs + `<div class="learned-empty">
            <div style="font-size:36px;margin-bottom:10px">📖</div>
            <p>Изученных слов пока нет.<br>Оценивайте карточки «Легко!».</p>
        </div>`;
        return;
    }
    
    let html = tabs + `<div style="font-size:12px;color:var(--text2);margin:4px 0 10px">${lw.length} слов уровня 3+</div><div class="word-grid">`;
    for (const w of lw) {
        const lv = getP(w.id).level;
        const lc = lv >= 4 ? 'lvl-3' : 'lvl-2';
        html += `<div class="word-card mastered">
            <div class="ar">${w.ar}</div>
            <div class="tr">${w.tr}</div>
            <div class="ru">${w.ru}</div>
            <span class="lvl ${lc}">${LVL_LABELS[lv]}</span>
        </div>`;
    }
    html += `</div>`;
    el.innerHTML = html;
}

/* ===============================================
   ЗАПУСК ПРИЛОЖЕНИЯ
=============================================== */
buildQueue(catWords("Все"));
updateStats();
renderCatNav();
renderMain();
load();