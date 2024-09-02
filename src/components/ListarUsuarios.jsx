/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "../styles/ListarUsuarios.css";
import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CircularProgress,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Modal,
  TextField,
  Snackbar,
  Alert,
  InputAdornment,
  Checkbox,
  IconButton,
} from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import endpoints from "../services/endpoints";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "styled-components";
import {
  AccountCircle,
  Close,
  Delete,
  DriveFileMove,
  Edit,
  EditOff,
  PersonAdd,
  Print,
} from "@mui/icons-material";
import { GiPencil } from "react-icons/gi";

function ListarUsuarios() {
  const [usuarioClicadoTable, setUsuarioClicadoTable] = useState({});
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [IdPost, setIdPost] = useState(0);
  const [NomePost, setNomePost] = useState("");
  const [EmailPost, setEmailPost] = useState("");
  const [ApelidoPost, setApelidoPost] = useState("");
  const [SenhaPost, setSenhaPost] = useState("");
  const [IdPessoaPost, setIdPessoaPost] = useState(0);
  const [DesativadoSNPost, setDesativadoSNPost] = useState(false);
  const [modalOptions, setModalOptions] = useState(false);
  const [IdAnexoPost] = useState(0);
  const [DescricaoAnexoPost, setDescricaoAnexoPost] = useState("");
  const [IdRegistroVinculoAnexoPost, setIdRegistroVinculoAnexoPost] =
    useState(0);
  const [IdTabelaVinculoAnexoPost, setIdTabelaVinculoAnexoPost] = useState(0);
  const [Base64AnexoPost, setBase64AnexoPost] = useState("");
  const [CaminhoAnexoPost, setCaminhoAnexoPost] = useState("");
  const [PrincipalSNAnexoPost, setPrincipalSNAnexoPost] = useState(false);
  const [DesativadoSNAnexoPost, setDesativadoSNAnexoPost] = useState(false);
  const [avisoAdicionado, setAvisoAdicionado] = useState(false);
  const [avisoEditado, setAvisoEditado] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);
  const [senhaConfirmada, setSenhaConfirmada] = useState("");
  const [disableEditar, setDisableEditar] = useState(true);
  const [confirmaDesativarUnico, setConfirmaDesativarUnico] = useState(false);
  const [confirmaDesativarTodos, setConfirmaDesativarTodos] = useState(false);

  const handleConfirmarDesativarUnico = () => {
    setConfirmaDesativarUnico(true);
  };

  const handleFecharDesativarUnico = () => {
    setConfirmaDesativarUnico(false);
  };
  const handleConfirmarDesativarTodos = () => {
    setConfirmaDesativarTodos(true);
  };
  const handleFecharDesativarTodos = () => {
    setConfirmaDesativarTodos(false);
  };

  const handleCloseModalAddUser = () => {
    setNomePost("");
    setEmailPost("");
    setApelidoPost("");
    setSenhaPost("");
    setSenhaConfirmada("");
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    switch (name) {
      case "NomePost":
        setNomePost(newValue);
        break;
      case "EmailPost":
        setEmailPost(newValue);
        break;
      case "ApelidoPost":
        setApelidoPost(newValue);
        break;
      case "SenhaPost":
        setSenhaPost(newValue);
        break;
      case "SenhaConfirmada":
        setSenhaConfirmada(newValue);
        break;
      case "IdPessoaPost":
        setIdPessoaPost(Number(newValue));
        break;
      case "DesativadoSNPost":
        setDesativadoSNPost(newValue);
        break;
      case "DescricaoAnexoPost":
        setDescricaoAnexoPost(newValue);
        break;
      case "IdRegistroVinculoAnexoPost":
        setIdRegistroVinculoAnexoPost(Number(newValue));
        break;
      case "IdTabelaVinculoAnexoPost":
        setIdTabelaVinculoAnexoPost(Number(newValue));
        break;
      case "Base64AnexoPost":
        setBase64AnexoPost(newValue);
        break;
      case "CaminhoAnexoPost":
        setCaminhoAnexoPost(newValue);
        break;
      case "PrincipalSNAnexoPost":
        setPrincipalSNAnexoPost(newValue);
        break;
      case "DesativadoSNAnexoPost":
        setDesativadoSNAnexoPost(newValue);
        break;
      default:
        break;
    }

    if (SenhaPost !== senhaConfirmada) {
      setErroSenha(true);
    } else {
      setErroSenha(false);
    }
  };

  const fetchUsuarios = () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      localStorage.clear();
      navigate("/");
    } else {
      axios
        .get(endpoints.getListarUsuarios, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Response do Get Pessoas", response.data);
          setValorRowsUsuarios(
            response.data
              .filter((row) => row.DesativadoSN === false)
              .map((row, index) => ({ id: row.Id || index, ...row }))
          );
        })
        .finally(() => setLoading(false));
    }
  };

  const handlePostPessoas = () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      localStorage.clear();
      navigate("/");
    } else {
      const DadosPost = [
        {
          Id: IdPost,
          Nome: NomePost,
          Email: EmailPost,
          Apelido: ApelidoPost,
          Senha: SenhaPost,
          IdPessoa: IdPessoaPost,
          DesativadoSN: DesativadoSNPost,
          Anexo: {
            Id: IdAnexoPost,
            Descricao: DescricaoAnexoPost,
            IdRegistro_Vinculo: IdRegistroVinculoAnexoPost,
            IdTabela_Vinculo: IdTabelaVinculoAnexoPost,
            Base64: Base64AnexoPost,
            Caminho_Anexo: CaminhoAnexoPost,
            PrincipalSN: PrincipalSNAnexoPost,
            DesativadoSN: DesativadoSNAnexoPost,
          },
        },
      ];

      axios
        .post(endpoints.postInserirUsuarios, DadosPost, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          handleCloseModalAddUser();
          setAvisoAdicionado(true);
          fetchUsuarios();
        })
        .finally(() => setLoading(false));
    }
  };

  const handleFecharAddAviso = () => {
    setAvisoAdicionado(false);
  };

  const AdicionarUsuario = (e) => {
    e.preventDefault();
    handlePostPessoas();
    handlePostPessoas();
    handleCloseModalAddUser();
  };

  const OpenModalAddUser = () => {
    setNomePost("");
    setEmailPost("");
    setApelidoPost("");
    setSenhaPost("");
    setSenhaConfirmada("");
    setModalOpen(true);
  };

  const [OpenModalDesativar, setOpenModalDesativar] = useState(false);
  const [AvisoDesativadoOpen, setAvisoDesativadoOpen] = useState(false);
  const [ValorRowsDesativarUsuarios, setValorRowsDesativarUsuarios] = useState(
    []
  );
  const UsuarioRemovido = localStorage.getItem("Removido");

  const handleFecharAviso = () => {
    setAvisoDesativadoOpen(false);
  };

  const handleDesativarUsuario = () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      localStorage.clear();
      navigate("/");
    } else {
      if (usuarioClicadoTable && usuarioClicadoTable.Id) {
        const usuarioAtualizado = {
          ...usuarioClicadoTable,
          DesativadoSN: true,
          Anexo: usuarioClicadoTable.Anexo
            ? {
                ...usuarioClicadoTable.Anexo,
                DesativadoSN: true,
              }
            : {},
        };

        axios
          .put(`${endpoints.putAtualizarPessoas}`, [usuarioAtualizado], {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            localStorage.setItem("Removido", usuarioAtualizado.Nome);
            fetchUsuarios();
            handleCloseModalDesativar();
            setAvisoDesativadoOpen(true);
          })
          .finally(() => setLoading(false));
        setUsuarioClicadoTable({});
        fecharModalOptions();
        handleFecharDesativarUnico();
      } else {
        setLoading(false);
        setUsuarioClicadoTable({});
        handleFecharDesativarUnico();
        fecharModalOptions();
        console.error("Usuário não encontrado");
      }
    }
  };

  const fecharModalOptions = () => {
    setModalOptions(false);
  };

  const handleCloseModalEditUser = () => {
    setModalEditOpen(false);
  };

  const handleEditClick = () => {
    setNomePost(usuarioClicadoTable.Nome);
    setEmailPost(usuarioClicadoTable.Email);
    setApelidoPost(usuarioClicadoTable.Apelido);
    setSenhaPost(usuarioClicadoTable.Senha);
    setIdPessoaPost(usuarioClicadoTable.IdPessoa);
    setDescricaoAnexoPost(usuarioClicadoTable.Anexo?.Descricao || "");
    setIdRegistroVinculoAnexoPost(
      usuarioClicadoTable.Anexo?.IdRegistro_Vinculo || 0
    );
    setIdTabelaVinculoAnexoPost(
      usuarioClicadoTable.Anexo?.IdTabela_Vinculo || 0
    );
    setBase64AnexoPost(usuarioClicadoTable.Anexo?.Base64 || "");
    setCaminhoAnexoPost(usuarioClicadoTable.Anexo?.Caminho_Anexo || "");
    setPrincipalSNAnexoPost(usuarioClicadoTable.Anexo?.PrincipalSN || false);
    setDesativadoSNAnexoPost(usuarioClicadoTable.Anexo?.DesativadoSN || false);
    setModalEditOpen(true); // Abre o modal de edição
  };

  const handlePutEditarUsuario = () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      localStorage.clear();
      navigate("/");
    } else {
      const usuarioAtualizado = {
        Id: usuarioClicadoTable.Id,
        Nome: NomePost,
        Email: EmailPost,
        Apelido: ApelidoPost,
        Senha: SenhaPost,
        IdPessoa: IdPessoaPost,
        DesativadoSN: DesativadoSNPost,
        Anexo: {
          Id: IdAnexoPost,
          Descricao: DescricaoAnexoPost,
          IdRegistro_Vinculo: IdRegistroVinculoAnexoPost,
          IdTabela_Vinculo: IdTabelaVinculoAnexoPost,
          Base64: Base64AnexoPost,
          Caminho_Anexo: CaminhoAnexoPost,
          PrincipalSN: PrincipalSNAnexoPost,
          DesativadoSN: DesativadoSNAnexoPost,
        },
      };
      axios
        .put(`${endpoints.putAtualizarPessoas}`, [usuarioAtualizado], {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          fecharModalOptions();
          setAvisoEditado(true); // Exibe o Snackbar de sucesso
          fetchUsuarios();
        })
        .finally(() => setLoading(false));
    }
  };

  const EditarUsuario = (e) => {
    e.preventDefault();
    handlePutEditarUsuario();
  };

  const handleFecharEditAviso = () => {
    setAvisoEditado(false);
  };

  const handleCloseModalDesativar = () => setOpenModalDesativar(false);

  const [ValorRowsUsuarios, setValorRowsUsuarios] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const [searchValue, setSearchValue] = useState("");

  const usuariosFiltrados = ValorRowsUsuarios.filter((usuario) => {
    const searchLower = searchValue.toLowerCase();
    return (
      usuario.Nome.toLowerCase().includes(searchLower) ||
      usuario.Apelido.toLowerCase().includes(searchLower) ||
      usuario.Email.toLowerCase().includes(searchLower) ||
      String(usuario.id).padStart(3, "0").includes(searchLower)
    );
  });

  const handleRowClick = (params) => {
    setUsuarioClicadoTable(params);
    console.log(params);
    setNomePost(params.Nome);
    setEmailPost(params.Email);
    setApelidoPost(params.Apelido);
    setSenhaPost(params.Senha);
    setIdPessoaPost(params.IdPessoa);
    setDescricaoAnexoPost(params.Anexo?.Descricao || "");
    setIdRegistroVinculoAnexoPost(params.Anexo?.IdRegistro_Vinculo || 0);
    setIdTabelaVinculoAnexoPost(params.Anexo?.IdTabela_Vinculo || 0);
    setBase64AnexoPost(params.Anexo?.Base64 || "");
    setCaminhoAnexoPost(params.Anexo?.Caminho_Anexo || "");
    setPrincipalSNAnexoPost(params.Anexo?.PrincipalSN || false);
    setDesativadoSNAnexoPost(params.Anexo?.DesativadoSN || false);
    setDisableEditar(true);
    setModalOptions(true);
  };

  const handleCheckboxChange = (usuario, isChecked) => {
    if (isChecked) {
      setUsuariosSelecionados((prev) => [...prev, usuario]);
    } else {
      setUsuariosSelecionados((prev) =>
        prev.filter((u) => u.Id !== usuario.Id)
      );
    }
  };

  const desativarUsuariosSelecionados = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      localStorage.clear();
      navigate("/");
      return;
    }

    const usuariosParaDesativar = usuariosSelecionados.map((usuario) => ({
      ...usuario,
      DesativadoSN: true,
      Anexo: usuario.Anexo
        ? {
            ...usuario.Anexo,
            DesativadoSN: true,
          }
        : {},
    }));

    axios
      .put(endpoints.putAtualizarPessoas, usuariosParaDesativar, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setAvisoDesativadoOpen(true);
        setUsuariosSelecionados([]);
        fetchUsuarios();
        handleFecharDesativarTodos();
      })
      .finally(() => setLoading(false));
  };

  const colorsRoot = {
    cinzaClaro: "#e7e7e7",
    cinzaLeve: "#e8e8e8",
    cinzaSelecionado: "#9E9E9E",
    cinzaTexto: "#404040",
    cinxaTextoSecundario: "#696969",

    azulClaro: "#E3F2FD",
    azulLeve: "#2196F3",
    azulSelecionado: "#1976D2",
    azulTexto: "#226fbd",

    amareloClaro: "#fef2e2",
    amareloLeve: "#FFEB3B",
    amareloSelecionado: "#FFC107",
    amareloTexto: "#e99b25",

    vermelhoClaro: "#ffebec",
    vermelhoLeve: "#F44336",
    vermelhoSelecionado: "#D32F2F",
    vermelhoTexto: "#ba1322",

    verdeClaro: "#e8ffe3",
    verdeLeve: "#8BC34A",
    verdeSelecionado: "#689F38",
    verdeTexto: "#186105",
  };

  const handleEditavel = () => {
    setDisableEditar(false);
  };

  const GridFiltros = styled(Grid)(({ theme }) => ({
    width: "20%",
  }));

  const BoxFiltros = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "95px",
    boxShadow: "0px",
  }));

  const CardFiltros = styled(Card)(({ theme }) => ({
    width: "100%",
    height: "100%",
    padding: "10px 10px 0px 10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "none",
  }));

  return (
    <div className="MainDash">
      <Box
        // container
        // spacing={2}
        sx={{
          padding: "0 10px",
          overflowY: "auto",
          width: "auto",
          height: "100%",
          minWidth: "80%",
        }}
        flexDirection={"column"}
      >
        <Box marginBottom={"10px"}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                color={colorsRoot.cinxaTextoSecundario}
                sx={{
                  fontSize: "17px",
                  fontWeight: "500",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Filtros
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid spacing={2} container>
                <GridFiltros item>
                  <BoxFiltros>
                    <CardFiltros
                      sx={{
                        backgroundColor: colorsRoot.cinzaClaro,
                        color: colorsRoot.cinzaTexto,
                        boxShadow: "none",
                      }}
                    >
                      <div className="FlexEsquerda">
                        <Typography>Todos</Typography>
                      </div>
                      <div className="FlexDireita">
                        <h5>5</h5>
                      </div>
                    </CardFiltros>
                  </BoxFiltros>
                </GridFiltros>

                <GridFiltros item>
                  <BoxFiltros>
                    <CardFiltros
                      sx={{
                        backgroundColor: colorsRoot.azulClaro,
                        color: colorsRoot.azulTexto,
                        boxShadow: "none",
                      }}
                    >
                      <div className="FlexEsquerda">
                        <Typography>Administrador</Typography>
                      </div>
                      <div className="FlexDireita">
                        <h5>1</h5>
                      </div>
                    </CardFiltros>
                  </BoxFiltros>
                </GridFiltros>

                <GridFiltros item>
                  <BoxFiltros>
                    <CardFiltros
                      sx={{
                        backgroundColor: colorsRoot.amareloClaro,
                        color: colorsRoot.amareloTexto,
                        boxShadow: "none",
                      }}
                    >
                      <div className="FlexEsquerda">
                        <Typography>Intermediario</Typography>
                      </div>
                      <div className="FlexDireita">
                        <h5>2</h5>
                      </div>
                    </CardFiltros>
                  </BoxFiltros>
                </GridFiltros>

                <GridFiltros item>
                  <BoxFiltros>
                    <CardFiltros
                      sx={{
                        backgroundColor: colorsRoot.vermelhoClaro,
                        color: colorsRoot.vermelhoTexto,
                        boxShadow: "none",
                      }}
                    >
                      <div className="FlexEsquerda">
                        <Typography>Cadastros</Typography>
                      </div>
                      <div className="FlexDireita">
                        <h5>1</h5>
                      </div>
                    </CardFiltros>
                  </BoxFiltros>
                </GridFiltros>

                <GridFiltros item>
                  <BoxFiltros>
                    <CardFiltros
                      sx={{
                        backgroundColor: colorsRoot.verdeClaro,
                        color: colorsRoot.verdeTexto,
                        boxShadow: "none",
                      }}
                    >
                      <div className="FlexEsquerda">
                        <Typography>Confinamento</Typography>
                      </div>
                      <div className="FlexDireita">
                        <h5>1</h5>
                      </div>
                    </CardFiltros>
                  </BoxFiltros>
                </GridFiltros>
              </Grid>
              <div
                style={{
                  display: "flex",
                  width: "calc(40% - 10px)",
                  marginTop: "15px",
                }}
              >
                <TextField
                  placeholder="Pesquise por código, nome, apelido ou email"
                  inputProps={{ "aria-label": "search" }}
                  type="text"
                  fullWidth
                  size="small"
                  defaultValue={searchValue}
                  value={searchValue}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <GridSearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* TABELA */}
        <Box item>
          <Card sx={{ width: "100%", height: "100%" }}>
            <Box
              minHeight={"500px"}
              component="form"
              sx={{
                width: "auto",
                height: "100%",
                bgcolor: "#ffff",
                borderRadius: 1,
                boxShadow: 24,
                padding: "10px 10px 10px 0px",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "5px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              <Box sx={{ width: "100%" }}>
                <table className="styled-table">
                  <thead
                    style={{
                      position: "sticky",
                      top: "-10px",
                      zIndex: 2,
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    <tr>
                      <th></th>
                      <th>Código</th>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Nível</th>
                      <th>Data Cadastro</th>
                    </tr>
                  </thead>
                  <tbody style={{ maxHeight: "400px", overflow: "auto" }}>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>
                          <Checkbox
                            {...label}
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
                            onChange={(e) =>
                              handleCheckboxChange(usuario, e.target.checked)
                            }
                          />
                        </td>
                        <td
                          style={{ textAlign: "center" }}
                          onClick={() => handleRowClick(usuario)}
                        >
                          {String(usuario.id).padStart(3, "0") ||
                            "indisponível"}
                        </td>
                        <td onClick={() => handleRowClick(usuario)}>
                          <div className="topNome">
                            <div className="PerfilAnexo">
                              {usuario.Anexo ? (
                                <img style={{ borderRadius: "50%", width: 30 }} src={usuario.Anexo.Base64 || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnF-wtqndIensQ2gIC-2KZPTJw_bTGZ50qNA&s"} alt="Perfil" />
                              ) : (
                                <img style={{ borderRadius: "50%", width: 30 }} src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnF-wtqndIensQ2gIC-2KZPTJw_bTGZ50qNA&s"} alt="Perfil" />
                              )}
                            </div>

                            <div className="nomeCompleto">
                              <div className="Nome">
                                {usuario.Nome || "indisponível"}
                              </div>
                              <div className="Apelido">
                                {usuario.Apelido || "indisponível"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td onClick={() => handleRowClick(usuario)}>
                          {usuario.Email || "indisponível"}
                        </td>
                        <td onClick={() => handleRowClick(usuario)}>
                          {usuario.nivel || "indisponível"}
                        </td>
                        <td onClick={() => handleRowClick(usuario)}>
                          {usuario.dataCadastro ||
                            "01/08/2024 às 11:01:31 (-03:00)"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Box>
          </Card>
        </Box>

        <Snackbar
          open={avisoAdicionado}
          autoHideDuration={6000}
          onClose={handleFecharAddAviso}
          severity="success"
        >
          <Alert
            onClose={handleFecharAddAviso}
            severity="success"
            variant="filled"
            sx={{ width: "100%", alignItems: "center" }}
          >
            Usuário adicionado com sucesso!
          </Alert>
        </Snackbar>

        <Snackbar
          open={AvisoDesativadoOpen}
          autoHideDuration={6000}
          onClose={handleFecharAviso}
          severity="success"
        >
          <Alert
            onClose={handleFecharAviso}
            severity="success"
            variant="filled"
            sx={{ width: "100%", alignItems: "center" }}
          >
            O usuário {UsuarioRemovido} foi desativado com sucesso!
          </Alert>
        </Snackbar>

        <Snackbar
          open={avisoEditado}
          autoHideDuration={6000}
          onClose={handleFecharEditAviso}
          severity="success"
        >
          <Alert
            onClose={handleFecharEditAviso}
            severity="success"
            variant="filled"
            sx={{ width: "100%", alignItems: "center" }}
          >
            O usuário de ID {usuarioClicadoTable.Id} foi editado com sucesso!
          </Alert>
        </Snackbar>

        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <CircularProgress className="loader1" size={100} />
          </Box>
        )}

        {/* BOTOES */}
        <Box
          fullWidth
          marginTop={"10px"}
          display={"flex"}
          justifyContent={"flex-end"}
        >
          <Box
            fullWidth
            marginTop={"10px"}
            display={"flex"}
            justifyContent={"flex-end"}
          >
            {usuariosSelecionados.length > 0 && (
              <Button
                variant="contained"
                sx={{
                  height: "35px",
                  backgroundColor: "#ff2020",
                  marginLeft: "10px",
                  "&:hover": {
                    backgroundColor: "#d02626",
                  },
                }}
                startIcon={<Delete />}
                onClick={handleConfirmarDesativarTodos}
              >
                Desativar Usuarios
              </Button>
            )}

            <Button
              sx={{
                height: "35px",
                backgroundColor: "#1a76d3",
                marginLeft: "10px",
                "&:hover": {
                  backgroundColor: "#164e8d",
                },
              }}
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={OpenModalAddUser}
            >
              Adicionar
            </Button>

            <Button
              sx={{
                height: "35px",
                backgroundColor: "#08b98f",
                marginLeft: "10px",
                "&:hover": {
                  backgroundColor: "#009a77",
                },
              }}
              variant="contained"
              startIcon={<Print />}
              onClick={() => setModalOpen((prev) => !prev)}
            >
              Imprimir
            </Button>

            <Button
              sx={{
                height: "35px",
                backgroundColor: "#d29a45",
                marginLeft: "10px",
                "&:hover": {
                  backgroundColor: "#a77a35",
                },
              }}
              variant="contained"
              startIcon={<DriveFileMove />}
              onClick={() => setModalOpen((prev) => !prev)}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        {/* MODAL ADICIONAR USUARIOS */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModalAddUser}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            component="form"
            onSubmit={AdicionarUsuario}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "#ffff",
              borderRadius: 1,
              boxShadow: 24,
              padding: "16px 20px 16px 20px",
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Inserir Usuário
            </Typography>
            <Box noValidate autoComplete="off" sx={{ mt: 2, overflow: "auto" }}>
              <TextField
                fullWidth
                margin="normal"
                label="Nome"
                className="input"
                variant="outlined"
                name="NomePost"
                value={NomePost}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
                sx={{ marginTop: "8px" }}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                name="EmailPost"
                value={EmailPost}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
                sx={{ marginTop: "8px" }}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Apelido"
                variant="outlined"
                name="ApelidoPost"
                value={ApelidoPost}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
                required
                sx={{ marginTop: "8px" }}
              />
              <TextField
                fullWidth
                required
                margin="normal"
                label="Senha"
                type="password"
                variant="outlined"
                name="SenhaPost"
                value={SenhaPost}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
                sx={{ marginTop: "8px" }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Confirmar Senha"
                type="password"
                variant="outlined"
                name="SenhaConfirmada"
                value={senhaConfirmada}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
                sx={{ marginTop: "8px" }}
                error={SenhaPost !== senhaConfirmada}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button onClick={handleCloseModalAddUser} sx={{ mr: 1 }}>
                  Cancelar
                </Button>
                <Button
                  disabled={SenhaPost !== senhaConfirmada}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Adicionar
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* MODAL DETALHES/EDITAR USUÁRIO */}
        <Modal open={modalOptions} onClose={() => fecharModalOptions}>
          <Box
            component="form"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "#ffff",
              borderRadius: 1,
              boxShadow: 24,
              padding: "16px 20px 16px 20px",
              height: "auto",
            }}
          >
            <div style={{width: "100%", height: "11px"}}>
             <IconButton onClick={fecharModalOptions}>
                <Close color="error" />
              </IconButton>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
             
              <Typography
                variant="h6"
                color={disableEditar ? "success" : "primary"}
                sx={{ marginBottom: 0, textAlign: "center" }}
              >
                {disableEditar ? "Detalhes do Usuário" : "Editar Usuario"}
              </Typography>

              
            </div>

            <Box noValidate autoComplete="off" sx={{ mt: 2, overflow: "auto" }}>
              <TextField
                fullWidth
                margin="normal"
                label="Nome"
                variant="outlined"
                name="NomePost"
                value={NomePost}
                onChange={handleChange}
                sx={{ marginTop: "8px" }}
                required
                disabled={disableEditar}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                name="EmailPost"
                type="email"
                value={EmailPost}
                onChange={handleChange}
                sx={{ marginTop: "8px" }}
                required
                disabled={disableEditar}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Apelido"
                variant="outlined"
                name="ApelidoPost"
                value={ApelidoPost}
                onChange={handleChange}
                required
                disabled={disableEditar}
                sx={{ marginTop: "8px" }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="contained"
                  onClick={handleConfirmarDesativarUnico}
                  color="error"
                  sx={{ width: "48%" }}
                >
                  Desativar
                </Button>
                <Button
                  
                  // type={disableEditar ? "button" : "submit"}
                  variant="contained"
                  color="primary"
                  onClick={disableEditar ? handleEditavel : EditarUsuario}
                  sx={{ width: "48%" }}
                >
                  {disableEditar ? "Editar" : "Salvar"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* MODAL DE AVISO PARA DESATIVAR USUARIO UNICO */}
        <Modal
          open={confirmaDesativarUnico}
          onClose={handleFecharDesativarUnico}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "auto",
              bgcolor: "#ffff",
              borderRadius: 1,
              boxShadow: 24,
              padding: "16px 20px 16px 20px",
              height: "auto",
            }}
          >
            <Typography>
              Tem certeza que deseja desativar {usuarioClicadoTable.Nome}?
            </Typography>
            <Button onClick={handleFecharDesativarUnico}>Não</Button>
            <Button
              onClick={handleDesativarUsuario}
              color="error"
              variant="contained"
            >
              Sim
            </Button>
          </Box>
        </Modal>

        {/* MODAL DE AVISO PARA DESATIVAR TODOS OS USUÁRIOS SELECIONADOS */}
        <Modal
          open={confirmaDesativarTodos}
          onClose={handleFecharDesativarTodos}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "auto",
              bgcolor: "#ffff",
              borderRadius: 1,
              boxShadow: 24,
              padding: "16px 20px 16px 20px",
              height: "auto",
            }}
          >
            <Typography>
              Tem certeza que deseja desativar os usuarios selecionados?
            </Typography>
            <Button onClick={handleFecharDesativarTodos}>Não</Button>
            <Button
              onClick={desativarUsuariosSelecionados}
              color="error"
              variant="contained"
            >
              Sim
            </Button>
          </Box>
        </Modal>
      </Box>
    </div>
  );
}

export default ListarUsuarios;
