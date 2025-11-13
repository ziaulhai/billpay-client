🚀 BillPay: Utility Bill Management Platform
BillPay is a comprehensive full-stack web application designed to streamline the management and payment of utility bills. It offers users a centralized system to browse available services, view detailed bill information, and efficiently handle their personal payment records.

💻 Technology Stack
This project is built using a modern MERN-adjacent stack, leveraging key technologies for both the frontend and backend.

Frontend Technologies (Client)
The frontend is built primarily with React for building the user interface and managing component state. React Router DOM is crucial for handling efficient client-side navigation, managing dynamic routes (like /bills/:id), and utilizing loader functions to pre-fetch data, ensuring a snappy user experience.

For styling, the project uses Tailwind CSS and DaisyUI, which provides utility-first CSS and ready-made UI components. DaisyUI is specifically used for implementing the theme toggling feature (light/dark mode) by managing the data-theme attribute on the HTML document. API requests are handled using Axios, often encapsulated within a custom useAxios hook for clean, reusable code. User feedback is managed through non-blocking notifications provided by React Hot Toast.

Backend Technologies (Server)
The backend runs on Node.js and uses the Express.js framework to create a robust RESTful API. This API handles all data requests, routing (under the /api/v1 prefix), and necessary middleware. The data layer utilizes MongoDB, a NoSQL database, which flexibly stores public bill information (bills) and personalized user payment records (mybills).

Firebase Authentication manages user identity, covering sign-up, login, logout, Google Sign-in, and password reset functionalities. Standard utilities like CORS are implemented to handle cross-origin requests securely, and dotenv is used to manage sensitive environment variables.

✨ Key Features
Dynamic Bill Management: Allows browsing, filtering by category, and searching bills by title or location using URL query parameters.

Optimized Data Loading: Uses React Router's loader function to fetch crucial bill details before rendering the component, minimizing loading times.

Secure Authentication: Features full user authentication and session management via Firebase Auth.

User Payment Records: Provides logged-in users with a protected section (/mypaybills) to Create (POST), Read (GET), Update (PUT), and Delete (DELETE) their personal bill payment history.

Dark/Light Theme: Includes an easy-to-use theme toggler for an aesthetic user preference.