 TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot of /register page "](https://github.com/Delnir1908/tinyapp/blob/main/docs/1.%20register.png)
!["screenshot of /login page"](https://github.com/Delnir1908/tinyapp/blob/main/docs/2.%20login.png)
!["screenshot of /urls page"](https://github.com/Delnir1908/tinyapp/blob/main/docs/3.%20urls.png)
!["screenshot of /urls/new page"](https://github.com/Delnir1908/tinyapp/blob/main/docs/4.%20create%20new%20url.png)
!["screenshot of /urls/:id page"](https://github.com/Delnir1908/tinyapp/blob/main/docs/5.%20edit%20existing%20url.png)


## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
Instruction

## Basic Functions
- register account to use this service with email and password
- login to use the service if already have an account
- click 'My URLs' on top left to show a list created with current account
- click 'Create New URL' to create new short url
- on 'My URLs' page:
  * click 'Edit' to edit the destination url of each unique ID 
  * click 'Delete' to delete unwanted unique ID
- on 'Create New URL' page, type in a destination http url to create a short unique ID
- on the top left, it shows the email of the current user and a logout button to exit the service