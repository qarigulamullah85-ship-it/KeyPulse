import { Lesson } from './types';

// Key sequences (Lessons 1-25 approx)
const earlyLessons = [
  { title: "Introduction", content: "f j f j f j f j f j f j f j f j f j f j f j" },
  { title: "Keys f & j", content: "ffff jjjj ff jj fff jjj fj fj jjf ffj fff jjj" },
  { title: "Space Bar", content: "f j f j f f j j f f j j f j f j f f j j f f" },
  { title: "Review: f & j", content: "fj jf fj jf fjj fjj jff jff f j j f f j j" },
  { title: "Keys d & k", content: "d k d k d k d k d k d k d k d k d k d k d k" },
  { title: "Review: d & k", content: "dd kk dd kk ddd kkk dk dk kkd ddk ddd kkk ddk" },
  { title: "Practice: d & k", content: "f d j k f d j k fd jk df kj fdf jkj dfd kjk fjd" },
  { title: "Play: fjkd", content: "fjdk kdjf dfjk kjfd fjdk kdjf dfjk kjfd fjdk", gameType: "falling-words" },
  { title: "Keys s & l", content: "s l s l s l s l s l s l s l s l s l s l s l" },
  { title: "Review: s & l", content: "ss ll ss ll sss lll sl sl lls ssl sss lll ssl" },
  { title: "Practice: s & l", content: "f d s j k l fd sl jk jl sf lj fds jkl lkj sdf" },
  { title: "Keys a & ;", content: "a ; a ; a ; a ; aa ;; aa ;; a; ;a ;a a; a ;" },
  { title: "Review: a & ;", content: "a s d f j k l ; as df jk l; fd sa kl ;j asdf" },
  { title: "First 8 Keys", content: "asdf jkl; asdf jkl; fdsa ;lkj asdf jkl; fdsa" },
  { title: "Play: First 8 Keys", content: "a s d f j k l ; a s d f j k l ;", gameType: "balloon" },
  { title: "Keys e & i", content: "e i e i ee ii ei ie de ki fe ji se li ae ;i" },
  { title: "Keys r & u", content: "r u r u rr uu ru ur fr ju dr ku sr lu ar ;u" },
  { title: "Keys t & y", content: "t y t y tt yy ty yt ft jy dt ky st ly at ;y" },
  { title: "Keys g & h", content: "g h g h gg hh gh hg fg jh dg kh sg lh ag ;h" },
  { title: "Review Top & Home", content: "qwerty ytrewq asdfgh jkl; qwert yuiop asdfg hjkl;" },
  { title: "Keys c & ,", content: "c , c , cc ,, c, ,c dc k, fc j, sc l, ac ;," },
  { title: "Keys v & m", content: "v m v m vv mm vm mv fv jm dv km sv lm av ;m" },
  { title: "Keys b & n", content: "b n b n bb nn bn nb fb jn db kn sb ln ab ;n" },
  { title: "Keys z & x", content: "z x z x zz xx zx xz az sx dz fx as zx df cx" },
  { title: "All Letters", content: "the quick brown fox jumps over the lazy dog" },
  { title: "Typing Bomb Game", content: "explode blast boom fire fast typing speed danger blast warning hurry", gameType: "bomb" },
  { title: "Kids Typing Game", content: "cat dog cow pig fox bat ant bug bee fly sun moon star tree leaf", gameType: "kids" },
  { title: "Typing Puzzle Game", content: "puzzle secret enigma riddle mystery unlock decode unscramble magic hidden", gameType: "puzzle" }
];

// Most common English words for practice
export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const trickyWords = [
  "rhythm", "bureaucracy", "miscellaneous", "entrepreneur", "conscientious", 
  "accommodation", "definitely", "embarrass", "fluorescent", "liaison", 
  "maneuver", "occasionally", "occurrence", "parallel", "pronunciation", 
  "queue", "restaurant", "separate", "supersede", "threshold", "vacuum", 
  "whether", "xylophone", "yacht", "zephyr", "juxtaposition", "ubiquitous", 
  "necessary", "excellent", "fascinating", "guarantee", "knowledge", 
  "maintenance", "privilege", "recommend", "business", "committee", "familiar"
];

const shortSentences = [
  "She walked to the park.", "It is a beautiful day.", "He loves to read books.", 
  "The cat sat on the mat.", "I am learning to type.", "Water is good for you.",
  "Always do your best.", "Practice makes perfect.", "Keep up the good work.",
  "Never give up on dreams.", "Take a deep breath.", "Time flies so fast.",
  "Enjoy the little things.", "Look at the bright side.", "Music makes me happy."
];

const mediumSentences = [
  "Typing fast requires muscle memory, patience, and consistent practice.",
  "Do not look at the keyboard while you are typing, keep your eyes on the screen.",
  "If you want to be a professional typist, focus on accuracy first, then speed.",
  "Every great journey begins with a single step, or in this case, a single keystroke.",
  "The quick brown fox jumps over the lazy dog, testing every single letter.",
  "In the modern digital age, fast typing is an essential communication skill.",
  "Technology evolves rapidly, but the QWERTY keyboard layout has remained constant.",
  "Programming, writing, and emailing all depend heavily on your keyboard skills."
];

