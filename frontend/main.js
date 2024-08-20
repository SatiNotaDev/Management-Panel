let students = [];
let idTimeout;

document.getElementById('fullNameHeader').addEventListener('click', function (event) {
  event.preventDefault();
  sortTable('fullName');
});

document.getElementById('facultyHeader').addEventListener('click', function (event) {
  event.preventDefault();
  sortTable('faculty');
});

document.getElementById('birthdateHeader').addEventListener('click', function (event) {
  event.preventDefault();
  sortTable('birthdate');
});

document.getElementById('startYearHeader').addEventListener('click', function (event) {
  event.preventDefault();
  sortTable('startYear');
});

function addStudent() {
  let firstName = document.getElementById('firstName').value.trim();
  let lastName = document.getElementById('lastName').value.trim();
  let middleName = document.getElementById('middleName').value.trim();
  let birthdate = new Date(document.getElementById('birthdate').value);
  let startYear = parseInt(document.getElementById('startYear').value);
  let faculty = document.getElementById('faculty').value.trim();

  if (!firstName) {
    showError('Please enter First Name');
    return;
  }

  if (!lastName) {
    showError('Please enter Last Name');
    return;
  }

  if (!middleName) {
    showError('Please enter Middle Name');
    return;
  }

  if (!birthdate || birthdate < new Date('1900-01-01') || birthdate > new Date()) {
    showError('Please enter a valid Date of Birth');
    return;
  }

  if (!startYear || startYear < 2000 || startYear > new Date().getFullYear()) {
    showError('Please enter a valid Start Year');
    return;
  }

  if (!faculty) {
    showError('Please enter Faculty');
    return;
  }

  let student = {
    name: firstName,
    surname: lastName,
    lastname: middleName,
    birthday: birthdate.toISOString(),
    studyStart: startYear,
    faculty: faculty
  };

  addStudentToServer(student);
}

function showError(message) {
  let errorElement = document.getElementById('error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = 'error';
    errorElement.style.color = 'red';
    document.body.insertBefore(errorElement, document.getElementById('studentForm'));
  }
  errorElement.textContent = message;
}

function displayStudents(filteredStudents) {
  let tableBody = document.getElementById('studentTableBody');
  tableBody.innerHTML = '';

  let studentsToDisplay = filteredStudents || students;

  studentsToDisplay.forEach(function (student) {
    let row = tableBody.insertRow();
    let fullName = student.surname + ' ' + student.name + ' ' + student.lastname;
    let age = calculateAge(new Date(student.birthday));

    let endYear = new Date(student.studyStart, 0);
    endYear.setFullYear(endYear.getFullYear() + 4);

    row.insertCell().textContent = fullName;
    row.insertCell().textContent = student.faculty;
    row.insertCell().textContent = formatDate(new Date(student.birthday)) + ' (' + age + ' years)';
    row.insertCell().textContent = student.studyStart + '-' + endYear.getFullYear() + ' (' + getCourse(student.studyStart, endYear.getFullYear()) + ')';

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
      deleteStudent(student.id);
    });
    row.insertCell().appendChild(deleteButton);
  });
}

function calculateAge(birthdate) {
  let today = new Date();
  let birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

document.getElementById('addStudentBtn').addEventListener('click', function () {
  addStudent();
});


function applyFilters() {
  let filterName = document.getElementById('filterName').value.trim().toLowerCase();
  let filterFaculty = document.getElementById('filterFaculty').value.trim().toLowerCase();
  let filterStartYear = document.getElementById('filterStartYear').value || 0;
  let filterEndYear = document.getElementById('filterEndYear').value || 0;

  let filteredStudents = students.filter(function (student) {
    let studyEndYear = student.studyStart + 4;

    return (
      student.name.toLowerCase().includes(filterName) ||
      student.surname.toLowerCase().includes(filterName) ||
      student.lastname.toLowerCase().includes(filterName)) &&
      student.faculty.toLowerCase().includes(filterFaculty) &&
      (filterStartYear === 0 || student.studyStart === filterStartYear) &&
      (filterEndYear === 0 || studyEndYear === filterEndYear || (student.studyStart <= filterEndYear && studyEndYear >= filterEndYear));
  });

  displayStudents(filteredStudents);
}

document.getElementById('filterName').addEventListener('input', function (event) {
  clearTimeout(idTimeout);
  idTimeout = setTimeout(function () {
    applyFilters();
  }, 300);
});

document.getElementById('filterFaculty').addEventListener('input', function (event) {
  clearTimeout(idTimeout);
  idTimeout = setTimeout(function () {
    applyFilters();
  }, 300);
});

document.getElementById('filterStartYear').addEventListener('input', function (event) {
  clearTimeout(idTimeout);
  idTimeout = setTimeout(function () {
    applyFilters();
  }, 300);
});

document.getElementById('filterEndYear').addEventListener('input', function (event) {
  clearTimeout(idTimeout);
  idTimeout = setTimeout(function () {
    applyFilters();
  }, 300);
});

document.getElementById('filterName').addEventListener('blur', function () {
  let dropdown = document.getElementById('filterName');
  if (dropdown) {
    dropdown.classList.remove('active');
  }
});

function sortTable(sortBy) {
  students.sort(function (a, b) {
    if (sortBy === 'fullName') {
      let valueA = a.surname + a.name + a.lastname;
      let valueB = b.surname + b.name + b.lastname;
      return valueA.localeCompare(valueB);
    } else if (sortBy === 'faculty') {
      return a.faculty.localeCompare(b.faculty);
    } else if (sortBy === 'birthdate') {
      return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
    } else if (sortBy === 'startYear') {
      return a.studyStart - b.studyStart;
    }
  });

  displayStudents();
}

function formatDate(date) {
  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let year = date.getFullYear().toString().padStart(4, '0');
  return day + '.' + month + '.' + year;
}

function getCourse(startYear, endYear) {
  let currentYear = new Date().getFullYear();
  let course = currentYear - startYear + 1;

  if (currentYear > endYear) {
    return 'graduated';
  } else {
    return course + ' course';
  }
}

function loadStudentsFromServer() {
  fetch('http://localhost:3000/api/students')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      students = data;
      displayStudents();
    })
    .catch(function(error) {
      console.error('Error loading students:', error);
    });
}

function addStudentToServer(student) {
  fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    students.push(data);
    displayStudents();
  })
  .catch(function(error) {
    console.error('Error adding student:', error);
  });
}

function deleteStudentFromServer(studentId) {
  fetch(`http://localhost:3000/api/students/${studentId}`, {
    method: 'DELETE',
  })
  .then(function(response) {
    if (response.ok) {
      students = students.filter(function(student) {
        return student.id !== studentId;
      });
      displayStudents();
    } else {
      throw new Error('Error deleting student');
    }
  })
  .catch(function(error) {
    console.error(error);
  });
}

function deleteStudent(id) {
  deleteStudentFromServer(id);
}

loadStudentsFromServer();
