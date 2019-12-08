# BIBLIO API

This is a **REST API** I built using **Node.js** and **Express.js** framework.

This API is the back-end structure of a **Products Library** I created for an **Engineering Office** * whose employees were spending too much time in finding which suppliers were selling the products they needed to buy in order to build their prototypes.

With this solution, they now have an API to call to instantly know which suppliers sell the products they need to buy and they can benchmark their offers thanks to the technical notes they can add.   


## DESCRIPTION

The API exposes routes to handle standard **CRUD** operations:

- **Users** signup and signin.
- **Products** creation, modification, retrieval and removal.
- **Suppliers** creation, modification, retrieval and removal.
- Creation, modification and removal of **associations** between these entities.


## STORAGE

**MariaDB** is used as a relational **Database Management System** to persist data.


## TOOLS

**JSON Web Token** is used to generate **access tokens**.

**Bcrypt** is used to **hash passwords**.

**Ajv** is used as a **JSON Schema Validator** to validate input data.

**Winston** is used to provide two **logging levels**, one for info and one for error purposes.

**Mocha**, **Chai** and **Sinon** are used to write **tests**.


## TDD

**Unit Tests** are used to cover API's services, modules and libraries methods.

**Integration Tests** are used to test API's routes.


## DEPLOYMENT

**Docker** is used to build an image of the API so that it can be run on production.


## CODE QUALITY

**ESLint** is used to check the source code and ensure code consistency.


##

\* This project has been offered free of charge