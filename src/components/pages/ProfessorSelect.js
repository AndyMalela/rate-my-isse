import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const ProfessorSelect = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('/api/professors')
      .then((res) => {
        const opts = res.data.map(p => ({
          value: p.id,
          label: p.name
        }));
        setOptions(opts);
      })
      .catch((err) => {
        console.error('Failed to fetch professors:', err);
        setOptions([]);
      });
  }, []);

  const handleChange = (option) => {
    setSelected(option);
    onSelect(option); // notify parent
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>
        Select a Professor
      </label>
      <Select
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="Search or select professor..."
        isSearchable
        isClearable
      />
    </div>
  );
};

export default ProfessorSelect;
