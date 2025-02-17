<img width="1377" alt="Screen Shot 2022-06-29 at 3 58 46 PM" src="https://user-images.githubusercontent.com/91788124/176442446-9d0a7fb0-1c75-44e3-8a75-9e2f552d9294.png">
 
# About the project
This is a final project of Technigo's boot camp spring '22. We wanted to build a pet app to connect pet owner and pet sitters. The app was created by using React, Redux, Style Components for front-end and Node.js, MongoDb, Express.js for back-end.

# Collaborators:
The project was made by Kristiina Kolu and Suki Nhung Phan.

# View it live
https://sk-petapp.netlify.app

Please feel free to use our dummy account to log in and view the insight. 
- Username: testi
- Password: password

# Features
- User can sign up by filling in the ready form including profile type, username, password, email, image link, pet type, duration of pet sitting, start and end date, location and profile description
- User can log in with their username and password, and the localstorage helps to save the logged-in, despite the page is refreshed
- After logged in, user can see other users on the landing page (= dashboard); the app displays only pet owners to pet sitters and other way around). Every displayed user container is a link to the page showing details of each users
 User can add, edit and delete reviews to the others on the detail pages
- User can edit profile information on the profile page
- User can save their favourite items and view them in favourite page
- User can search for the other users by using the search bar
- User can filter their search with the filter menus
- User can log out

# Process
It tooks us 3 weeks to complete. Our proccess:
 1. Setting up the ideas on white board
 2. Building the prototype in Figma
 3. Bulding the back-end
 4. Developing the front-end
 5. Review and final touch

# View our idea template
https://trusting-opera-034.notion.site/Final-Project-Pitch-Template-cb12ef83e6c34b34b42d1a25d5477f5d
 
# View our Figma 
https://www.figma.com/file/udN4vOr8waFfFW3sQvO2BX/Final-project-Suki-%2F-Kristiina?node-id=0%3A1

# How to run it
1. Clone the project to your local environment:

git clone https://github.com/kolkri/final-project.git

2. Move to the frontend folder:

cd frontend

3. Install all the dependencies:

npm install

4. Run the project on your local server:

npm start



# How will we improve if we could have more time
- Our stretch goal was to build a chatbot to help the users communicate with each others. We have already set up the basic back-end. The idea is to use the PATCH method to update the text message and store them in an array. Later on, in front-end, we will filter the message by using userID and display them based on the time when the message is sent. 

- Putting more time to the responsive desing and the styling

- Adding possibility to upload a profile picture (now we are just asking a link to the picture). We managed to convert the uploaded images to base64 format and display them on the logged in page. However, after delpoying the heroku link the app ran very slowly, we think that this was maybe because of the large size of images. After running out of time, we decided to stay just with the image link. 

- We could also combine and simplify our styled components, because we are using the same styling in several pages. 
 
 
