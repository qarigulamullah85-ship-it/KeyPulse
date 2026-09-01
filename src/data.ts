import { Lesson } from './types';

const homeRowTitles = [
  "Introduction to Typing", "Keys f & j", "Space Bar", "Review: f & j", 
  "Keys d & k", "Review: d & k", "Practice: d & k", "Play: fjkd", 
  "Keys s & l", "Review: s & l", "Practice: s & l", "Keys a & ;", 
  "Review: a & ;", "First 8 Keys", "Play: First 8 Keys", "Home, Sweet Home!", 
  "Home Row: L Hand", "Home Row: R Hand", "Keys g & h", "Review: g & h",
  "Practice: g & h", "Home Row Review", "Play Home Row"
];

const rocketTitles = [
  "Hairdresser", "Electoral College", "Butterflies", "Research Source",
  "African Languages", "The Andes", "Types of Exercises", "Inner Planets",
  "Information", "Chuseok", "China", "Falkland Islands",
  "Clouds", "The Koreas", "Web Developer", "Ernest Hemingway",
  "Tree Rings", "Mariana Trench", "Dynamic Practice", "Congratulations!",
  "Final Lesson"
];

const lessonContents = [
  "f j f j f j f j f j f j f j f j f j f j f j f j f j", // 1
  "ffff jjjj ff jj fff jjj fj fj jjf ffj fff jjj ffj jjf fjfj fffj jjjf ffjj ff jj ffff", // 2
  "f j f j f f j j f f j j f j f j f f j j f f j j f j f j", // 3
  "fj jf fj jf fjj fjj jff jff f j j f f j j f fj jf fj jf", // 4
  "d k d k d k d k d k d k d k d k d k d k d k d k d k d k", // 5
  "dd kk dd kk ddd kkk dk dk kkd ddk ddd kkk ddk kkd dkdk dddk kkkd ddkk dd kk dddd", // 6
  "f d j k f d j k fd jk df kj fdf jkj dfd kjk fjd kdk fjd kdk fjd kdk", // 7
  "fjdk fjdk kdjf kdjf dfjk dfjk kjfd kjfd fjdk kdjf dfjk kjfd fjdk", // 8
  "s l s l s l s l s l s l s l s l s l s l s l s l s l", // 9
  "ss ll ss ll sss lll sl sl lls ssl sss lll ssl lls slsl sssl llls ssll ss ll ssss", // 10
  "f d s j k l fd sl jk jl sf lj fds jkl lkj sdf fdsl jksl fds jkl" // 11
];

export const COURSES: Lesson[] = Array.from({ length: 685 }, (_, i) => {
  const id = i + 1;
  let title = `Lesson ${id}`;
  let content = "ff jj dd kk ss ll aa ;; gg hh";
  
  if (id <= homeRowTitles.length) {
    title = homeRowTitles[i];
  } else if (id > 685 - rocketTitles.length) {
    title = rocketTitles[i - (685 - rocketTitles.length)];
    content = "the quick brown fox jumps over the lazy dog in space.";
  } else {
    title = `Practice Module ${id}`;
  }

  // Use realistic lesson content for the first few modules
  if (i < lessonContents.length) {
    content = lessonContents[i];
  }

  return {
    id,
    title,
    description: 'Typing practice module.',
    content,
    difficulty: id < 50 ? 'easy' : id < 300 ? 'medium' : 'hard',
    type: 'course',
    gameType: (id === 8 || id === 15 || id === 23) ? 'falling-words' : undefined
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
