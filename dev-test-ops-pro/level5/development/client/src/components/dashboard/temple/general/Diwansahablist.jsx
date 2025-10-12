import React from 'react';
import Diswansahabdata from './Diswansahabdata.json';
import Divan from './Divan';
const DiwansahbList = () => {
  return (
    <div className="person-list">
      {Diswansahabdata.map((divan) => (
        <Divan key={divan.id} person={divan} />
      ))}
    </div>
  );
};

export default DiwansahbList;