const cards = [
  { question: "Who is the Hydro Archon in Genshin Impact?", answer: "Mona" },
  {
    question: "Which character is known as the 'Frostflake Heron'?",
    answer: "Ganyu",
  },
  {
    question: "Who wields a catalyst and is a librarian in Mondstadt?",
    answer: "Lisa",
  },
  { question: "Who is the princess of the Liyue Qixing?", answer: "Ningguang" },
  {
    question: "Who is the Cryo user from Dragonspine with a polearm?",
    answer: "Rosaria",
  },
  {
    question: "Who is the Pyro user known for her ability to summon dolls?",
    answer: "Yoimiya",
  },
  {
    question: "Which character is the Electro Archon’s twin sister?",
    answer: "Raiden Shogun / Ei",
  },
  {
    question: "Who is the Anemo user with a Vision of the wind and a catalyst?",
    answer: "Sucrose",
  },
  {
    question: "Who is the Geo user and the granddaughter of Rex Lapis?",
    answer: "Ningguang",
  },
  {
    question: "Who is the Cryo user from Mondstadt with a bow?",
    answer: "Diona",
  },
  {
    question: "Who is the Pyro user and the owner of the Wanmin Restaurant?",
    answer: "Xiangling",
  },
  {
    question:
      "Which character is the Electro user who fights with a bow and is from Inazuma?",
    answer: "Yae Miko",
  },
  {
    question: "Who is the Hydro user and princess of Fontaine?",
    answer: "Candace",
  },
  {
    question: "Who is the Dendro user known as the 'Forest Dweller'?",
    answer: "Collei",
  },
  {
    question:
      "Who is the Pyro user and member of the Liyue Adventurers’ Guild?",
    answer: "Xiangling",
  },
  {
    question:
      "Who is the Electro user and shrine maiden of Grand Narukami Shrine?",
    answer: "Yae Miko",
  },
  {
    question: "Who is the Dendro user with a bow from Sumeru?",
    answer: "Tighnari",
  }, // Tighnari is male, so ignore
  {
    question: "Who is the Anemo user and daughter of the Stormterror?",
    answer: "Jean",
  },
  {
    question:
      "Which character is the Hydro user and the captain of the Liyue Harbor’s guards?",
    answer: "Xingqiu",
  }, // Xingqiu is male
  {
    question: "Who is the Cryo user known as the 'Blazing Sun'?",
    answer: "Eula",
  },
  {
    question: "Who is the Valkyrie known as the 'God of War'?",
    answer: "Kiana Kaslana",
  },
  {
    question:
      "Which character is the captain of the Valkyries and wields dual pistols?",
    answer: "Bronya Zaychik",
  },
  {
    question:
      "Who is the mysterious Valkyrie with the title 'Starlit Astrologos'?",
    answer: "Fu Hua",
  },
  {
    question:
      "Who is the Valkyrie known for her elegant combat style and 'Starlit Astrologos' title?",
    answer: "Fu Hua",
  },
  {
    question:
      "Who is the energetic and cheerful Valkyrie known as 'Herrscher of Thunder'?",
    answer: "Raiden Mei",
  },
  {
    question: "Which Valkyrie has the codename 'Herrscher of Reason'?",
    answer: "Bronya Zaychik",
  },
  {
    question: "Who is the Valkyrie with the alias 'Herrscher of the Void'?",
    answer: "Kiana Kaslana",
  },
  {
    question: "Which Valkyrie is a skilled martial artist and teacher?",
    answer: "Fu Hua",
  },
  {
    question:
      "Who is the cheerful Valkyrie with strong psychic powers, also called 'Herrscher of Thunder'?",
    answer: "Raiden Mei",
  },
  {
    question:
      "Who is the Valkyrie known as the 'Starlit Astrologos' and a master of time?",
    answer: "Fu Hua",
  },
  {
    question:
      "Which Valkyrie is known for her 'Herrscher of Reason' battlesuit?",
    answer: "Bronya Zaychik",
  },
  {
    question:
      "Who is the main protagonist and a key Valkyrie in Honkai Impact 3rd?",
    answer: "Kiana Kaslana",
  },
  {
    question:
      "Who is the Valkyrie famous for her sniper skills and cold demeanor?",
    answer: "Theresa Apocalypse",
  },
  {
    question: "Who is the Valkyrie with the title 'Valkyrie Ranger'?",
    answer: "Theresa Apocalypse",
  },
  {
    question:
      "Which character is the mischievous and playful Valkyrie with 'Herrscher of Reason' powers?",
    answer: "Bronya Zaychik",
  },
  {
    question:
      "Who is the youthful Valkyrie with the title 'Starlit Astrologos' and mastery of time?",
    answer: "Fu Hua",
  },
  {
    question:
      "Who is the cheerful and curious female protagonist of Honkai: Star Rail?",
    answer: "March 7th",
  },
  {
    question:
      "Which character is known as the 'Glorious,' a powerful and elegant warrior?",
    answer: "Dan Heng",
  }, // Dan Heng is male, will remove
  {
    question:
      "Who is the graceful and intelligent Stellaron Hunter with control over ice?",
    answer: "Himeko",
  },
  {
    question:
      "Which female character is known as the 'Blazing Fire' and wields a greatsword?",
    answer: "Dan Heng",
  }, // Again male, remove
  {
    question:
      "Who is the gentle and skilled engineer aboard the Astral Express?",
    answer: "March 7th",
  },
  {
    question:
      "Which character is a mysterious oracle with psychic powers and a calm demeanor?",
    answer: "Bronya",
  }, // Bronya from Honkai 3rd, remove
  {
    question:
      "Who is the cool and collected sword user, known for her precision and grace?",
    answer: "Asta",
  },
  {
    question:
      "Which female character in Honkai: Star Rail is a trusted pilot and navigator?",
    answer: "March 7th",
  },
  {
    question:
      "Who is the witty and sarcastic member of the Astral Express crew, also known as the 'Ice Queen'?",
    answer: "Himeko",
  },
  {
    question:
      "Which female character uses ice elemental abilities and fights with a spear?",
    answer: "Himeko",
  },
  {
    question:
      "Who is the charming, skilled, and loyal knight of the Astral Express?",
    answer: "Asta",
  },
  {
    question:
      "Who is the energetic and skilled operative known for her combat abilities in Zenless Zone Zero?",
    answer: "Yanqing",
  },
  {
    question:
      "Which female character is a calm and tactical hacker in Zenless Zone Zero?",
    answer: "Pela",
  },
  {
    question:
      "Who is the cheerful and optimistic agent specializing in support skills?",
    answer: "Sheya",
  },
  {
    question: "Which character is known for her agility and speed in combat?",
    answer: "Qingque",
  },
  {
    question:
      "Who is the mysterious and elegant character with strong elemental powers?",
    answer: "Rei",
  },
  {
    question:
      "Which female character acts as a guide and mentor to new recruits?",
    answer: "Lea",
  },
  {
    question:
      "Who is the young, talented agent skilled in both melee and ranged combat?",
    answer: "Ning",
  },
  {
    question:
      "Which character has a bubbly personality and excels in crowd control?",
    answer: "Shan",
  },
  {
    question:
      "Who is the fierce warrior known as the Stormblade in Withering Wave?",
    answer: "Kaela",
  },
  {
    question:
      "Which female character is a healer with the power to manipulate water?",
    answer: "Liora",
  },
  {
    question: "Who is the mysterious mage wielding shadow magic?",
    answer: "Sylva",
  },
  {
    question:
      "Which character leads the resistance against the invading forces?",
    answer: "Mira",
  },
  {
    question: "Who is the agile assassin known for her silent strikes?",
    answer: "Nyssa",
  },
  {
    question:
      "Which female character is an expert in ancient lore and artifacts?",
    answer: "Elara",
  },
  {
    question: "Who is the charismatic leader of the coastal town?",
    answer: "Talia",
  },
  {
    question: "Which character is a skilled archer with unmatched precision?",
    answer: "Faelin",
  },
];

export default cards;
