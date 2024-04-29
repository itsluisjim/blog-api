# REST API with Node.js, Express, and MongoDB

## Blogaway - A blogging platform

**Project Goal:**
The goal of this project was to build a robust and secure REST API using Node.js, Express, and MongoDB. The API would follow best practices for RESTful design and include features such as JWT-based authentication and authorization. Used Swagger to document API endpoints.

**BlogAway User Interface:** <a href="https://github.com/itsluisjim/blog-ui">View Repo</a>


**Technologies Used:**

- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white): A JavaScript runtime environment that allows developers to run JavaScript on the server-side.
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB): A popular web application framework for Node.js, which simplifies the process of building web servers and APIs.
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
: A popular NoSQL database that stores data in flexible, JSON-like documents.
- **JSON Web Tokens (JWT)**: An open standard for securely transmitting information between parties as a JSON object.

**Key Features:**
1. **RESTful Design**: The API was designed to follow RESTful principles, ensuring a clear and intuitive structure for the endpoints, HTTP methods, and data responses.

2. **JWT-based Authentication and Authorization**: The API implemented a JWT-based authentication and authorization system. Users can register and log in, and the API uses signed JWT tokens to authenticate and authorize requests.

3. **CRUD Operations**: The API supports standard CRUD (Create, Read, Update, Delete) operations for various resources, such as authors, blogs etc.

4. **Data Persistence with MongoDB**: The API uses MongoDB as the database to store and retrieve data. MongoDB's flexible document-oriented data model is well-suited for the API's requirements.

5. **Error Handling and Response Formatting**: The API includes robust error handling mechanisms, providing clear and informative error messages to clients. Responses are consistently formatted, often in JSON format.

6. **Security Practices**: The API follows security best practices, such as hashing passwords, validating inputs, and protecting against common web vulnerabilities like CSRF and XSS.

**Project Structure and Organization:**
The project is structured in a modular and maintainable way, with the following key components:

- **Routes**: Responsible for handling incoming requests and mapping them to the appropriate controller functions.
- **Controllers**: Contain the business logic for processing requests and interacting with the database.
- **Models**: Represent the data structures and schemas used in the API, leveraging Mongoose (an Object Document Mapping library for MongoDB).
- **Middleware**: Handles cross-cutting concerns, such as authentication, authorization, and error handling.
- **Utilities**: Includes helper functions, configuration settings, and other supporting code.

### Future Work:
- Allow users to upload their own profile images.
- Allow users to change their email.