const paragraphs = [
  "In the world of professional typing, accuracy is just as important as speed. It is better to type slowly and accurately than fast and with many errors. Over time, your speed will naturally increase as your muscle memory improves.",
  "To become truly proficient, you must train your fingers to recognize patterns rather than individual letters. Common suffixes like -tion, -ing, and -ment should flow from your fingers in a single, fluid motion without conscious thought.",
  "Many people underestimate the physical toll that typing can take on your hands and wrists. Proper ergonomics are crucial. Keep your wrists hovering slightly above the desk, your back straight, and your monitor at eye level.",
  "As you progress through these advanced lessons, you will encounter complex punctuation, numbers, and capitalization. Do not let these slow you down. Approach them with the same relaxed confidence you apply to basic lowercase words.",
  "A true master typist feels the rhythm of the words. It is not a frantic rush to the end of the sentence, but a smooth, steady flow of keystrokes. Breathe, relax your shoulders, and let your fingers dance across the keys."
];

const getRandom = (arr: string[], count: number) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return result.join(' ');
};

export const COURSES: Lesson[] = Array.from({ length: 685 }, (_, i) => {
  const id = i + 1;
  let title = `Lesson ${id}`;
  let content = "";
  let gameType: 'falling-words' | 'balloon' | undefined = undefined;

  // Determine if it's a game (every 7 lessons)
  const isGame = id % 7 === 0;
  if (isGame) {
    // Alternate game types based on the game number
    const gameNumber = id / 7;
    gameType = gameNumber % 2 === 0 ? 'balloon' : 'falling-words';
  }

  // 1-25: Early key sequences
  if (id <= earlyLessons.length) {
    const early = earlyLessons[i];
    title = early.title;
    content = early.content;
    // Strictly use early.gameType, overriding any math-based gameType
    gameType = (early as any).gameType || undefined;
    
    // If it's a game in the early lessons, make the content longer for more practice
    if (gameType) {
      content = Array(4).fill(early.content).join(' ');
    }
  }
  // 26-100: Common words building up
  else if (id <= 100) {
    const wordCount = 10 + Math.floor((id - 25) * 0.4); // Increases gradually up to ~40 words
    title = isGame ? (gameType === 'balloon' ? `Balloon Pop ${id}` : `Word Drop ${id}`) : `Common Words ${id}`;
    
    // Mix in some tricky words progressively
    const pool = id < 50 ? commonWords : [...commonWords, ...commonWords, ...trickyWords];
    content = getRandom(pool, wordCount);
  }
  // 101-250: Sentences and punctuation
  else if (id <= 250) {
    title = isGame ? (gameType === 'balloon' ? `Balloon Pop ${id}` : `Sentence Drop ${id}`) : `Sentence Builder ${id}`;
    
    const count = 3 + Math.floor((id - 100) / 30); // 3 to 8 sentences
    const pool = id < 150 ? shortSentences : [...shortSentences, ...mediumSentences];
    
    let text = getRandom(pool, count);
    if (isGame) {
      // Game doesn't do spaces well if it's full sentences, so we split them to words
      text = text.replace(/[\.\,]/g, '');
    }
    content = text;
  }
  // 251-400: Full paragraphs & flow
  else if (id <= 400) {
    title = isGame ? (gameType === 'balloon' ? `Balloon Pop ${id}` : `Vocab Drop ${id}`) : `Paragraph Flow ${id}`;
    
    if (isGame) {
      content = getRandom(trickyWords, 25);
    } else {
      const pCount = 1 + Math.floor((id - 250) / 100); // 1 or 2 paragraphs
      const sentencesCount = 2 + Math.floor((id - 250) / 50);
      const paras = [];
      for (let p = 0; p < pCount; p++) {
        paras.push(getRandom(mediumSentences, sentencesCount));
      }
      content = paras.join(' ');
      // Every 5th lesson, throw in a real predefined paragraph
      if (id % 5 === 0 && !isGame) {
        content = paragraphs[Math.floor(Math.random() * paragraphs.length)];
      }
    }
  }
  // 401-685: Professional Typist Regimen
  else {
    title = isGame ? (gameType === 'balloon' ? `Pro Balloon ${id}` : `Pro Drop ${id}`) : `Pro Typist ${id}`;
    
    if (isGame) {
      content = getRandom([...trickyWords, ...commonWords], 30);
    } else {
      const isPara = Math.random() > 0.5;
      if (isPara) {
        // Build a robust paragraph
        const p1 = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        const sentences = getRandom(mediumSentences, 3);
        content = p1 + " " + sentences;
      } else {
        // High density words
        content = getRandom([...trickyWords, ...trickyWords, ...commonWords], 40);
      }
    }
  }

  // Fallback cleanup
  content = content.replace(/\s+/g, ' ').trim();

  return {
    id,
    title,
    description: 'Typing practice module.',
    content,
    difficulty: id < 50 ? 'easy' : id < 250 ? 'medium' : 'hard',
    type: 'course',
    gameType
  };
});

export const loadProgress = () => {
  const saved = localStorage.getItem('typingAcademy_progress_v2');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // return default
    }
  }
  return null;
};

export const saveProgress = (progress: any) => {
  localStorage.setItem('typingAcademy_progress_v2', JSON.stringify(progress));
};
