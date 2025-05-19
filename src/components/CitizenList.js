
import React from 'react';
import useCitizenContract from '../hooks/useCitizenContract';

const CitizenList = () => {
  const { citizens } = useCitizenContract();

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Citizens</h2>
      <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Age</th>
            <th>City</th>
            <th>Name</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {citizens.map((citizen, index) => (
            <tr key={index}>
              <td>{citizen.id}</td>
              <td>{citizen.age}</td>
              <td>{citizen.city}</td>
              <td>{citizen.name}</td>
              <td>{citizen.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CitizenList;
