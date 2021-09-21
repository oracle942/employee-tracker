const inquirer = require('inquirer')
// Connect to database
const mysql = require('mysql2');


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'cms'
    },
    console.log(`Connected to the content management system database.`)
  );

// const employeeArr = []
// const departmentsArr =  db.query(`SELECT * FROM department`, (err, res) => res.map(res)) 



const rootOptions = [{
    type: 'list',
    name: 'root',
    message: 'What would you like to do?',
    choices: ['view all departments', 'view all roles', 
        'view all employees', 'add a department', 'add a role', 
        'add an employee', 'update an employee role']
}]
const addDepartment = [{
    type: 'input',
    name: 'department',
    message: 'Please enter the name of the department'
}]

const addRole = [{
  type: 'input',
  name: 'role_name',
  message: 'Please enter the name of the role'
},
{
  type: 'input',
  name: 'role_salary',
  message: 'Please enter the salary for the new role'
},
{
  type: 'input',
  name: 'role_dep',
  message: 'what department does the new role belong to?'
}]

const addEmployee = [{
  type: 'input',
  name: 'first_name',
  message: "Please enter the employee's first name"
},
{
  type: 'input',
  name: 'last_name',
  message: "Please enter the employee's last name"
},
{
  type: 'input',
  name: 'role',
  message: "What is the employee's job title?"
},
{
  type: 'input',
  name: 'manager',
  message: "Who is the employee's manager?"
}]

const updateEmployee = [{
  type: 'list',
  name: 'employee_update',
  message: "Please select and employee to update",
  choices: ['']
},
{
  type: 'input',
  name: 'new_role',
  message: 'Please enter the job title'
}]


 function init(){ 
  //  View all tables joined
  // db.query('SELECT * FROM employee INNER JOIN role ON employee.id = role.id', function (err, results) {
  //   console.log(console.table(results));
  // });
   
  
  inquirer.prompt(rootOptions).then( (res) => {
    if (res.root === 'view all departments'){
      // View all departments
        db.query(`SELECT id AS 'DEPARTMENT ID', name AS 'DEPARTMENT NAME' FROM department`, function (err, results) {
        console.table(results);
        });
        init()

      }
    if (res.root === 'view all roles'){
      console.log(res.root)
      // View all roles
        db.query(`SELECT role.title AS 'JOB TITLE', role.id AS 'ROLE ID', department.name AS 'DEPARTMENT', 
        role.salary as 'SALARY' FROM department JOIN role ON role.department_id = department.id`, function (err, results) {
        console.table(results);

        });
        init()
      }
    if (res.root === 'view all employees'){
      // View all employees
        db.query(`SELECT employee.id AS 'EMPLOYEE ID' , employee.first_name AS 'FIRST', employee.last_name AS 'LAST', role.title AS 'JOB TITLE', department.name as 'DEPARTMENT', role.salary as 'SALARY', employee.manager_id as 'MANAGER' 
        FROM department 
        JOIN role ON role.department_id = department.id
        JOIN employee ON employee.role_id = role.id`, function (err, results) {
        console.table(results);
        });

      }
    if (res.root === 'add a department'){
      inquirer.prompt(addDepartment).then( (res) => {
            //  Add new department
        db.query(`INSERT into department (name) VALUES ('${res.department}')`, (err, data) =>{
        if (err) console.log(err); init() })

        });

      }
    if (res.root === 'add an employee'){
      inquirer.prompt(addEmployee).then(
    //  Add new department
        db.query(`INSERT into employee (first_name) VALUES ('${res.first_name}'), 
                  INSERT into employee (last_name) VALUES ('${res.last_name}'),
                  INSERT into employee (role_id) VALUES ('${res.role_id}'),
                  INSERT into employee (manager_id) VALUES ('${res.manager_id}')`, (err, data) =>{
        if (err) console.log(err)
        }));

      }



 
    // Query database
  // db.query(`INSERT into department (name) VALUES ('${res.department}')`, (err, data) =>{
  //   if (err) console.log(err)
  //   console.log(data)
  // })




  })
 }

// module.exports = init()
init()



//View all tables joined
// db.query('SELECT * FROM employee INNER JOIN role ON employee.id = role.id INNER JOIN department ON role.id = department.id', function (err, results) {
//   console.log(console.table(results));
// });


// View all roles
// db.query('SELECT * FROM role JOIN department ON role.department_id = department.id', function (err, results) {
//   console.log(console.table(results));
// });

//View all employees
// db.query('SELECT * FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
//   console.log(console.table(results));
// });


// Add new department
// db.query(`INSERT into department (name) VALUES ('${res.department}')`, (err, data) =>{
//   if (err) console.log(err)
//   console.log(data)
// })
