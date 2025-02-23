# 📚 Flashcard App

## 🚀 Overview

The **Flashcard App** is a web-based application that allows users to generate and study flashcards for various exams and topics. The app integrates Firebase Authentication for user login and uses OpenAI to dynamically generate flashcards.

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS
- **Backend:** Firebase Functions, OpenAI GPT-4o-mini
- **Authentication:** Firebase Authentication (Email/Password & Google Sign-In)
- **Database:** Firestore (for storing user progress and flashcards)

## 📦 Features

- 🔐 **User Authentication** (Google & Email/Password Login)
- 🌙 **Light/Dark Mode Toggle**
- 🎴 **AI-Generated Flashcards**
- 📊 **User Progress Tracking** (Upcoming)
- ✅ **Multiple-Choice Question System**
- 🚪 **Logout Functionality**

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

```sh
  git clone https://github.com/genegaudenzi/flashcard.git
  cd flashcard/frontend
```

### 2️⃣ Install Dependencies

```sh
  npm install
```

### 3️⃣ Set Up Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Google & Email/Password sign-in)
3. Enable **Firestore Database**
4. Create a **.env** file in the `frontend` directory and add:

```sh
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
```

### 4️⃣ Start the Development Server

```sh
  npm start
```

The app will now be running at `http://localhost:3000`

## 🔧 Usage

1. **Sign up** or **Log in** using Google or Email/Password.
2. Select an **Exam** from the dropdown.
3. Choose a **Domain** and **Concentration Area**.
4. Click **"Generate Flashcard"** to receive an AI-generated question.
5. Select an answer and submit!

## 🤝 Contributing

Want to contribute? Feel free to **fork** this repository and submit a **pull request** with improvements!

## 📄 License

This project is licensed under the **MIT License**.

## 📫 Contact

For any inquiries or feedback, contact **Gene Gaudenzi** via GitHub Issues or Email.

---

