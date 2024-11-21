
# Blog Platform

This is a blog platform with a frontend and backend. The backend has been deployed to Render, and the frontend is in development. The frontend communicates with the backend via API endpoints for handling blog posts.

Backend URL (deployed): https://blognextnode.onrender.com
Frontend: Currently in development, not deployed.



## How to run

To run this project follow these steps:

1. Clone the Repository

```bash
  git clone https://github.com/Blaster1111/BlogNextNode.git
  cd blog
```

2. Install Backend Dependencies

```bash
  cd backend
  npm install
``` 

## Environment Variables (Backend)

To run this project, you will need to create .env file in /backend folder

`MONGO_DB_URI = mongodb+srv://dhairudu0711:ixicvOynrBxtegrJ@cluster0.olmdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

`JWT_SECRET_KEY = qpwoeiruty`

## Environment Variables (Frontend)

To run this project, you will need to creater .env file in /frontend

`JWT_SECRET = qpwoeiruty`

`NEXT_PUBLIC_API_BASE_URL = https://blognextnode.onrender.com/api` (Set this to localhost:5000/api if in case deployed site is down)



3. Run the Backend

```bash
  npm run dev
``` 

4. Frontend Setup

```bash
  cd ..
  cd frontend
  npm install
  npm run dev
``` 
Now the frontend will start working on localhost:3000 you can open that on browser and see.

## Video Demo
A working demo video of the project is available in the working_demo folder within the repository. This video demonstrates the project in action, showcasing both the frontend and backend functionality.

`https://github.com/Blaster1111/BlogNextNode/tree/main/wroking_demo`

