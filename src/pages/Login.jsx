/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { FixedSizeList as List } from "react-window";
import axios from "axios";
import {
  Button,
  TextField,
  Modal,
  Switch,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";
import LogoLogin from "../components/Logo_.png";
import "../styles/Login.css";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Box, Dialog, IconButton, Snackbar } from "@mui/material";
import DataGlobal from "../components/globalData";

const LoginPage = () => {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { checked, setChecked } = DataGlobal();
  useEffect(() => {
    const validar = localStorage.getItem("Claudio");
    if (validar === true) {
      navigate("/empresas");
    } else {
      localStorage.clear();
    }
    
  }, []);

 

  const OnSubmit = async (chaveSistema) => {
    const Email = localStorage.getItem("Email");
    const Senha = localStorage.getItem("Senha");
    localStorage.setItem("Chave_Sistema", chaveSistema);
    localStorage.setItem("Nome", Email);

    const params = {
      Email,
      Senha,
      Chave_Sistema: localStorage.getItem("Chave_Sistema"),
    };

    localStorage.setItem("Email", Email);
    localStorage.setItem("Senha", Senha);
    localStorage.setItem("Autenticacao", 1);

    try {
      const response = await axios.post(
        "https://gerentemax.somee.com/Tenant/Account/AuthLogin",
        params
      );

      const accessToken = response.data.access_token;
      const nomeUser = response.data.Descricao_DB;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userData", nomeUser);

      navigate("/main");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };


  useEffect(() => {
    if (checked === true) {
      localStorage.setItem("Claudio", true);
    } else {
      localStorage.setItem("Claudio", false);
    }
    console.log("Manter conectado: ", localStorage.getItem("Claudio"));
  }, [setChecked, checked]);

  const handleLoginLogin = async () => {
    const params = {
      Email: Email,
      Senha: Senha,
    };

    localStorage.setItem("Email", Email);
    localStorage.setItem("Senha", Senha);
    localStorage.setItem("Nome", Email);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://gerentemax.somee.com/Tenant/Account/Sistemas/AuthSistemas",
        params
      );
      if (response != undefined) {
        setLoading(false);
      }
      if (response.data.length === 0) {
        setLoading(false);
        setError(true);
      }
      if (response.data.length === 1) {
        const { Chave_Sistema, Descricao_DB } = response.data[0];
        OnSubmit(Chave_Sistema, Descricao_DB);
      } else {
        localStorage.setItem("companies", JSON.stringify(response.data));
        setCompanies(localStorage.getItem("companies"));

        const Autenticacao = () => {
          if (Email === "") {
            return "emailNull";
          }

          if (Senha === "") {
            return "senhaNull";
          }

          if (response.data != null) {
            return "1";
          }
        };

        localStorage.setItem("Autenticacao", Autenticacao());
        if (Autenticacao() === "1") {
          navigate("/empresas");
        } else {
          setLoading(false);
          setError(true);
        }
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    const claudioValue = localStorage.getItem("Claudio");
    if (claudioValue === true) {
      // Autenticar automaticamente o usuário
      // Exemplo: chamar uma função de autenticação
      handleLoginLogin();
    }
  }, []);


  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={() => setError(false)}>
        fechar
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setError(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const PinkSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: blue[600],
      "&:hover": {
        backgroundColor: alpha(blue[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: blue[600],
    },
  }));

  const label = { inputProps: { "aria-label": "Color switch demo" } };

  return (
    <div className="login-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLoginLogin();
        }}
      >
        <div className="container-GERENTEMAX">
          <img className="logoLogin" src={LogoLogin} alt="GerenteMax" />
        </div>
        <div className="bem-vindo">
          <h3>Bem-Vindo(a)</h3>
          <p>Faça login utilizando sua conta registrada</p>
        </div>
        <div className="user">
          E-mail
          <TextField
            id="outlined-basic"
            variant="outlined"
            type="email"
            className="input"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="user">
          Senha
          <TextField
            id="outlined-basic"
            variant="outlined"
            className="input"
            type="password"
            value={Senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <div className="remember">
          <PinkSwitch checked={localStorage.getItem("Claudio")} onClick={() => setChecked(!checked)} />
          Mantenha-me conectado
        </div>
        <Button type="submit" className="btn-Entrar" onClick={handleLoginLogin}>
          Entrar
        </Button>
        <a href="#">Esqueceu sua senha?</a>
        {error && (
          <p className="invalido" style={{ color: "red" }}>
            E-mail e/ou senha inválidos
          </p>
        )}{" "}
        <footer>
          <p>© Copyright 2024. Todos os direitos reservados</p>
        </footer>
      </form>
      <Modal
        style={{ backgroundColor: "#00000045" }}
        fullWidth
        open={loading}
        onClose={() => setLoading(false)}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress className="loader1" size={100} />
        </Box>
      </Modal>
    </div>
  );
};

export default LoginPage;
