const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


const achievements = [
  {
    id: 'first_quiz',
    condition: (user) => (user.quizStats?.quizzesTaken || 0) >= 1
  },
  {
    id: 'perfect_score',
    condition: (user) => user.recentQuizzes?.some(q => q.score === q.total)
  },
  {
    id: 'quiz_master',
    condition: (user) => (user.quizStats?.quizzesTaken || 0) >= 50
  },
  {
    id: 'creator',
    condition: (user) => (user.createdQuizzies?.length || 0) >= 5
  },
  {
    id: 'weekly_player',
    condition: (user) => (user.quizStats?.streakDays || 0) >= 7
  },
  {
    id: 'explorer',
    condition: (user) => (user.quizStats?.uniqueCategories || 0) >= 5
  }
];

async function fixAchievements() {
  const usersSnapshot = await db.collection('users').get();

  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data();
    const userRef = db.collection('users').doc(userDoc.id);


    const unlocked = achievements
      .filter(a => a.condition(userData))
      .map(a => ({ id: a.id, unlockedAt: new Date().toISOString() }));

  
    await userRef.set({ achievements: unlocked }, { merge: true });
    console.log(`✅ Corrected achievements for user ${userDoc.id}`);
  }

  console.log("✅ All users updated with correct achievements!");
  process.exit();
}

fixAchievements();
