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
  const [loading, setLoading] = useState(false);
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
    tipoAgrupamentoGrafico,
    setTipoAgrupamentoGrafico,
    tipoContratoGrafico,
    setTipoContratoGrafico,
    TipoAgrupamentoPessoaProduto,
    tipoGrafico,
    setTipoGrafico,
  } = DataGlobal();
  const [esconder, setEsconder] = useState(0);

  const [tipoAgrupamento, setTipoAgrupamento] = useState(null);
  const [tipo, setTipo] = useState("valores");
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
      TipoAgrupamento: tipoAgrupamentoGrafico,
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
    tipoAgrupamentoGrafico,
    setTipoAgrupamentoGrafico,
    defaultFinal,
    defaultInicial,
    tipoContratoGrafico,
    setTipoContratoGrafico,
    TipoAgrupamentoPessoaProduto,
    setTipoGrafico,
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

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    const data = {
      DataInicial: format(DataInicial, "yyyy/MM/dd"),
      DataFinal: format(DataFinal, "yyy/MM/dd"),
      IdTipoAgrupamento: tipoAgrupamentoGrafico,
      TipoContrato: tipoContratoGrafico,
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
    tipoAgrupamentoGrafico,
    setTipoAgrupamentoGrafico,
    tipoContratoGrafico,
    setTipoContratoGrafico,
    tipo,
    setTipo,
    navigate,
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

  const abrirMenus = () => {
    const sidebar = $(".Sidebar");

    if (sidebar.is(":visible")) {
      sidebar.stop().fadeOut(100);
    } else {
      sidebar.stop().fadeIn(300);
    }
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
  const VlContratoNUM = Contratos.reduce((acumulador, contrato) => {
    return acumulador + contrato.VlTotalContrato;
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

  return (
    <div className="Main">
      <div style={{ height: "50px", width: "100%" }}>
        <p></p>
      </div>
      <div className="Grid">
        <Grid container spacing={2} sx={{ width: "90%" }}>
          <div
            className="filtros"
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "row",
              width: "100%",
              height: "75px",
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
                  <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                    {/* <InputLabel >
                                      Contrato
                                    </InputLabel> */}
                    <label>Contrato</label>
                    <Form.Select
                      style={{
                        height: "30px",
                        borderRadius: "5px",
                        lineHeight: "1.4375em",
                        border: "1px solid rgba(195, 195, 195)",
                      }}
                      value={tipoContratoGrafico}
                      label="Contrato"
                      onChange={(event) =>
                        setTipoContratoGrafico(event.target.value)
                      }
                    >
                      <option
                        value={null}
                        style={{
                          color: "rgba(255, 0, 0, 0.88)",
                        }}
                      >
                        Todos
                      </option>
                      <option
                        value={1}
                        style={{
                          display:
                            tipoAgrupamentoGrafico == 1
                              ? "none"
                              : tipoAgrupamentoGrafico == 2
                              ? "none"
                              : "",
                        }}
                      >
                        Compras
                      </option>
                      <option
                        value={2}
                        style={{
                          display:
                            tipoAgrupamentoGrafico == 3
                              ? "none"
                              : tipoAgrupamentoGrafico == 4
                              ? "none"
                              : "",
                        }}
                      >
                        Vendas
                      </option>
                    </Form.Select>
                  </FormControl>

                  <FormControl
                    sx={{
                      minWidth: 150,
                    }}
                    size="small"
                  >
                    {/* <InputLabel>Agrupamento</InputLabel> */}
                    <label>Agrupamento</label>

                    <Form.Select
                      style={{
                        height: "30px",
                        borderRadius: "5px",
                        lineHeight: "1.4375em",
                        border: "1px solid rgba(195, 195, 195)",
                      }}
                      value={tipoAgrupamentoGrafico}
                      label="Agrupamento"
                      onChange={(event) => setTipoGrafico(event.target.value)}
                    >
                      <option
                        value={null}
                        style={{
                          color: "rgba(255, 0, 0, 0.88)",
                        }}
                      >
                        Todos
                      </option>
                      <option
                        value={1}
                        style={{
                          display: tipoContratoGrafico == 1 ? "none" : "",
                        }}
                      >
                        Clientes a receber
                      </option>
                      <option
                        value={2}
                        style={{
                          display: tipoContratoGrafico == 1 ? "none" : "",
                        }}
                      >
                        Clientes com Saldo
                      </option>
                      <option
                        value={3}
                        style={{
                          display: tipoContratoGrafico == 2 ? "none" : "",
                        }}
                      >
                        Fornecedores a Pagar
                      </option>
                      <option
                        value={4}
                        style={{
                          display: tipoContratoGrafico == 2 ? "none" : "",
                        }}
                      >
                        Adiantatamento a Fornecedores
                      </option>
                    </Form.Select>
                  </FormControl>
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
                      value={tipoAgrupamentoGrafico}
                      label="Agrupar"
                      onChange={(event) =>
                        setTipoAgrupamentoGrafico(event.target.value)
                      }
                    >
                      <option value={"PRODUTO"}>Produto</option>
                      <option value={"PESSOA"}>Pessoa</option>
                    </Form.Select>
                  </FormControl>
                </form>
              </TableCell>
            </div>
          </div>
          <Cards DataInicial={DataInicial} DataFinal={DataFinal} />

          <Grid
            item
            xs={12}
            md={12}
            sm={12}
            height={440}
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
                            fontSize: "15px",
                            color: "#7e7e7e",
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
                        {/* <TableCell
                          style={{
                            width: "156px",
                            textAlign: "center",
                          }}
                        >
                          <p>Produto</p>
                        </TableCell> */}
                      </div>
                    </TableRow>
                  </TableHead>

                  <TableBody className="ContainerTable-G">
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
                                  // backgroundColor:
                                  //   contrato.TipoContrato === "VENDA"
                                  //     ? "rgb(180 255 125 / 55%)"
                                  //     : "#87c3fe78",

                                  // color:
                                  //   contrato.TipoContrato === "VENDA"
                                  //     ? "#676a6c"
                                  //     : "rgb(25, 118, 210)",
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
                              <p
                                className="Pessoa"
                                style={{
                                  width: "100%",
                                  display: "none",
                                }}
                              >
                                {contrato.Pessoa}
                              </p>
                              <p className="Pessoa" style={{ width: "100%" }}>
                                {contrato.Pessoa}
                              </p>
                            </TableCell>
                          </div>
                          {tipo == "valores" ? (
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
                                    {formaSaldo(contrato.VlTotalContrato).replace(
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
                                    {formaSaldo(contrato.VlTotalCarregado).replace(
                                    "R$",
                                    ""
                                  )}
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
                                {/* Produto */}
                                {/* <TableCell
                                  className="Produto "
                                  style={{ borderBottom: "none" }}
                                >
                                  <div
                                    className="ContainerProduto"
                                    style={{
                                      backgroundColor:
                                        contrato.Produto === "MILHO"
                                          ? "#ecd60659"
                                          : contrato.Produto === "SOJA"
                                          ? "#c3d82552"
                                          : contrato.Produto === "TRIGO"
                                          ? "#ff8b004d"
                                          : contrato.Produto === "ALGODAO"
                                          ? "#a6d1e363"
                                          : contrato.Produto === "SORGO"
                                          ? "#ffa58963"
                                          : contrato.Produto ===
                                            "FARELO DE TRIGO"
                                          ? "#e3c7a65c"
                                          : "##80808057",
                                      color:
                                        contrato.Produto === "MILHO"
                                          ? "#b38f00"
                                          : contrato.Produto === "SOJA"
                                          ? "#8da600"
                                          : contrato.Produto === "TRIGO"
                                          ? "#cc7000"
                                          : contrato.Produto === "ALGODAO"
                                          ? "#759dbb"
                                          : contrato.Produto === "SORGO"
                                          ? "#cc7252"
                                          : contrato.Produto ===
                                            "FARELO DE TRIGO"
                                          ? "#b39f76"
                                          : "#606060",
                                    }}
                                  >
                                    <p style={{ fontWeight: "500" }}>
                                      {contrato.Produto}
                                    </p>
                                  </div>
                                </TableCell> */}
                              </div>
                            </div>
                          ) : tipo == "quantidade" ? (
                            <div className="contratosDireita">
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
                                      contrato.QtdeTotalContrato < 0
                                        ? "red"
                                        : contrato.QtdeTotalContrato > 0
                                        ? "#1976d2"
                                        : "#676a6c",
                                    width: "100%",
                                  }}
                                >
                                  {formaSaldo(
                                    contrato.QtdeTotalContrato
                                  ).replace("R$", "")}
                                  kg
                                </p>
                              </TableCell>
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
                                      contrato.QtdeTotalCarregado < 0
                                        ? "red"
                                        : contrato.QtdeTotalCarregado > 0
                                        ? "#1976d2"
                                        : "#676a6c",
                                    width: "100%",
                                  }}
                                >
                                  {formaSaldo(
                                    contrato.QtdeTotalCarregado
                                  ).replace("R$", "")}
                                  kg
                                </p>
                              </TableCell>
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
                                      contrato.QtdeTotalPagtos < 0
                                        ? "red"
                                        : contrato.QtdeTotalPagtos > 0
                                        ? "#1976d2"
                                        : "#676a6c",
                                    width: "100%",
                                  }}
                                >
                                  {formaSaldo(contrato.QtdeTotalPagtos).replace(
                                    "R$",
                                    ""
                                  )}
                                  kg
                                </p>
                              </TableCell>
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
                                      contrato.QtdeTotalSaldo < 0
                                        ? "#ff0000e0"
                                        : contrato.QtdeTotalSaldo > 0
                                        ? "#1976d2"
                                        : "#676a6c",
                                    width: "100%",
                                  }}
                                >
                                  {formaSaldo(contrato.QtdeTotalSaldo).replace(
                                    "R$",
                                    ""
                                  )}
                                  kg
                                </p>
                              </TableCell>
                              <TableCell
                                className="Produto "
                                style={{ borderBottom: "none" }}
                              >
                                <div
                                  className="ContainerProduto"
                                  style={{
                                    backgroundColor:
                                      contrato.Produto === "MILHO"
                                        ? "#ecd60659"
                                        : contrato.Produto === "SOJA"
                                        ? "#c3d82552"
                                        : contrato.Produto === "TRIGO"
                                        ? "#ff8b004d"
                                        : contrato.Produto === "ALGODAO"
                                        ? "#a6d1e363"
                                        : contrato.Produto === "SORGO"
                                        ? "#ffa58963"
                                        : contrato.Produto === "FARELO DE TRIGO"
                                        ? "#e3c7a65c"
                                        : "##80808057",
                                    color:
                                      contrato.Produto === "MILHO"
                                        ? "#b38f00"
                                        : contrato.Produto === "SOJA"
                                        ? "#8da600"
                                        : contrato.Produto === "TRIGO"
                                        ? "#cc7000"
                                        : contrato.Produto === "ALGODAO"
                                        ? "#759dbb"
                                        : contrato.Produto === "SORGO"
                                        ? "#cc7252"
                                        : contrato.Produto === "FARELO DE TRIGO"
                                        ? "#b39f76"
                                        : "#606060",
                                  }}
                                >
                                  <p style={{ fontWeight: "500" }}>
                                    {contrato.Produto}
                                  </p>
                                </div>
                              </TableCell>
                            </div>
                          ) : (
                            <div className="contratosDireita">
                              <TableCell
                                className="VlTotalContrato valor"
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
                                      contrato.VlTotalContrato < 0
                                        ? "#FF4C51"
                                        : contrato.VlTotalContrato > 0
                                        ? "#676a6c"
                                        : "#676a6c",
                                  }}
                                >
                                  {formaSaldo(contrato.VlTotalContrato)}
                                </p>
                              </TableCell>
                              <TableCell
                                className="VlTotalCarregado valor"
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
                              <TableCell
                                className="VlTotalPagamentos valor"
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
                              <TableCell
                                className="Produto "
                                style={{ borderBottom: "none" }}
                              >
                                <div
                                  className="ContainerProduto"
                                  style={{
                                    backgroundColor:
                                      contrato.Produto === "MILHO"
                                        ? "#ecd60659"
                                        : contrato.Produto === "SOJA"
                                        ? "#c3d82552"
                                        : contrato.Produto === "TRIGO"
                                        ? "#ff8b004d"
                                        : contrato.Produto === "ALGODAO"
                                        ? "#a6d1e363"
                                        : contrato.Produto === "SORGO"
                                        ? "#ffa58963"
                                        : contrato.Produto === "FARELO DE TRIGO"
                                        ? "#e3c7a65c"
                                        : "##80808057",
                                    color:
                                      contrato.Produto === "MILHO"
                                        ? "#b38f00"
                                        : contrato.Produto === "SOJA"
                                        ? "#8da600"
                                        : contrato.Produto === "TRIGO"
                                        ? "#cc7000"
                                        : contrato.Produto === "ALGODAO"
                                        ? "#759dbb"
                                        : contrato.Produto === "SORGO"
                                        ? "#cc7252"
                                        : contrato.Produto === "FARELO DE TRIGO"
                                        ? "#b39f76"
                                        : "#606060",
                                  }}
                                >
                                  <p style={{ fontWeight: "500" }}>
                                    {contrato.Produto}
                                  </p>
                                </div>
                              </TableCell>
                            </div>
                          )}
                        </TableRow>
                      ))}
                    </div>
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
                        style={{ maxWidth: "650px", minWidth: "650px" }}
                      >
                        <TableCell
                          className="enchimento"
                          style={{ width: "60px", padding: "16px" }}
                        >
                          <p></p>
                        </TableCell>
                        {/* <TableCell
                          className="Data-Header"
                          style={{
                            padding: "16px",
                            width: "135px",
                            textAlign: "left",
                          }}
                        >
                          <p>Data</p>
                        </TableCell> */}
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
                                  VlContratoNUM < 0
                                    ? "#FF4C51"
                                    : VlContratoNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(VlContratoNUM)}
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
                                // borderBottom: "1px solid rgb(209 209 209)"
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
                      ) : tipo == "quantidade" ? (
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
                                  QtdeTotalContratoNUM < 0
                                    ? "#FF4C51"
                                    : QtdeTotalContratoNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)" #676a6c
                              }}
                            >
                              {formaSaldo(QtdeTotalContratoNUM).replace(
                                "R$",
                                ""
                              )}
                              kg
                            </p>
                            <p
                              style={{
                                color:
                                  VlContratoNUM < 0
                                    ? "#FF4C51"
                                    : VlContratoNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(VlContratoNUM)}
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
                                  QtdeTotalCarregadoNUM < 0
                                    ? "#FF4C51"
                                    : QtdeTotalCarregadoNUM > 0
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
                                  QtdeTotalPagtosNUM < 0
                                    ? "#FF4C51"
                                    : QtdeTotalPagtosNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(QtdeTotalPagtosNUM).replace("R$", "")}
                              kg
                            </p>
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
                                  QtdeTotalSaldoNUM < 0
                                    ? "#FF4C51"
                                    : QtdeTotalSaldoNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(QtdeTotalSaldoNUM).replace("R$", "")}
                              kg
                            </p>
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
                          <TableCell
                            style={{
                              width: "156px",
                              textAlign: "center",
                            }}
                          >
                            {/* <p>{formaSaldo(VlContratoNUM)}</p> */}
                          </TableCell>
                        </div>
                      ) : (
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
                                  VlContratoNUM < 0
                                    ? "#FF4C51"
                                    : VlContratoNUM > 0
                                    ? "#676a6c"
                                    : "#676a6c",
                                // borderBottom: "1px solid rgb(209 209 209)"
                              }}
                            >
                              {formaSaldo(VlContratoNUM)}
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
                                // borderBottom: "1px solid rgb(209 209 209)"
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
                          <TableCell
                            style={{
                              width: "156px",
                              textAlign: "center",
                            }}
                          >
                            {/* <p>{formaSaldo(VlContratoNUM)}</p> */}
                          </TableCell>
                        </div>
                      )}
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </TableContainer>
          </Grid>

          <Grid
            item
            xs={12}
            height={420}
            className="container-M"
            sx={{ paddingLeft: "0px" }}
          >
            <TableContainer
              component={Paper}
              className="TableContainer-M"
              sx={{
                boxShadow: "-3px 3px 5px 1px #0000001c",
                borderRadius: "10px",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Table className="Table-M" style={{ height: "100%" }}>
                <div
                  className="Periodo-container"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Table className="Grafico">
                    <div
                      className="GraficoM-container"
                      style={{
                        display: "flex",
                        flexDirection: "Row",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          overflowY: "hidden",
                          overflowX: "hidden",
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          padding: "10px 10px 0px 10px",
                        }}
                        className="GraficoPizza-container"
                      >
                        <div
                          className="coluna"
                          style={{ width: "100%", maxWidth: "1687px" }}
                        >
                          <div
                            style={{
                              // width: "100%",
                              flex: 1,
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              // height: "100%",
                            }}
                          >
                            <div
                              style={{
                                // width: "100%",
                                flex: 1,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <ValorChart
                                dataInicio={DataInicial}
                                dataFim={DataFinal}
                                IdTipoAgrupamento={tipoGrafico}
                                tipoContratoGrafico={tipoContratoGrafico}
                                TipoAgrupamentoPessoaProduto={
                                  TipoAgrupamentoPessoaProduto
                                }
                                esconder={esconder}
                              />
                              <QuantidadeChart
                                dataInicio={DataInicial}
                                dataFim={DataFinal}
                                IdTipoAgrupamento={tipoGrafico}
                                tipoContratoGrafico={tipoContratoGrafico}
                                TipoAgrupamentoPessoaProduto={
                                  TipoAgrupamentoPessoaProduto
                                }
                                esconder={esconder}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Table>
                </div>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Cargas
          dataInicio={DataInicial}
          dataFim={DataFinal}
          IdTipoAgrupamento={tipoGrafico}
          tipoContratoGrafico={tipoContratoGrafico}
          TipoAgrupamentoPessoaProduto={TipoAgrupamentoPessoaProduto}
        ></Cargas>
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
