/* eslint-disable no-unused-vars */
import "../styles/Dashboard.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatarCpfCnpj } from "../services/format";
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import { GiHamburgerMenu } from "react-icons/gi";
import PersonIcon from "@mui/icons-material/Person";
import $, { get } from "jquery";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import { TbArrowBackUp } from "react-icons/tb";

function Dashboard() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [setError] = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const Autenticacao = localStorage.getItem("Autenticacao");

    if (Autenticacao === "1") {
      setClienteNome(localStorage.getItem("Nome"));
    } else {
      navigate("/");
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    const Autenticacao = localStorage.getItem("Autenticacao");

    if (Autenticacao === "1") {
      setClienteNome(localStorage.getItem("Nome"));
    } else {
      navigate("/");
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    // console.log("rodou a const");
    setLoading(true);
    abrirMenus();
    const Autenticacao = localStorage.getItem("Autenticacao");
    const Email = localStorage.getItem("Email");
    const Senha = localStorage.getItem("Senha");

    if (Autenticacao === "1") {
      axios
        .post(
          "https://gerentemax.somee.com/Tenant/Account/Sistemas/AuthSistemas",
          {
            Email: Email,
            Senha: Senha,
          }
        )
        .then((response) => {
          setCompanies(response.data);
          setFilteredCompanies(response.data);
          setLoading(false);
        })
        .catch((error) => console.error("Erro ao buscar dados:", error));
    } else {
      localStorage.clear();
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = companies.filter((company) =>
      company.Cliente_ApelidoFantasia.toLowerCase().includes(
        searchValue.toLowerCase()
      )
    );

    setFilteredCompanies(filtered);
    inputRef.current.focus();
  }, [setSearchValue, searchValue, companies]);

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    left: -2,
  }));

  const abrirMenus = () => {
    const sidebar = $(".Sidebar");

    if (sidebar.is(":visible")) {
      sidebar.stop().fadeOut(100);
    } else {
      sidebar.stop().fadeIn(300);
    }
  };

  const onSubmit = async (chaveSistema) => {
    setLoading(true);
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

    try {
      const response = await axios.post(
        "https://gerentemax.somee.com/Tenant/Account/AuthLogin",
        params
      );

      const accessToken = response.data.access_token;
      localStorage.setItem("accessToken", accessToken);

      const nomeUser = response.data.Descricao_DB;
      localStorage.setItem("userData", nomeUser);
      setLoading(true);
      navigate("/fluxo");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Email", {
        type: "manual",
        message: "Email ou senha inválidos",
      });
    }
  };

  const hardReset = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container">
      <header>
        <div className="container-header">
          <GiHamburgerMenu
            color="#343434ac"
            className="menu"
            onClick={abrirMenus}
          />
          <div className="container-search">
            <form className="form-empresas">
              <FormControl>
                <div style={{display: "flex"}}>
                  <SearchIcon />
                  <InputBase
                    placeholder="Pesquisar"
                    inputProps={{ "aria-label": "search" }}
                    type="text"
                    defaultValue={searchValue}
                    value={searchValue}
                    onChange={(event) => {
                      console.log(event.target.value);
                      setSearchValue(event.target.value);
                    }}
                    ref={inputRef}
                  />
                </div>
              </FormControl>
            </form>
          </div>
          <div className="container-user">
            <div className="user-info">
              <PersonIcon className="user-icon" />
              <span>{clienteNome}</span>
            </div>
          </div>
        </div>
      </header>
      <div className="preenchimento"></div>
      <div className="container-empresas">
        <Grid sx={{ justifyContent: "center" }} spacing={0} container>
          {filteredCompanies.map((company, index) => (
            <React.Fragment key={company.Id_Cliente}>
              <Grid
                item
                key={company.Id_Cliente}
                className="container-empresa"
                onClick={() =>
                  onSubmit(company.Chave_Sistema, company.Descricao_DB)
                }
              >
                {index === 0 && (
                  <div className="title-container">
                    <Typography className="title-sistema">
                      Selecione um sistema:
                    </Typography>
                  </div>
                )}
                <Button
                  className="btn-empresa"
                  variant="contained"
                  sx={{
                    backgroundColor: "#ffffff",
                    transition: "all 0.5s ease",
                    ":hover": {
                      transform: "scale(1.1)",
                      backgroundColor: "#ffffff",
                    },
                  }}
                >
                  <CardContent
                    className="container-card"
                    sx={{ paddingTop: "0" }}
                  >
                    <div className="dados-empresa">
                      <p className="nome-empresa">
                        {company.Cliente_ApelidoFantasia}
                      </p>
                      <Typography
                        className="cnpj"
                        variant="body2"
                        sx={{ height: "10vh", color: "rgb(150, 150, 150)" }}
                      >
                        {formatarCpfCnpj(company.Cliente_CPFCNPJ)}
                      </Typography>
                    </div>
                    <div className="container-baixo">
                      <div className="container-img">
                        <img src={company.Imagem} className="logo-empresas" />
                      </div>
                      <div className="cnpj-container">
                        <p className="descricao-empresa">
                          {company.Descricao_DB}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Button>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>

        <Button
          sx={{
            fontWeight: "600",
            fontSize: "15px",
            textTransform: "capitalize",
            color: "white",
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#0e4780" },
            width: "235px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="btn-voltar"
          onClick={hardReset}
          variant="contained"
        >
          <TbArrowBackUp size={27} />
          Voltar para login
        </Button>

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
    </div>
  );
}

export default Dashboard;
