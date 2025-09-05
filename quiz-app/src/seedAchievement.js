const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const achievements = [
  {
    id: 'first_quiz',
    name: 'First Quiz',
    description: 'Complete your first quiz',
    icon: 'firstQuiz.png',
    condition: { quizzesTaken: 1 }
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Solve quiz with 100% correct answers',
    icon: 'perfectScore.png',
    condition: { scoreEqualsTotal: true }
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Solve 50 quizzes',
    icon: 'fiftyquizzes.png',
    condition: { quizzesTaken: 50 }
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Create 5 own quizzes',
    icon: 'quiz_icon.png',
    condition: { createdQuizzies: 5 }
  },
  {
    id: 'weekly_player',
    name: 'Weekly Player',
    description: 'Play 7 days in a row',
    icon: 'sevenDays.png',
    condition: { streakDays: 7 }
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Play quiz from 5 different categories',
    icon: 'differentCategory.png',
    condition: { uniqueCategories: 5 }
  }
];

async function seedAchievements() {
  for (const a of achievements) {
    await db.collection('achievements').doc(a.id).set(a);
  }
  console.log("✅ Achievements collection created with all documents!");
  process.exit();
}

seedAchievements();
