The purpose of this portion of the project is to create a basic online Employee Reimbursement System API, incorporating TypeScript, PostGreSQL, node-postgre, express, jest, and Git SCM. The primary functionality of this API is to create, read, update, and delete data from a database created in PostGreSQL, hosted by AWS. The method used to interface with the API is HTTP. In this project, there are three data types: Users, and Reimbursments. Each user is to have 0-n reimbursements.

AUTHENTICATE
[POST] /auth : Authenticates user

USERS
[GET] /users : Gets all users
[GET] /users/:id : Gets user :id
[GET] /users/:id/orders : Gets all the users orders with the specified :id
[POST] /users : Posts a user given a JSON with user properties
[DELETE] /users/:id : Deletes a user with serial :id
[PATCH] /users/:id : Patches a user given a JSON with user properties

REIMBURSEMENTS
[GET] /reimbursments : Gets all reimbursments
[GET] /reimbursments/:id : Gets reimbursment :id
[GET] /reimbursments/user/:id : Gets reimbursments by user :id
[POST] /reimbursments/:id : Posts an reimbursment at :id given a JSON with order properties
[PATCH] /reimbursments/:id : Patches a reimbursment at :id given a JSON with order properties
[DELETE] /reimbursments/:id : Deletes an reimbursment at :id

