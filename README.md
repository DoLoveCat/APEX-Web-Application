# APEX-Web-Application

<p align="center">
  <img src="frontend-react/picture/apex_logo.png" alt="APEX project screenshot" width="50%">
</p>

- A web app that tailors UCR course recommendations to your career objectives.
- AI-powered career navigation app for UCR students
- Enter a dream job, get recommended UCR courses and skills to get there, along with a network of relevant people.


## Which tools are used
- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose ODM
- Authentication: bcrypt for password hashing, JSON Web Tokens (JWT)
- Dev Tools: VS Code, Live Server extension, Thunder Client

## Steps on how to run/ deploy code
1. Clone the repo
2. cd into backend folder
3. Run npm install
4. Create a .env file with: PORT, MONGO_URI (your Atlas connection string), JWT_SECRET
5. Run node server.js (or npm start if you have that script)
6. Open the frontend HTML files with Live Server
7. Backend runs on localhost:5000 (or whatever port), frontend on Live Server's port

 

## Some Page Layouts 

![APEX prject screenshot](frontend/picture/readme_show.png)

Finish the sort logic in the course page
![course scrrenshot](frontend/picture/course.png)
