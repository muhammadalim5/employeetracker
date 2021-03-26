INSERT INTO department (name)
VALUES ("Human Resources","Health and Safety","Payroll","Customer Service","Technical Support","Admin");

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Support", 45000, 4), ("Human Resources Representative", 65000, 1), 
("Health and Safety Officer", 55000, 2), ("Payroll Rep", 50000, 3), ("Tech Support Rep", 40000, 5), 
("Admin Assistant", 35000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Carl", "Lewis", 1, null), ("Lisa", "Roberts", 2, null), ("John", "Wick", 3, null),
("Ron", "Artest", 4, null), ("Ann", "Stewart", 5, null), ("Lebron", "James", 6, null);
