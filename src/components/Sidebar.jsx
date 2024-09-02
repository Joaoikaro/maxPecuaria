/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "../styles/Sidebar.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Cancel,
  CloseFullscreenRounded,
  InboxOutlined,
  Person,
  Person2Outlined,
} from "@mui/icons-material";
import Logo from "../images/Logo_.png";
import { CloseIcon } from "@mui/icons-material/Close";
import Usuarios from './../pages/Usuarios';

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [clienteNome, setClienteNome] = useState("");

  useEffect(() => {
    const Autenticacao = localStorage.getItem("Autenticacao");

    if (Autenticacao == "1") {
      setClienteNome("Nome do Cliente");
    } else {
      navigate("/");
    }
  }, [navigate]);

  axios.get("https://apimaxbackup.somee.com/api/Backup/Usuarios");

  const Sair = () => {
    localStorage.clear();
    navigate("/");
  };

  const Empresas = () => {
    navigate("/empresas");
  };

  const Usuarios = () => {
    navigate("/usuarios");
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const SidebarOptions = (
    <Box
      sx={{ width: 250, height: "100%" }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List sx={{ height: "100%" }}>
        <div
          style={{ padding: "15px", display: "flex", justifyContent: "center" }}
        >
          <img style={{ width: "100%", height: "100%" }} src={Logo}></img>
        </div>

        <Divider />

        <ListItem>
          <ListItemButton onClick={Empresas}>
            <ListItemIcon>
              <InboxOutlined />
            </ListItemIcon>
            <ListItemText primary={"Empresas"} />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={Usuarios}>
            <ListItemIcon>
              <Person2Outlined />
            </ListItemIcon>
            <ListItemText primary={"Usuários"} />
          </ListItemButton>
        </ListItem>

        <ListItem
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
          }}
        >
          <Button
            sx={{
              backgroundColor: "red",
              width: "90%",
              color: "white",
              ":hover": { backgroundColor: "#dc0000" },
            }}
            endIcon={<LogoutIcon />}
            onClick={() => setOpenModal(true)}
          >
            <Typography fontWeight="bold" fontSize={15}>
              Sair
            </Typography>
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {SidebarOptions}
      </Drawer>
      <Modal
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        open={openModal}
      >
        <Box
          sx={{ height: 200, width: 600, bgcolor: "white", borderRadius: 2 }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Cancel color="primary" onClick={() => setOpenModal(false)} />
          </div>

          <div
            className="geralModalWrapper"
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div className="ModalHeader">
              <Typography
                fontSize={40}
                component="h2"
                variant="h2"
                fontWeight="bold"
                marginBottom={2}
                color="primary"
              >
                Deseja encerrar a sessão?
              </Typography>

              <Typography align="center" fontSize={16}>
                Ao desconectar sua conta, você sera redirecionado para o Login
              </Typography>
            </div>

            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled button group"
              fullWidth
              sx={{
                height: "35%",
                overflow: "hidden",
                borderRadius: "0 0 7px 7px",
              }}
            >
              <Button
                sx={{ width: "50%", borderRadius: 0 }}
                color="error"
                onClick={Sair}
              >
                <Typography>Sair</Typography>
              </Button>
              <Button
                sx={{ width: "50%", borderRadius: 0 }}
                onClick={() => setOpenModal(false)}
              >
                Permanecer
              </Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Sidebar;
