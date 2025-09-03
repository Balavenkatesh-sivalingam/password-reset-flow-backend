# Password Reset Flow Backend

This is the backend server for the **Password Reset Flow** project, built using **Node.js**, **Express.js**, and **MongoDB**. It implements a secure password reset flow with email verification for a web application.

## Task Overview

The project implements a complete password reset flow with the following steps:

1. User enters their email on the "Forgot Password" page.
2. Backend checks if the user exists in the database.
3. If the user does not exist, an error message is returned.
4. If the user exists:
   - A random string (token) is generated.
   - The token is stored in the database.
   - A password reset link containing the token is sent to the user via email.
5. When the user clicks the link:
   - The token is verified against the database.
   - If valid, the user is shown the password reset form.
   - If invalid or expired, an error message is shown.
6. The user submits the new password.
7. The password is hashed and stored in the database, and the token is cleared.

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication & Security:** bcrypt, JWT  
- **Email Service:** Nodemailer  
- **Environment Management:** dotenv  

## Features

- Secure password reset with email verification
- Random token generation with expiry
- Password hashing with bcrypt
- RESTful API endpoints
- Error handling for invalid or expired tokens
- Clean and well-commented code
