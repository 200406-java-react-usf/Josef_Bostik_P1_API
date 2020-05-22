The purpose of this portion of the project is to create a basic online Employee Reimbursement System API, incorporating TypeScript, PostGreSQL, node-postgre, express, jest, and Git SCM. The primary functionality of this API is to create, read, update, and delete data from a database created in PostGreSQL, hosted by AWS. The method used to interface with the API is HTTP. In this project, there are three data types: Users, and Reimbursments. Each user is to have 0-n reimbursements. <br />

AUTHENTICATE <br />
[POST] /auth : Authenticates user <br />

USERS <br />
[GET] /users : Gets all users  <br />
[GET] /users/:id : Gets user :id <br />
[GET] /users/:id/orders : Gets all the users orders with the specified :id <br />
[POST] /users : Posts a user given a JSON with user properties <br /> <br />
[DELETE] /users/:id : Deletes a user with serial :id <br />
[PATCH] /users/:id : Patches a user given a JSON with user properties <br />
 <br />
REIMBURSEMENTS <br />
[GET] /reimbursments : Gets all reimbursments <br />
[GET] /reimbursments/:id : Gets reimbursment :id <br />
[GET] /reimbursments/user/:id : Gets reimbursments by user :id <br />
[POST] /reimbursments/:id : Posts an reimbursment at :id given a JSON with order properties <br />
[PATCH] /reimbursments/:id : Patches a reimbursment at :id given a JSON with order properties <br />
[DELETE] /reimbursments/:id : Deletes an reimbursment at :id <br />
 
