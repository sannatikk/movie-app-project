# Movie Hobbyist App 🎥

 A full-stack web application for movie enthusiasts to explore movies, manage favorites, read and write reviews, create social groups, and browse theater showtimes.  
 
 This app was created for the 15 ECTS Web Application Project course for Oulu University of Applied Sciences 2nd year students specializing in Software Development. 

 ## Table of Contents  
1. [Introduction](#movie-hobbyist-app-🎥)  
2. [Setup 🛠️](#setup-🛠️)  
   - [Prerequisites](#prerequisites)  
   - [Steps](#steps)  
3. [Features](#features)   
5. [Testing](#testing)  
6. [Contributing](#contributing)  
7. [License](#license)   

## Setup 🛠️

### Prerequisites

Before you begin, ensure you have the following installed: 
- Node.js (version 16 or higher recommended)
- npm (comes with Node.js)
- PostgreSQL with a blank development database **and** a blank test database created

### Steps

1. **Clone repository to your local machine using Git**  
`git clone <repository-url>`  
`cd <repository-name>`  

2. **Set up the Backend**  
- Navigate to the backend folder and install dependencies:  
`cd backend`  
`npm install`  
- Create an .env file in the backend folder:  
`touch .env`  
- Update the .env file with values stated in the .env_example file found in the backend folder.  
- Initialize the PostgreSQL database by running the script provided in the /backend/movieapp_db.sql file.  

3. **Set up the Frontend**  
- Navigate to frontend folder and install dependencies:  
`cd ../src`  
`npm install`
- Create an .env file in the root folder:  
`cd ..`  
`touch .env`  
- Update the .env file with values stated in the .env_example file found in the root folder.  

4. **Run the App in Development Mode**
- Start the backend server in Dev Mode:  
`cd ../backend`  
`npm run devStart`
- Start the app:  
`cd ../`  
`npm start`    

## Features  
- Explore movies by title, genre, language, or year.  
- View detailed information for movies, including navigating between movies in a series.  
- Save movies to personal favorites or share them with groups.  
- Read, write, and manage reviews.  
- Browse and filter Finnkino showtimes by location and date.  
- Create or join social groups and plan your next movie theater outing.  
- Secure routes for member profiles, public personalized favorites pages for sharing to non-members.  
- RESTful APIs to support seamless integration.
- Scalable design for tablets & mobile, light/dark theme toggler.  

## Testing 

Automated testing is implemented in file /backend/tests/ReviewController.test.js for creating and deleting an account, and logging in, in file /backend/tests/ReviewController.test.js for browsing reviews, and in file /src/tests/NavigationBar.test.js for logging out.
 
**Important**: Before starting the backend in test mode, ensure the backend server running in development mode is shut down. You can stop it by pressing Ctrl + C in the terminal where the development server is running.  

**Run the App in Test Mode** 
- Start the backend server in Test Mode:  
`cd backend`  
`npm run testStart`
- Run backend tests:  
`npm run test`
- Run frontend tests:  
`cd ../src`  
`npm test`

## Contributors 🤝  
This project was built collaboratively by a team of four students: [Niemistoo](http:s//github.com/Niemistoo), [mipu1](https://github.com/mipu1), [sannatikk](https://github.com/sannatikk), and [Haarmes](https://github.com/Haarmes).

## License 📜  
This project is a student collaboration and is not intended for distribution.  