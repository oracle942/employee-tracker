INSERT INTO department (id, name)
VALUES (001, "Sales"),
       (002, "Engineering"),
       (003, "Finance"),
       (004, "Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES (001, "Salesperson", 80000, 001),
       (002, "Lead Engineer", 150000, 002),
       (003, "Software Engineer", 120000, 002),
       (004, "Account Manager", 160000, 003),
       (005, "Accountant", 125000, 003),
       (006, "Legal Team Lead", 250000, 004),
       (007, "Lawyer", 190000, 004);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (001, "Mike", "Chan", 001),
       (002, "Ashley", "Rodriguez", 002),
       (003, "Kevin", "Tupik", 003, 002),
       (004, "Kunal", "Singh", 004),
       (005, "Malia", "Brown", 005, 004),
       (006, "Sarah", "Lourd", 006),
       (007, "Tom", "Allen", 007, 006);
       
