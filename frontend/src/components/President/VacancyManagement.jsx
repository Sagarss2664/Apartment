import React, { useState, useEffect } from 'react';
import styles from "../../CSS/VacancyManagement.module.css";

const VacancyManagement = () => {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const response = await fetch('https://apartmentmanagementsystem-backend.onrender.com/api/vacancies');
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
      const response = await fetch(`https://apartmentmanagementsystem-backend.onrender.com/api/vacancies/${id}`, { method: 'DELETE' });
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

  return (
    <div className={styles.vacancyManagementContainer}>
      <h2>Vacancies</h2>
      <table className={styles.vacancyTable}>
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
                <button
                  className={styles.vacancyDeleteButton}
                  onClick={() => deleteVacancy(vacancy._id)}
                >
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

export default VacancyManagement;
