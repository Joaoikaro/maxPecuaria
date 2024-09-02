/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Modal, Box } from '@mui/material';

const BotaoDesativarUsuario = ({ idUsuario, handleDesativarUsuario }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirmDesativar = () => {
    handleDesativarUsuario(idUsuario);
    setModalOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="error" onClick={() => setModalOpen(true)}>
        Desativar
      </Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ padding: '20px', backgroundColor: '#fff', margin: '50px auto', width: 400, borderRadius: 8 }}>
          <h2>Confirmar Desativação</h2>
          <p>Tem certeza que deseja desativar este usuário?</p>
          <Button variant="contained" color="error" onClick={handleConfirmDesativar} sx={{ marginTop: '20px' }}>
            Desativar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default BotaoDesativarUsuario;