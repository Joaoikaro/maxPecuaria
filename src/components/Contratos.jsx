/* eslint-disable no-unused-vars */
import "../styles/Contratos.css";
import { format } from "date-fns";
import $ from "jquery";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Form from "react-bootstrap/Form";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Modal,
  TableFooter,
} from "@mui/material";
import axios from "axios";
import { Input } from "@mui/joy";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconVendas from "../iconesContratos/iconVendas.png";
import IconCompras from "../iconesContratos/iconCompras.png";
import KG from "../iconesContratos/iconKG.png";
import DataGlobal from "./globalData";
import QuantidadeChart from "./graficoQuantidade";
import ValorChart from "./graficoValor";
import Cargas from "./Cargas.jsx";
import Cards from "./Cards.jsx";
import { Option } from "@mui/base";

function Contratos() {
  const navigate = useNavigate();
  const [Contratos, setContratos] = useState([]);
  const [graficosAno, setGraficosAno] = useState([]);
  const currentDate = new Date().toISOString();
  const dataMesInicio = format(currentDate, "yyyy/01/01");
  const currentDateFormatted = format(currentDate, "yyyy/MM/dd");
  const [DataInicial, setStartDate] = useState(dataMesInicio);
  const [DataFinal, setEndDate] = useState(currentDateFormatted);
  const [graficosQuantidade, setGraficosQuantidade] = useState([]);
  const {
    defaultFinal,
    defaultInicial,
    dataInicialGrafico,
    setDataInicialGrafico,
    dataFinalGrafico,
    setDataFinalGrafico,
    tipoContratoGrafico,
    setTipoContratoGrafico,
    setTipoAgrupamentoPessoaProduto,
    TipoAgrupamentoPessoaProduto,
    tipoGrafico,
    loading,
    setLoading,
    setTipoGrafico,
  } = DataGlobal();
  const [esconder, setEsconder] = useState(0);
  const [tipoAgrupamento, setTipoAgrupamento] = useState(null);
  const [tipo, setTipo] = useState("quantidade");
  const [agrupamentoNumero, setAgrupamentoNumero] = useState();

  /!Essa função formata os numero em valor de Real, tipo (324.756,00)!/;
  const formaSaldo = (saldo) => {
    return parseFloat(saldo).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarNumero = (numero) => {
    // Verifica se é um número válido
    if (isNaN(numero)) {
      return "Número inválido";
    }

    const partes = numero.toString().split(".");
    let parteInteira = partes[0];
    let parteDecimal = partes.length > 1 ? "." + partes[1] : "";

    parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return parteInteira + parteDecimal;
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const data = {
      DataInicial: format(dataInicialGrafico, "yyyy/MM/dd"),
      DataFinal: format(dataFinalGrafico, "yyyy/MM/dd"),
      IdTipoAgrupamento: TipoAgrupamentoPessoaProduto,
      TipoContrato: tipoContratoGrafico,
      TipoAgrupamento: TipoAgrupamentoPessoaProduto,
    };

    const url = `https://www.gerentemax.somee.com/Dashboard/Contratos/ListarPorPeriodoAgrupado`;

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setLoading(false);
        setGraficosQuantidade(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataInicialGrafico,
    setDataInicialGrafico,
    dataFinalGrafico,
    setDataFinalGrafico,
    TipoAgrupamentoPessoaProduto,
    setTipoAgrupamentoPessoaProduto,
    defaultFinal,
    defaultInicial,
    tipoContratoGrafico,
    setTipoContratoGrafico,
    TipoAgrupamentoPessoaProduto,
    setTipoGrafico,
    TipoAgrupamentoPessoaProduto,
  ]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    const url = `https://www.gerentemax.somee.com/Dashboard/Contratos/ListarContratos_TipoAgrup`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setLoading(false);
        setAgrupamentoNumero(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const abrirMenus = () => {
    const sidebar = $(".Sidebar");
    if (sidebar.is(":visible")) {
      sidebar.stop().fadeOut(10);
    } else {
      sidebar.stop().fadeIn(10);
    }
  };

  useEffect(() => {
    abrirMenus();
  }, []);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    const data = {
      DataInicial: format(DataInicial, "yyyy/MM/dd"),
      DataFinal: format(DataFinal, "yyy/MM/dd"),
      IdTipoAgrupamento: tipoContratoGrafico,
      TipoContrato: TipoAgrupamentoPessoaProduto,
    };

    const url = `https://www.gerentemax.somee.com/Dashboard/Contratos/ListarPorPeriodo`;

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log("response do post ListarPorPeriodo", response.data)
        setContratos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    DataFinal,
    setEndDate,
    DataInicial,
    setStartDate,
    TipoAgrupamentoPessoaProduto,
    setTipoAgrupamentoPessoaProduto,
    tipoContratoGrafico,
    setTipoContratoGrafico,
    tipo,
    setTipo,
    navigate,
    TipoAgrupamentoPessoaProduto,
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  const handleSubmitChart = (event) => {
    event.preventDefault();
  };

  const GraficoAnoDebito = graficosAno
    .map((item) => {
      return item.Debito !== null && item.SaldoInicialSN === false
        ? item.Debito
        : null;
    })
    .filter((value) => value !== null);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  //! FOOTER - VALORES
  const VlScTonNUM = Contratos.reduce((acumulador, contrato) => {
    return acumulador + contrato.VlScTon;
  }, 0);

  const VlTotalCarregadoNUM = Contratos.reduce((acumulador, contrato) => {
    return acumulador + contrato.VlTotalCarregado;
  }, 0);

  const VlPagamentosNUM = Contratos.reduce((acumulador, contrato) => {
    return acumulador + contrato.VlTotalPagtos;
  }, 0);

  const VlsaldoNUM = Contratos.reduce((acumulador, contrato) => {
    return acumulador + contrato.VlTotalSaldo;
  }, 0);

  //! FOOTER - QUANTIDADES
  const QtdeTotalContratoNUM = Contratos.reduce((acumulador, contrato) => {
    return acumulador + contrato.QtdeTotalContrato;
  }, 0);

  const QtdeTotalCarregadoNUM = Contratos.reduce((acumulador, contrato) => {
    return acumulador + contrato.QtdeTotalCarregado;
  }, 0);

  const QtdeTotalPagtosNUM = Contratos.reduce((acumulador, contrato) => {
    return acumulador + contrato.QtdeTotalPagtos;
  }, 0);

  const QtdeTotalSaldoNUM = Contratos.reduce((acumulador, contrato) => {
    return acumulador + contrato.QtdeTotalSaldo;
  }, 0);

  const handleCardClick = (agrupamentoId, TipoContratoCard) => {
    setTipoContratoGrafico(agrupamentoId);
    setTipoAgrupamentoPessoaProduto(TipoContratoCard);
  };

  return (
    <div className="Main">
      <div
        style={{
          height: "1vh",
          maxHeight: "50px",
          minHeight: "20px",
          width: "100%",
        }}
      >
        <p> </p>
      </div>
      <div className="Grid">
        <Grid container spacing={2} sx={{ width: "90%", height: "100%" }}>
          <div
            className="filtros"
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "row",
              width: "100%",
              height: "auto",
              justifyContent: "flex-end",
            }}
          >
            <div className="TipoContainer">
              <TableCell
                className="Data-input"
                sx={{ borderBottom: "none", padding: "0" }}
              >
                <form
                  onChange={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label>Data Inicial</label>

                    <Input
                      type="date"
                      label="Data Inicial"
                      defaultValue={defaultInicial}
                      onBlur={(event) => setStartDate(event.target.value)}
                      slotProps={{
                        input: {
                          min: "1990-01-01",
                          max: "2099-12-31",
                        },
                      }}
                      placeholder="Data Inicial"
                      size="small"
                      style={{
                        marginRight: "10px",
                        color: "#676A6C",
                        borderRadius: "5px",
                        background: "#ffff",
                        width: "120px",
                        height: "30px",
                        boxShadow: "none",
                        padding: "5px",
                        lineHeight: "1.4375em",
                        border: "1px solid rgba(195, 195, 195)",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label>Data Final</label>
                    <Input
                      type="date"
                      label="Data Final"
                      defaultValue={defaultFinal}
                      onBlur={(event) => setEndDate(event.target.value)}
                      placeholder="Data Final"
                      slotProps={{
                        input: {
                          min: "1990-01-01",
                          max: "2099-12-31",
                        },
                      }}
                      size="small"
                      style={{
                        color: "#676A6C",
                        background: "#ffff",
                        boxShadow: "none",
                        width: "120px",
                        height: "30px",
                        padding: "5px",
                        lineHeight: "1.4375em",
                        border: "1px solid rgba(195, 195, 195)",
                      }}
                    />
                  </div>
                </form>
              </TableCell>
            </div>
          </div>
          <Cards
            onCardClick={handleCardClick}
            DataInicial={DataInicial}
            DataFinal={DataFinal}
          />
          <form style={{ flexDirection: "row", justifyContent: "flex-end", width: "100%", height: "50px", flexWrap: "wrap", alignContent: "flex-start" }}>
            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
              {/* <InputLabel>Exibir</InputLabel> */}
              <label>Exibir</label>
              <Form.Select
                style={{
                  height: "30px",
                  borderRadius: "5px",
                  lineHeight: "1.4375em",
                  border: "1px solid rgba(195, 195, 195)",
                }}
                value={tipo}
                label="Exibir"
                onChange={(event) => {
                  // console.log(event.target);
                  if (event.target.value == "valores") {
                    setEsconder(0);
                  } else if (event.target.value == "quantidade") {
                    setEsconder(1);
                  } else if (event.target.value == "valor") {
                    setEsconder(2);
                  } else {
                    console.log("Tu é burro");
                  }
                  setTipo(event.target.value);
                }}
              >
                <option value={"valores"}>Valores</option>
                <option value={"quantidade"}>Quantidades e Valores</option>
              </Form.Select>
            </FormControl>

            <FormControl
              sx={{
                m: 1,
                minWidth: 150,
                margin: "0px",
              }}
              size="small"
            >
              <label>Agrupar</label>

              <Form.Select
                style={{
                  height: "30px",
                  borderRadius: "5px",
                  lineHeight: "1.4375em",
                  border: "1px solid rgba(195, 195, 195)",
                }}
                id="demo-select-small"
                value={TipoAgrupamentoPessoaProduto}
                label="Agrupar"
                onChange={(event) =>
                  setTipoAgrupamentoPessoaProduto(event.target.value)
                }
              >
                <option value={"PRODUTO"}>Produto</option>
                <option value={"PESSOA"}>Pessoa</option>
              </Form.Select>
            </FormControl>
          </form>

          <Grid
            item
            xs={12}
            md={12}
            sm={12}
            height={550}
            className="container-G"
          >
            <TableContainer
              component={Paper}
              className="TableContainerContratos-G"
              sx={{
                boxShadow: "-3px 3px 5px 1px #0000001c",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="Periodo-container"
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <Table
                  sx={{ borderBottom: "none", height: "100%" }}
                  className="Table-G"
                >
                  <TableHead className="headerContratos-G">
                    {tipo == "valores" ? (
                      <TableRow
                        className="header-G Contrato-G"
                        sx={{
                          borderBottom: "1px solid #0000001c",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          height: "45px",
                          backgroundColor: "#e8e8e8",
                        }}
                      >
                        <div
                          className="esquerdaHeader"
                          style={{ minWidth: "650px", maxWidth: "650px" }}
                        >
                          <TableCell
                            className="enchimento"
                            style={{
                              maxWidth: "150px",
                              minWidth: "150px",
                              textAlign: "left",
                              padding: "16px",
                            }}
                          >
                            <p>Nº Contrato</p>
                          </TableCell>
                          <TableCell
                            className="Data-Header"
                            style={{
                              maxWidth: "100px",
                              minWidth: "100px",
                              textAlign: "left",
                              padding: "16px",
                            }}
                          >
                            <p>Produto</p>
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              fontWeight: "700",
                              fontSize: "12px",
                              color: "#676a6c",
                              position: "relative",
                              right: "0",
                              width: "100%",
                              textAlign: "left",
                              padding: "16px",
                            }}
                          >
                            <p>Cliente</p>
                          </TableCell>
                        </div>
                        <div className="direitaHeader">
                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Valor Sc/Tn</p>
                          </TableCell>
                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Total Carregado</p>
                          </TableCell>
                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Total Pagamentos</p>
                          </TableCell>
                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Total Saldo</p>
                          </TableCell>
                        </div>
                      </TableRow>
                    ) : (
                      <TableRow
                        className="header-G Contrato-G"
                        sx={{
                          borderBottom: "1px solid #0000001c",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          height: "45px",
                          backgroundColor: "#e8e8e8",
                        }}
                      >
                        <div
                          className="esquerdaHeader"
                          style={{ minWidth: "450px", maxWidth: "450px" }}
                        >
                          <TableCell
                            className="enchimento"
                            style={{
                              maxWidth: "170px",
                              minWidth: "170px",
                              textAlign: "left",
                              paddingLeft: "16px",
                            }}
                          >
                            <p>Nº Contrato</p>
                          </TableCell>

                          <TableCell
                            style={{
                              borderBottom: "none",
                              fontWeight: "700",
                              fontSize: "12px",
                              color: "#676a6c",
                              position: "relative",
                              right: "0",
                              width: "100%",
                              textAlign: "left",
                              paddingLeft: "16px",
                            }}
                          >
                            <p>Cliente</p>
                          </TableCell>
                        </div>
                        <div className="direitaHeader">
                          <TableCell
                            style={{
                              width: "150px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Valor Sc/Tn</p>
                          </TableCell>

                          <TableCell
                            style={{
                              width: "150px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Total Contrato(Kg)</p>
                          </TableCell>

                          <TableCell
                            style={{
                              width: "170px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Total Carregado(Kg)</p>
                          </TableCell>

                          <TableCell
                            style={{
                              width: "150px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>À Carregar(Kg)</p>
                          </TableCell>

                          <TableCell
                            style={{
                              width: "170px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Total Carregado(R$)</p>
                          </TableCell>

                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Total Pagamentos(R$)</p>
                          </TableCell>

                          <TableCell
                            style={{
                              width: "150px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p>Total Saldo(R$)</p>
                          </TableCell>
                        </div>
                      </TableRow>
                    )}
                  </TableHead>

                  <TableBody className="ContainerTable-G">
                    {tipo == "valores" ? (
                      <div
                        className="ContainerTable-G"
                        style={{ borderBottom: "1px solid #0000001c" }}
                      >
                        {Contratos.map((contrato) => (
                          <TableRow
                            key={contrato.IdRegistro}
                            className="LinhaContratos-G"
                          >
                            <div
                              className="contratosEsquerda"
                              style={{
                                width: "700px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TableCell
                                className="Tipo"
                                style={{
                                  borderBottom: "none",
                                  minWidth: "150px",
                                  maxWidth: "150px",
                                  heigth: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    height: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <p>{contrato.NContrato}</p>
                                </div>
                              </TableCell>

                              <TableCell
                                className="DataContrato"
                                style={{
                                  borderBottom: "none",
                                  width: "100px",
                                  textAlign: "left",
                                  paddingLeft: "16px",
                                }}
                              >
                                <p>{contrato.Produto}</p>
                              </TableCell>

                              <TableCell
                                className="containerCliente"
                                style={{
                                  borderBottom: "none",
                                  width: "400px",
                                }}
                              >
                                <p className="Pessoa" style={{ width: "100%" }}>
                                  {contrato.Pessoa}
                                </p>
                              </TableCell>
                            </div>

                            <div className="contratosDireita">
                              <div className="contratosDireita">
                                {/* Valor Sc/Contrato */}
                                <TableCell
                                  className="QtdTotalContrato valor"
                                  style={{
                                    borderBottom: "none",
                                    width: "180px",
                                    padding: "16px",
                                  }}
                                >
                                  <p
                                    style={{
                                      color:
                                        contrato.VlTotalContrato < 0
                                          ? "red"
                                          : contrato.VlTotalContrato > 0
                                          ? "#676a6c"
                                          : "#676a6c",
                                    }}
                                  >
                                    {formaSaldo(contrato.VlScTon).replace(
                                      "R$",
                                      ""
                                    )}
                                  </p>
                                </TableCell>

                                {/* Total Carregado */}
                                <TableCell
                                  className="QtdTotalCarregado valor"
                                  style={{
                                    borderBottom: "none",
                                    width: "180px",
                                    padding: "16px",
                                  }}
                                >
                                  <p
                                    style={{
                                      color:
                                        contrato.VlTotalCarregado < 0
                                          ? "#ff0000e0"
                                          : contrato.VlTotalCarregado > 0
                                          ? "#676a6c"
                                          : "#676a6c",
                                    }}
                                  >
                                    {formaSaldo(
                                      contrato.VlTotalCarregado
                                    ).replace("R$", "")}
                                  </p>
                                </TableCell>
                                {/* Pagamentos */}
                                <TableCell
                                  className="QtdTotalPagamentos valor"
                                  style={{
                                    borderBottom: "none",
                                    width: "180px",
                                    padding: "16px",
                                  }}
                                >
                                  <p
                                    style={{
                                      color:
                                        contrato.VlTotalPagtos < 0
                                          ? "#ff0000e0"
                                          : contrato.VlTotalPagtos > 0
                                          ? "#676a6c"
                                          : "#676a6c",
                                    }}
                                  >
                                    {formaSaldo(contrato.VlTotalPagtos).replace(
                                      "R$",
                                      ""
                                    )}
                                  </p>
                                </TableCell>
                                {/* Saldo */}
                                <TableCell
                                  className="QtdTotalSaldo valor"
                                  style={{
                                    borderBottom: "none",
                                    width: "180px",
                                    padding: "16px",
                                  }}
                                >
                                  <p
                                    style={{
                                      color:
                                        contrato.VlTotalSaldo < 0
                                          ? "#ff0000e0"
                                          : contrato.VlTotalSaldo > 0
                                          ? "#676a6c"
                                          : "#676a6c",
                                    }}
                                  >
                                    {formaSaldo(contrato.VlTotalSaldo).replace(
                                      "R$",
                                      ""
                                    )}
                                  </p>
                                </TableCell>
                              </div>
                            </div>
                          </TableRow>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="ContainerTable-G"
                        style={{ borderBottom: "1px solid #0000001c" }}
                      >
                        {Contratos.map((contrato) => (
                          <TableRow
                            key={contrato.IdRegistro}
                            className="LinhaContratos-G"
                          >
                            <div
                              className="contratosEsquerda"
                              style={{
                                minWidth: "450px",
                                maxWidth: "450px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TableCell
                                className="Tipo"
                                style={{
                                  borderBottom: "none",
                                  minWidth: "170px",
                                  maxWidth: "170px",
                                  heigth: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <p>{contrato.NContrato}</p>
                              </TableCell>

                              <TableCell
                                className="containerCliente"
                                style={{
                                  borderBottom: "none",
                                  width: "100%",
                                }}
                              >
                                <p className="Pessoa" style={{ width: "100%" }}>
                                  {contrato.Pessoa}
                                </p>
                              </TableCell>
                            </div>

                            <div className="contratosDireita">
                              {/* VlScTon */}
                              <TableCell
                                className="VlTotalContrato valor"
                                style={{
                                  borderBottom: "none",
                                  textAlign: "end",
                                  padding: "16px",
                                  width: "150px",
                                }}
                              >
                                <p
                                  style={{
                                    color:
                                      contrato.VlScTon < 0
                                        ? "#FF4C51"
                                        : contrato.VlScTon > 0
                                        ? "#676a6c"
                                        : "#676a6c",
                                  }}
                                >
                                  {formaSaldo(contrato.VlScTon)}
                                </p>
                              </TableCell>

                              {/* Total Contrato(Kg) */}
                              <TableCell
                                className="VlTotalContrato valor"
                                style={{
                                  borderBottom: "none",
                                  textAlign: "end",
                                  padding: "16px",
                                  width: "150px",
                                }}
                              >
                                <p
                                  style={{
                                    color:
                                      contrato.QtdeTotalContrato < 0
                                        ? "#FF4C51"
                                        : contrato.QtdeTotalContrato > 0
                                        ? "#676a6c"
                                        : "#676a6c",
                                  }}
                                >
                                  {formaSaldo(contrato.QtdeTotalContrato)}
                                </p>
                              </TableCell>

                              {/* Total Carregado(Kg) */}
                              <TableCell
                                className="VlTotalContrato valor"
                                style={{
                                  borderBottom: "none",
                                  textAlign: "end",
                                  padding: "16px",
                                  width: "170px",
                                }}
                              >
                                <p
                                  style={{
                                    color:
                                      contrato.QtdeTotalCarregado < 0
                                        ? "#FF4C51"
                                        : contrato.QtdeTotalCarregado > 0
                                        ? "#676a6c"
                                        : "#676a6c",
                                  }}
                                >
                                  {formaSaldo(contrato.QtdeTotalCarregado)}
                                </p>
                              </TableCell>

                              {/* À Carregar(Kg) */}
                              <TableCell
                                className="VlTotalCarregado valor"
                                style={{
                                  borderBottom: "none",
                                  textAlign: "end",
                                  width: "150px",
                                  padding: "16px",
                                }}
                              >
                                <p
                                  style={{
                                    color:
                                      contrato.VlTotalCarregado < 0
                                        ? "#FF4C51"
                                        : contrato.VlTotalCarregado > 0
                                        ? "#676a6c"
                                        : "#676a6c",
                                  }}
                                >
                                  {formaSaldo(contrato.VlTotalCarregado)}
                                </p>
                              </TableCell>

                              {/* Total Carregado(R$) */}
                              <TableCell
                                className="VlTotalPagamentos valor"
                                style={{
                                  borderBottom: "none",
                                  textAlign: "end",
                                  width: "170px",
                                  padding: "16px",
                                }}
                              >
                                <p
                                  style={{
                                    color:
                                      contrato.VlTotalPagtos < 0
                                        ? "#FF4C51"
                                        : contrato.VlTotalPagtos > 0
                                        ? "#676a6c"
                                        : "#676a6c",
                                  }}
                                >
                                  {formaSaldo(contrato.VlTotalPagtos)}
                                </p>
                              </TableCell>

                              {/* Total Pagamentos(R$) */}
                              <TableCell
                                className="VlTotalSaldo valor"
                                style={{
                                  borderBottom: "none",
                                  textAlign: "end",
                                  width: "180px",
                                  padding: "16px",
                                }}
                              >
                                <p
                                  style={{
                                    color:
                                      contrato.VlTotalSaldo < 0
                                        ? "#FF4C51"
                                        : contrato.VlTotalSaldo > 0
                                        ? "#676a6c"
                                        : "#676a6c",
                                  }}
                                >
                                  {formaSaldo(contrato.VlTotalSaldo)}
                                </p>
                              </TableCell>

                              {/* Total Saldo(R$) */}
                              <TableCell
                                className="Produto"
                                style={{ borderBottom: "none", width: "150px" }}
                              >
                                <p
                                  style={{
                                    color:
                                      contrato.QtdeTotalSaldo < 0
                                        ? "#FF4C51"
                                        : contrato.QtdeTotalSaldo > 0
                                        ? "#676a6c"
                                        : "#676a6c",
                                    textAlign: "end",
                                  }}
                                >
                                  {formaSaldo(contrato.QtdeTotalSaldo)}
                                </p>
                              </TableCell>
                            </div>
                          </TableRow>
                        ))}
                      </div>
                    )}
                  </TableBody>

                  <TableFooter>
                    <TableRow
                      className="header-G Contrato-G"
                      sx={{
                        borderBottom: "1px solid #0000001c",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        height: "50px",
                      }}
                    >
                      {/* ew */}
                      <div
                        className="esquerdaFooter"
                        style={{ maxWidth: "450px", minWidth: "450px" }}
                      >
                        <TableCell
                          className="enchimento"
                          style={{ width: "60px", padding: "16px" }}
                        >
                          <p></p>
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "none",
                            fontWeight: "700",
                            fontSize: "15px",
                            color: "#676A6C",
                            position: "relative",
                            right: "0",
                            width: "100%",
                            textAlign: "left",
                            padding: "16px",
                          }}
                        >
                          {/* <p>Totais:</p> */}
                        </TableCell>
                      </div>

                      {tipo == "valores" ? (
                        <div className="direitaFooter">
                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p
                              style={{
                                color:
                                  VlScTonNUM < 0
                                    ? "#FF4C51"
                                    : VlScTonNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(VlScTonNUM)}
                            </p>
                          </TableCell>

                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p
                              style={{
                                color:
                                  VlTotalCarregadoNUM < 0
                                    ? "#FF4C51"
                                    : VlTotalCarregadoNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                              }}
                            >
                              {formaSaldo(VlTotalCarregadoNUM)}
                            </p>
                          </TableCell>
                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p
                              style={{
                                color:
                                  VlPagamentosNUM < 0
                                    ? "#FF4C51"
                                    : VlPagamentosNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(VlPagamentosNUM)}
                            </p>
                          </TableCell>

                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p
                              style={{
                                color:
                                  VlsaldoNUM < 0
                                    ? "#FF4C51"
                                    : VlsaldoNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(VlsaldoNUM)}
                            </p>
                          </TableCell>
                        </div>
                      ) : (
                        <div className="direitaFooter">
                          {/* VlScTon */}
                          <TableCell
                            style={{
                              width: "150px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p
                              style={{
                                color:
                                  VlScTonNUM < 0
                                    ? "#FF4C51"
                                    : VlScTonNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(VlScTonNUM)}
                            </p>
                          </TableCell>

                          {/* Total Contrato(Kg) */}
                          <TableCell
                            style={{
                              width: "150px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p
                              style={{
                                color:
                                  QtdeTotalCarregadoNUM < 0
                                    ? "#FF4C51"
                                    : QtdeTotalCarregadoNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(QtdeTotalContratoNUM).replace(
                                "R$",
                                ""
                              )}
                              kg
                            </p>
                          </TableCell>

                          {/* Total Carregado(Kg) */}
                          <TableCell
                            style={{
                              width: "170px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p
                              style={{
                                color:
                                  QtdeTotalPagtosNUM < 0
                                    ? "#FF4C51"
                                    : QtdeTotalPagtosNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(QtdeTotalCarregadoNUM).replace(
                                "R$",
                                ""
                              )}
                              kg
                            </p>
                          </TableCell>

                          {/* À Carregar(Kg) */}
                          <TableCell
                            style={{
                              width: "150px",
                              textAlign: "right",
                              padding: "16px",
                            }}
                          >
                            <p
                              style={{
                                color:
                                  VlTotalCarregadoNUM < 0
                                    ? "#FF4C51"
                                    : VlTotalCarregadoNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(VlTotalCarregadoNUM).replace(
                                "R$",
                                ""
                              )}
                              kg
                            </p>
                          </TableCell>

                          {/* Total Carregado(R$) */}
                          <TableCell
                            style={{
                              width: "170px",
                              textAlign: "end",
                            }}
                          >
                            <p>{formaSaldo(VlPagamentosNUM)}</p>
                          </TableCell>

                          {/* Total Pagamentos(R$) */}
                          <TableCell
                            style={{
                              width: "180px",
                              textAlign: "end",
                            }}
                          >
                            <p>{formaSaldo(VlsaldoNUM)}</p>
                          </TableCell>

                          {/* Total Saldo(R$) */}
                          <TableCell
                            style={{
                              width: "150px",
                              textAlign: "end",
                            }}
                          >
                            <p>{formaSaldo(QtdeTotalSaldoNUM)}</p>
                          </TableCell>
                        </div>
                      )}
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </TableContainer>
          </Grid>
        </Grid>
        <Modal
          style={{ backgroundColor: "#00000045" }}
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

export default Contratos;
