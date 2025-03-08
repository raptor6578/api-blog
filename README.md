# API Blog

Welcome to **API Blog**, a RESTful API designed to handle authentication, article management, comments, and likes. This API is built using **Node.js**, **Express**, and **MongoDB**, and follows a clean and modular **MVC architecture**.

## 🚀 Features
- **User Authentication**: Secure sign-up and sign-in with JWT authentication.
- **Article Management**: Create, update, delete, and retrieve articles.
- **Comment System**: Add, update, and delete comments on articles.
- **Like System**: Upvote/downvote articles and comments.
- **Middleware Support**: Includes error handling, input sanitization, and security enhancements.
- **Scalable Architecture**: Designed with modular controllers, services, and repositories.
- **Transaction**: Uses a transaction system to secure cascading requests.

## 🏗️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi for input validation
- **Error Handling**: Express Async Errors Middleware

---

## 📦 Installation

### 1️⃣ Clone the repository
```bash
 git clone https://github.com/raptor6578/api-blog.git
 cd api-blog
```

### 2️⃣ Install dependencies
```bash
 npm install
```

### 3️⃣ Configure environment variables
Create a `./src/config/development.config.json` and `./src/config/prroduction.config.json` file and add the following:
```json
{
  "allowOrigin": "*",
  "jwt": {
    "secret": "maclesecrete",
    "expiresIn": "1y"
  },
  "expressPort": 8888,
  "mongo": {
    "host": "hostname",
    "port": 27017,
    "login": "username",
    "password": "password",
    "db": "database"
  },
  "facebook": {
    "clientId": "",
    "clientSecret": "",
    "callbackUrl": ""
  },
  "google": {
    "clientId": "",
    "clientSecret": "",
    "callbackUrl": ""
  },
  "passportRedirectFront": ""
}
```

### 4️⃣ Start the server
```bash
 npm run start
```
The API will be available at: `http://localhost:8888`

---

## 📖 API Documentation
### 🔐 Authentication
#### Register a new user
```http
POST /api/auth/signup
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### User login
```http
POST /api/auth/signin
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### 📝 Articles
#### Get all articles
```http
GET /api/articles
```

#### Create a new article
```http
POST /api/articles
```
**Request Body:**
```json
{
  "title": "My First Article",
  "content": "This is the content of the article."
}
```

### 💬 Comments
#### Add a comment to an article
```http
POST /api/comments
```
**Request Body:**
```json
{
  "targetId": "id",
  "contentType": "Article",
  "content": "This is a comment."
}
```

### 👍 Likes
#### Like an article or comment
```http
POST /api/likes
```
**Request Body:**
```json
{
  "targetId": "articleIdOrCommentId",
  "contentType": "Article or Comment",
  "value": 1
}
```

---

## 🏛️ Project Architecture
```bash
src/
├── controllers/     # Handles API requests
├── services/        # Business logic layer
├── repositories/    # Database interactions
├── middlewares/     # Middleware functions (auth, validation, errors...)
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── config/         # Configuration settings
├── loaders/        # Express app loaders
└── server.ts       # Main entry point
```

---

## 🛠️ Development & Contribution
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit your changes: `git commit -m "Added new feature"`.
4. Push the branch: `git push origin feature-branch`.
5. Open a pull request.

---

## 📜 License
This project is licensed under the **MIT License**.

