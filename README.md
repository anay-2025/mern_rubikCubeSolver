MERN Rubik Cube Solver

A full-stack MERN application that allows users to manually input the state of a scrambled 3×3×3 Rubik’s Cube and generates the sequence of moves required to solve it.
The application also includes user authentication and stores user data securely in a database.

Features
Manual Rubik’s Cube state input
Solves a 3×3×3 Rubik’s Cube
Generates step-by-step solving moves
User authentication system
Stores users in MongoDB
Responsive frontend UI
MERN stack architecture
Tech Stack
Frontend
React.js
Tailwind CSS
Backend
Node.js
Express.js
Database
MongoDB
How It Works
User registers/login into the application.
User manually enters the colors/state of the scrambled Rubik’s Cube.
Backend solver processes the cube state.
The application prints the sequence of moves required to solve the cube.
User information is stored securely in MongoDB.
Installation
Clone the repository
git clone <your-repo-link>
cd rubik-cube-solver
Install frontend dependencies
cd client
npm install
Install backend dependencies
cd ../server
npm install
Environment Variables

Create a .env file inside the server directory:

MONGO_URI=your_mongodb_connection
PORT=5000
JWT_SECRET=your_secret_key
Run the Application
Start backend
cd server
npm start
Start frontend
cd client
npm run dev
Future Improvements
3D Rubik’s Cube visualization
Drag-and-drop cube input
Cube solving animation
Solve history tracking
Google authentication
Speed optimization
