import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

const Vacancy = () => {
  const [vacancies, setVacancies] = useState([]);

  const fetchVacancies = async () => {
    try {
      const response = await fetch('https://apartmentmanagementsystem-q800.onrender.com/api/vacancies');
      if (!response.ok) {
        throw new Error('Failed to fetch vacancies.');
      }
      const data = await response.json();
      setVacancies(data);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    }
  };

  const deleteVacancy = async (id) => {
    try {
      const response = await fetch(`https://apartmentmanagementsystem-q800.onrender.com/api/vacancies/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Vacancy deleted successfully');
        fetchVacancies();
      } else {
        alert('Failed to delete vacancy');
      }
    } catch (error) {
      console.error('Error deleting vacancy:', error);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  return (
    <div className="vacancyContainer">
      <h2>Vacancies</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Flat Number</th>
            <th>No. of Days</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vacancies.map((vacancy) => (
            <tr key={vacancy._id}>
              <td>{vacancy.flat_number}</td>
              <td>{vacancy.no_of_days_to_be_vacant}</td>
              <td>{vacancy.reason}</td>
              <td>
                <button className="btn btn-danger" onClick={() => deleteVacancy(vacancy._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vacancy;
