# Management-Panel

Student Management Panel
This project is a simple web-based Student Management Panel that allows you to add, filter, and manage student records. The panel provides functionality to sort and filter students by various attributes such as name, faculty, start year, and more.

Features
Add New Student: Enter details like first name, last name, middle name, date of birth, start year, and faculty to add a new student to the system.
Sort Students: Click on column headers to sort the student list by full name, faculty, birthdate, or start year.
Filter Students: Use the search inputs to filter students by name, faculty, start year, or end year.
Delete Student: Remove a student from the system using the delete button in the table.
Technologies Used
HTML/CSS: For the structure and styling of the application.
JavaScript: To handle the application logic, including adding students, filtering, and sorting.
Fetch API: Used to interact with a backend server to load, add, and delete student data.
Getting Started
Prerequisites
Ensure you have a web server running that can serve static files (e.g., using Live Server in VSCode).
Backend server to handle student data API requests (e.g., running on http://localhost:3000/api/students).

Open the index.html file in your browser, or use a local server to run the project.
Usage
Fill out the form at the top of the page to add a new student.
Use the table headers to sort students by name, faculty, birthdate, or start year.
Use the search filters to narrow down the list of students by name, faculty, or year range.
Click the "Delete" button next to any student to remove them from the list.
API Endpoints
GET /api/students - Retrieve all student records.
POST /api/students - Add a new student record.
DELETE /api/students/:id - Delete a student record by ID.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Bootstrap Grid - Used for responsive layout.
Normalize.css - Used for CSS normalization.
