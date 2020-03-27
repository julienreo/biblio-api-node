# BIBLIO API

### TABLE OF CONTENTS

  * [PRESENTATION](#presentation)
  * [ROUTES](#routes)
  * [STORAGE](#storage)
  * [CACHE](#cache)
  * [TOOLS](#tools)
  * [TESTS](#tests)
  * [DEPLOYMENT](#deployment)
  * [CODE QUALITY](#code-quality)


## PRESENTATION

This is a **REST API** I built using **Node.js** and **Express.js** framework.

This API is the back-end structure of a **Products Library** I created for an **Engineering Office** * whose employees were spending too much time in finding which suppliers were selling the products they needed to buy in order to build their prototypes.

With this solution, they now have an API to call to instantly know which suppliers sell the products they need to buy and they can benchmark their offers thanks to technical notes they can edit.   

## ROUTES

The API exposes routes to handle standard **CRUD** operations:

- **Users** signup and signin.
- **Products** creation, modification, retrieval and removal.
- **Suppliers** creation, modification, retrieval and removal.
- Creation, modification and removal of **associations** between these entities.

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
Description: Delete supplier

Route: DELETE /suppliers/:id

Headers:
access-token: ...
```

#### Products/Suppliers association

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

## STORAGE

**MariaDB** is used as a relational **Database Management System** to persist data.

## CACHE

**Redis** is used for **caching** user requests responses.

## TOOLS

**JSON Web Token** is used to generate **access tokens**.

**Bcrypt** is used to **hash passwords**.

**Ajv** is used as a **JSON Schema Validator** to validate input data.

**Winston** is used to provide two **logging levels**, one for info and one for error purposes.

**Mocha**, **Chai** and **Sinon** are used to write **tests**.


## TESTS

**Unit Tests** are used to cover API's services, modules and libraries methods.

**Integration Tests** are used to test API's routes.


## DEPLOYMENT

**Docker** is used to build an image of the API so that it can be run on production.


## CODE QUALITY

**ESLint** is used to check the source code and ensure code consistency.

---

\* This project has been offered free of charge