# 🎯 QuizApp – Angular + Firebase

A modern single-page application for creating, solving, and tracking quizzes. Built with **Angular** and fully integrated with **Firebase**, this app demonstrates real-world SPA architecture, cloud-based backend, and user authentication.

---

## 🧩 Features

- 🔐 **Authentication**  
  - User registration and login using **Firebase Auth**
  
- 📝 **Quiz Functionality**  
  - Dynamic loading of quizzes from **Firestore**
  - Multiple-choice questions
  - Real-time scoring
  - Timer per quiz (optional)
  - Result summary at the end

- 👤 **User Dashboard (for logged-in users)**  
  - View solved quizzes
  - Track results and scores

- 🌐 **Guest Mode (for unregistered users)**  
  - Solve available quizzes without saving results
  - View public quizzes

- ⚙️ **Admin Mode (optional if implemented)**  
  - Add / edit / delete quizzes
  - Manage questions and options

- ☁️ **Firebase Integration**  
  - Firebase Authentication (login, register, logout)
  - Firestore Database (quizzes, questions, results)
  - Firebase Hosting for live deployment
  - Environment-based config (secure)

---

## 📦 Technologies

- [Angular 20](https://angular.dev/)
- [Firebase](https://firebase.google.com/)
- [AngularFire](https://github.com/angular/angularfire)
- [Angular Material](https://material.angular.io/)
- TypeScript, RxJS

---

## ▶️ Getting Started

Follow these steps to clone the project, install dependencies, run it locally:

### 1. Clone the repo and install dependencies

First, clone the repository to your local machine and install the required packages:

```bash
git clone https://github.com/your-username/quiz-app-angular.git
cd quiz-app-angular
``` 

### 2. Install the required packages
```bash 
npm install
npm install firebase @angular/fire
npm install @angular/material @angular/cdk @angular/animations
npm install @angular/material-icons
```
### 3. Run the development server

```bash
ng serve
```

### 4. Live Demo
You can see the live version of the app here: https://quiz-app-3471b.web.app/