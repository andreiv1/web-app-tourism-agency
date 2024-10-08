# Tourism Agency Web App

This project is a full-stack web application that provides a seamless experience for users to explore, join, and manage trips. It consists of two main components: the **frontend** and the **backend**.

## Frontend

The frontend is developed using **Vue 3**, offering a dynamic, responsive user interface. Users can browse available trips, view detailed destination information, manage bookings, and interact with their profiles. Key features include:

- **User Authentication**: Supports user login and registration.
- **User-friendly Design**: Features intuitive search and filter options for exploring trips.

![Trip browsing screenshot](/docs/1.png)

![Trip details screenshot](/docs/2.png)

![More trip screenshots](/docs/22.png)

- **Dynamic Components**: Manage user-specific trips, favorites, and upcoming trips.

![User trips screenshot](/docs/3.png)

- **Admin Features**: Admins can add, edit, or delete trips.

![Admin add/edit trips](/docs/4.png)

![Admin trip deletion](/docs/5.png)

![Trip management screenshots](/docs/6.png)

## Backend

The backend leverages **Firebase** services for data storage, user authentication, and real-time updates. It’s built using **Node.js** and integrates with **Firebase Firestore** for data persistence. The backend provides secure APIs to manage user information and trips. Key features include:

- **User Management**: Handles user registration, login, and profile updates.
- **Trip Management**: Allows for adding, updating, and deleting trips, along with participant tracking.
- **Authentication**: Uses secure token-based authentication and hashed passwords.
- **Media Storage**: Supports media uploads, such as trip images, through Firebase Storage integration.

