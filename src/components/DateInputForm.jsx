import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function DateInputForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row',  }}>
      <TextField
        label="Data Inicial"
        type="date"
        value={startDate}
        onChange={(event) => setStartDate(event.target.value)}
      />

      <TextField
        label="Data Final"
        type="Date"
        value={endDate}
        onChange={(event) => setEndDate(event.target.value)}
      />
      <Button type="submit" variant="contained" color="primary">
        Enviar
      </Button>
    </form>
  );
}

export default DateInputForm;
