/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Modal, TextField, Box } from '@mui/material';

const BotaoInserirUsuario = ({ handlePostPessoas }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    NomePost: '',
    EmailPost: '',
    ApelidoPost: '',
    SenhaPost: '',
    PerfilPost: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handlePostPessoas(formData);
    setModalOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Adicionar Usuário
      </Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ padding: '20px', backgroundColor: '#fff', margin: '50px auto', width: 400, borderRadius: 8 }}>
          <h2>Adicionar Usuário</h2>
          <TextField
            label="Nome"
            name="NomePost"
            value={formData.NomePost}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="EmailPost"
            value={formData.EmailPost}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Apelido"
            name="ApelidoPost"
            value={formData.ApelidoPost}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Senha"
            name="SenhaPost"
            type="password"
            value={formData.SenhaPost}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Perfil"
            name="PerfilPost"
            value={formData.PerfilPost}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: '20px' }}>
            Confirmar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default BotaoInserirUsuario;