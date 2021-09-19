# BIBLIO API

### TABLE OF CONTENTS

- [PRESENTATION](#presentation)
- [DESCRIPTION](#description)
- [STORAGE](#storage)
- [CACHING](#caching)
- [TOOLS](#tools)
- [TESTING](#testing)
- [LOCAL INSTALL](#local-install)
- [OPS](#ops)
- [CI - CD](#ci---cd)
- [CODE QUALITY](#code-quality)
- [ROUTES](#routes)
    + [Users](#users)
    + [Products](#products)
    + [Suppliers](#suppliers)
    + [Products and Suppliers association](#products-and-suppliers-association)


## PRESENTATION

This is a **REST API** I built using **Node.js** and **Express.js** framework.
The project has first been developed in **JavaScript** and has then been migrated to **TypeScript**.

This API is the back-end structure of a **Products Library** I created for an **Engineering Office** * whose employees were spending too much time in finding which suppliers were selling the products they needed to buy in order to build their prototypes.

With this solution, they now have an API to call to instantly know which suppliers sell the products they need to buy and they can benchmark their offers thanks to technical notes they can edit.   


## DESCRIPTION

The API exposes [routes](#routes) to handle standard **CRUD** operations:

- **Users** signup and signin.
- **Products** creation, modification, retrieval and removal.
- **Suppliers** creation, modification, retrieval and removal.
- Creation, modification and removal of **associations** between these entities.


## STORAGE

**MariaDB** is used as a relational **Database Management System** to persist data.


## DATABASE DRIVER

A custom **ORM** has been built to interact with the database


## CACHING

**Redis** is used for **caching** user requests responses.


## TOOLS

**JSON Web Token** is used to generate **access tokens**.

**Bcrypt** is used to **hash passwords**.

**Ajv** is used as a **JSON Schema Validator** to validate input data.

**Winston** is used to provide two **logging levels**, one for info and one for error purposes.

**Mocha**, **Chai** and **Sinon** are used to write **tests**.


## TESTING

**Unit Tests** are used to cover API's services, modules and libraries methods.

**Integration Tests** are used to test API's routes.


## LOCAL INSTALL

**Docker Compose** is used to run **MariaDB** and **Redis** locally.


## OPS

**Docker** is used to **build**, **test** and **run** the application.

**Vagrant** is used to **create locally** a development environment that **reproduces** the production environment.

**Ansible** is used to **provision**, **configure** and **manage** the local and production environments.


## CI - CD

**Jenkins** is used as a **continuous integration** and **continuous delivery** tool to manage the **integration testing** process and handle the **deployment** of the application.


## CODE QUALITY

**ESLint** is used to check the source code and ensure code consistency.


## ROUTES

#### Users

```
Description: User login

Route: POST /users/login

Body:
{
    "email": "johndoe@gmail.com",
    "password": "motdepasse"
}
```

```
Description: User signup

Route: POST /users

Headers:
access-token: ...

Body:
{
    "firstname": "John Jr.",
    "lastname": "Doe",
    "email": "john.jr.doe@gmail.com",
    "password": "motdepasse"
}
```

#### Products

```
Description: Get products

Route: GET /products

Headers:
access-token: ...
```

```
Description: Get product

Route: GET /products/:id

Headers:
access-token: ...
```

``` 
Description: Update product

Route: PUT /products/:id

Headers:
access-token: ...

Body:
{
    "name": "insert fileté RS PRO M3",
    "notes": "Laiton, fixation Ø 4mm, L 4.78mm"
}
```

``` 
Description: Create product

Route: POST /products

Headers:
access-token: ...

Body:
{
    "name": "insert fileté RS PRO M5",
    "notes": "Laiton, fixation Ø 6.4mm, L 9.35mm"
}
```

``` 
Description: Create product and associate it to a supplier

Route: POST /suppliers/:supplierId/products

Headers:
access-token: ...

Body:
{
    "name": "insert fileté RS PRO M5",
    "notes": "Laiton, fixation Ø 6.4mm, L 9.35mm"
}
```

```
Description: Delete product

Route: DELETE /products/:id

Headers:
access-token: ...
```

#### Suppliers

``` 
Description: Get suppliers

Route: GET /suppliers

Headers:
access-token: ...
```

```
Description: Get supplier

Route: GET /suppliers/:id

Headers:
access-token: ...
```

``` 
Description: Update supplier

Route: PUT /suppliers/:id

Headers:
access-token: ...

Body:
{
    "name": "rs-online",
    "website": "https://fr.rs-online.com",
    "notes": "Promotions en cours"
}
```

``` 
Description: Create supplier

Route: POST /suppliers

Headers:
access-token: ...

Body:
{
    "name": "rs-online",
    "website": "https://fr.rs-online.com",
    "notes": "Bon rapport qualité/prix de manière générale"
}
```

``` 
Description: Create supplier and associate it to a product

Route: POST /products/:productId/suppliers

Headers:
access-token: ...

Body:
{
    "name": "rs-online",
    "website": "https://fr.rs-online.com",
    "notes": "Bon rapport qualité/prix de manière générale"
}
```

```
Description: Delete supplier

Route: DELETE /suppliers/:id

Headers:
access-token: ...
```

#### Products and Suppliers association

```
Description: Create product/supplier association

Route: POST /productsSuppliers

Headers:
access-token: ...

Body:
{
    "fkProduct": 1,
    "fkSupplier": 2,
    "notes": "Ce produit est moins cher chez ce fournisseur"
}
```

``` 
Description: Update product/supplier association

Route: PUT /productsSuppliers

Headers:
access-token: ...

Body:
{
    "fkProduct": 1,
    "fkSupplier": 2,
    "notes": "Remises sur ce produit auprès de ce fournisseur en ce moment"
}
```

``` 
Description: Delete product/supplier association

Route: DELETE /productsSuppliers

Headers:
access-token: ...

Body:
{
    "fkProduct": 1,
    "fkSupplier": 2
}
```

---

\* This project has been offered free of charge