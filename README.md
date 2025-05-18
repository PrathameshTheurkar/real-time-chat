# Real-Time Chat Application 🚀  

A real-time chat web application that allows users to join chat rooms, send messages, upvote messages, and dynamically prioritize important conversations based on upvotes.  

## 🌟 Features  

- ✅ Users can join a chat room and send messages in real-time  
- ✅ Upvote chat messages to highlight important discussions  
- ✅ Medium priority section for messages with more than **10 upvotes**  
- ✅ High priority section for messages with more than **15 upvotes**  
- ✅ Admin alerts triggered for high-priority messages

## 🛠️ Tech Stack
- 💻 **Frontend:** [React.js](https://reactjs.org/) (TypeScript)
- 🌐 **Backend:** [Node.js](https://nodejs.org/) with TypeScript
- 🔗 **Real-time Communication:** [WebSocket](https://www.npmjs.com/package/websocket)

  ---

## 🧑‍💻 How to Run the Project

### 🔧 Option 1: Run Without Docker

Make sure you have **Node.js (v18 or higher)** installed on your machine.

<details>
<summary><strong>Frontend</strong></summary>

1. Open a terminal and navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. The frontend will start on [http://localhost:5173](http://localhost:5173)
</details>

<details>
<summary><strong>Backend</strong></summary>

1. Open a new terminal and navigate to the `server` folder:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm run dev
   ```

4. The backend will start on [http://localhost:3000](http://localhost:3000)
</details>

---

### 🐳 Option 2: Run With Docker (Recommended)

Make sure you have **Docker** and **Docker Compose** installed.

1. In the root of the project (where `docker-compose.yaml` is located), build and start the containers:

   ```bash
   docker-compose up --build
   ```

2. Access the app:

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)

---


  ## Chat page:

  ![image](https://github.com/user-attachments/assets/6c8b0e17-87b5-4b04-b65f-2939c6c19661)
