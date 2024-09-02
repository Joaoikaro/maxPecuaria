/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line react-hooks/exhaustive-deps
import "../styles/Cargas.css";
import { format } from "date-fns";
import GraficoPizza from "./GraficoDonut";
import GraficoHorizontal from "./GraficoHorizontal";
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
  Menu,
  MenuItem,
  CircularProgress,
  Box,
  Modal,
  TableFooter,
} from "@mui/material";
import axios from "axios";
import { Input } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart } from "@mui/x-charts/BarChart";
import Debito from "../components/Debito.png";
import Credito from "../components/Credito.png";
import Zero from "../components/Cinza.png";
import Saldo1 from "../components/saldo+.png";
import Saldo2 from "../components/saldo-.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Bar } from "recharts";
import DataGlobal from "./globalData";
import { FixedSizeList as List } from "react-window";

function Cargas(props) {
  const [cargas, setCargas] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [containerAtivo, setContainerAtivo] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const currentDate = new Date().toISOString();
  const dataMesInicio = format(currentDate, "yyyy-01-01");
  const currentDateFormatted = format(currentDate, "yyyy-MM-dd");
  const [DataInicial, setStartDate] = useState(dataMesInicio);
  const [DataFinal, setEndDate] = useState(currentDateFormatted);
  const { AgrupamentoCargas, setAgrupamentoCargas } = useState("MOTORISTA");
  const { defaultFinal, defaultInicial } = DataGlobal();
  const token = localStorage.getItem("accessToken");

  // console.log("Cargas", AgrupamentoCargas);

  const formaSaldo = (saldo) => {
    return parseFloat(saldo).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
    if (!token) {
      console.error("Token de acesso não encontrado.");
      return;
    }

    const data = {
      dataInicial: props.dataInicio,
      dataFinal: props.dataFim,
      tipoAgrupamento: "MOTORISTA",
    };

    // const data = {
    //   dataInicial: "2020-01-01",
    //   dataFinal: "2024-12-01",
    //   tipoAgrupamento: "MOTORISTA",
    // };
    // console.log("log da data", data);

    setLoading(true);

    const url = `https://www.gerentemax.somee.com/Dashboard/Cargas/ListarPorPeriodoAgrupado?dataInicial=${data.dataInicial}&dataFinal=${data.dataFinal}&tipoAgrupamento=${data.tipoAgrupamento}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setCargas(response.data);
        console.log("Response do Get de Cargas", response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      })
      .finally(() => setLoading(false));

    return () => {
      // Limpar possíveis interações assíncronas aqui
    };
  }, [
    token,
    DataInicial,
    DataFinal,
    AgrupamentoCargas,
    props.dataInicio,
    props.dataFim,
    navigate,
  ]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <Grid
        container
        spacing={2}
        xs={12}
        sm={12}
        md={12}
        lg={12}
        sx={{ width: "90%", marginTop: "0px" }}
      >
        <Grid item xs={4} sm={4} md={4} lg={4} className="container-P">
          <TableContainer
            component={Paper}
            className="TableContainer-P"
            sx={{
              boxShadow: "-3px 3px 5px 1px #0000001c",
              borderRadius: "10px",
            }}
          >
            <Table className="Table-P">
              <TableHead className="TableHead-P">
                <TableRow className="header-P" sx={{ borderBottom: "none" }}>
                  <TableCell
                    className="TableTitle-P"
                    sx={{
                      fontWeight: "700",
                      fontSize: "15px",
                      color: "#717171",
                      display: "flex",
                    }}
                  >
                    Motoristas
                    <Typography
                      sx={{
                        fontWeight: "700",
                        fontSize: "15px",
                        // color: saldoTotal < 0 ? "#FF4C51" : "#005ca8",
                      }}
                    >
                      {/* {formaSaldo(saldoTotal)} */}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <div className="ContainerTable-P">
                  {cargas.map((Carga) => (
                    <TableRow key={Carga.Motorista} sx={{ width: "100%" }}>
                      <div className="Motoristas-P">
                        <div className="containerLeft">
                          <div className="linha L1">
                            <TableCell
                              className="BancoNome"
                              sx={{
                                fontWeight: "700",
                                fontSize: "14px",
                                color: "#676A6C",
                                padding: "0px",
                                borderBottom: "none",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p className="nomeMotorista">MOTORISTA:</p>
                              <p className="dadoMotorista">{Carga.Motorista}</p>
                            </TableCell>
                          </div>

                          <div className="linha L2">
                            <TableCell
                              className="BancoNome"
                              sx={{
                                fontWeight: "700",
                                fontSize: "14px",
                                color: "#676A6C",
                                padding: "0px",
                                borderBottom: "none",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p className="qtdCargas">CARGAS:</p>
                              <p className="dadoCargas">{Carga.Cargas}</p>
                            </TableCell>
                          </div>

                          <div className="linha L3">
                            <TableCell
                              className="BancoNome"
                              sx={{
                                fontWeight: "700",
                                fontSize: "14px",
                                color: "#676A6C",
                                padding: "0px",
                                borderBottom: "none",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p className="nomeMotorista">PESO KG:</p>
                              <p className="dadoMotorista">{formaSaldo(Carga.PesoKg).replace('R$', '')}kg</p>
                            </TableCell>
                          </div>

                          
                          <div className="linha L4">
                            <TableCell
                              className="BancoNome"
                              sx={{
                                fontWeight: "700",
                                fontSize: "14px",
                                color: "#676A6C",
                                padding: "0px",
                                borderBottom: "none",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p className="nomeMotorista">TONELADAS:</p>
                              <p className="dadoMotorista">{formaSaldo(Carga.Toneladas).replace('R$', '')}</p>
                            </TableCell>
                          </div>
                          <div className="linha L5">
                            <TableCell
                              className="BancoNome"
                              sx={{
                                fontWeight: "700",
                                fontSize: "14px",
                                color: "#676A6C",
                                padding: "0px",
                                borderBottom: "none",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p className="nomeMotorista">SACAS:</p>
                              <p className="dadoMotorista">{formaSaldo(Carga.Sacas).replace('R$', '')}</p>
                            </TableCell>
                          </div>
                          <div className="linha L5">
                            <TableCell
                              className="BancoNome"
                              sx={{
                                fontWeight: "700",
                                fontSize: "14px",
                                color: "#676A6C",
                                padding: "0px",
                                borderBottom: "none",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p className="nomeMotorista">TOTAL COMPRA:</p>
                              <p className="dadoMotorista">{formaSaldo(Carga.VlTotalCompra)}</p>
                            </TableCell>
                          </div>
                          <div className="linha L5">
                            <TableCell
                              className="BancoNome"
                              sx={{
                                fontWeight: "700",
                                fontSize: "14px",
                                color: "#676A6C",
                                padding: "0px",
                                borderBottom: "none",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p className="nomeMotorista">TOTAL VENDA:</p>
                              <p className="dadoMotorista">{formaSaldo(Carga.VlTotalVenda)}</p>
                            </TableCell>
                          </div>
                          {/* <TableCell
                            className="BancoData"
                            sx={{
                              padding: "0px",
                              color: "#A8AAB0",
                              fontSize: "12px",
                              borderBottom: "none",
                            }}
                          >
                            {Carga.Cargas}
                          </TableCell> */}
                        </div>
                        {/* <div
                          className="valorTable-P"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <TableCell
                            className="BancoSaldo"
                            sx={{
                              borderBottom: "none",
                              color: "#676A6C",
                              fontWeight: "700",
                              textAlign: "right",
                              fontSize: "13px",
                              // padding: "0px 16px 0px 0px",
                            }}
                          >
                            <p>{cargas.Motorista}</p>
                          </TableCell>
                        </div> */}
                      </div>
                    </TableRow>
                  ))}
                </div>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} className="container-M">
          <TableContainer
            component={Paper}
            className="TableContainer-M"
            sx={{
              boxShadow: "-3px 3px 5px 1px #0000001c",
              borderRadius: "10px",
            }}
          >
            <Table className="Table-M">
              <div
                className="Periodo-container"
                style={{
                  width: "100%",
                }}
              >
                <Table className="Grafico">
                  <div
                    className="GraficoM-container"
                    style={{ display: "flex", flexDirection: "Row" }}
                  >
                    <div
                      style={{
                        flex: 1,
                        overflowY: "hidden",
                        overflowX: "hidden",
                        height: "100%",
                        width: "100%",
                        maxWidth: "1135.980px",
                      }}
                      className="GraficoPizza-container"
                    >
                      <div className="headerPizza">
                        <Typography
                          sx={{
                            fontWeight: "700",
                            margin: "10px 0 10px 10px",
                            color: "#676A6C",
                          }}
                        >
                          Ver com Léo os cards
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Table>
              </div>
            </Table>
          </TableContainer>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          lg={12}
          height={450}
          className="container-G"
        >
          <TableContainer
            component={Paper}
            className="TableContainer-G"
            sx={{
              boxShadow: "-3px 3px 5px 1px #0000001c",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="HeaderFixo"
              style={{
                width: "100%",
                borderBottom: "1px solid rgb(0 0 0 / 15%)",
                backgroundColor: "gainsboro"
              }}
            >
              <TableRow
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "gainsboro",
                  zIndex: 1,
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  alignContent: "center",
                  justifyItems: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  <TableCell className="fluxoTitulo" style={{ border: "none" }}>
                    <Typography
                      sx={{
                        color: "#676A6C",
                        fontSize: "17px",
                        fontWeight: "700",
                      }}
                    >
                      Cargas
                    </Typography>
                  </TableCell>
                </Typography>
                <div>
                  <TableCell className="Data-input" style={{ border: "none" }}>
                    <form
                      onChange={handleSubmit}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <Input
                        type="date"
                        label="Data Inicial"
                        defaultValue={defaultInicial}
                        onChange={(event) => setStartDate(event.target.value)}
                        slotProps={{
                          input: {
                            min: "1990-01-01",
                            max: "2099-12-31",
                          },
                        }}
                        // onBlur={
                        //   containerAtivo === 1
                        //     ? DiarioGet
                        //     : containerAtivo === 2
                        //     ? MensalGet
                        //     : containerAtivo === 3
                        //     ? AnoGet
                        //     : console.log("Onblur Data Inicial deu errado")
                        // }
                        placeholder="Data Inicial"
                        size="small"
                        style={{
                          color: "#676A6C",
                          background: "#ffff",
                          boxShadow: "none",
                          width: "120px",
                          height: "42px",
                          marginRight: "10px",
                          padding: "5px",
                          lineHeight: "1.4375em",
                          border: "1px solid rgba(195, 195, 195)",
                          cursor: "pointer",
                        }}
                      />
                      <Input
                        type="date"
                        label="Data Final"
                        defaultValue={defaultFinal}
                        onChange={(event) => setEndDate(event.target.value)}
                        placeholder="Data Final"
                        slotProps={{
                          input: {
                            min: "1990-01-01",
                            max: "2099-12-31",
                          },
                        }}
                        // onBlur={
                        //   containerAtivo === 1
                        //     ? DiarioGet
                        //     : containerAtivo === 2
                        //     ? MensalGet
                        //     : containerAtivo === 3
                        //     ? AnoGet
                        //     : console.log("Onblur Data Final deu errado")
                        // }
                        size="small"
                        style={{
                          color: "#676A6C",
                          background: "#ffff",
                          boxShadow: "none",
                          width: "120px",
                          height: "42px",
                          padding: "5px",
                          lineHeight: "1.4375em",
                          border: "1px solid rgba(195, 195, 195)",
                        }}
                      />
                    </form>
                  </TableCell>
                  <TableCell className="opcaoMenu" sx={{ borderBottom: "0px" }}>
                    <Typography
                      onClick={handleMenuOpen}
                      sx={{
                        color: "rgb(25, 118, 210)",
                        background: "rgb(234, 246, 255)",
                        display: "flex",
                        alignItems: "center",
                        width: "110px",
                        height: "25px",
                        fontSize: "15px",
                        fontWeight: "600",
                        justifyContent: "space-between",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                    >
                      {containerAtivo === 1
                        ? "Diario"
                        : containerAtivo === 2
                        ? "Mensal"
                        : "Anual"}{" "}
                      <KeyboardArrowDownIcon />
                    </Typography>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      sx={{
                        width: "110px",
                        color: "rgb(25, 118, 210)",
                        borderRadius: "5px",
                        backgroundColor: "rgb(234, 246, 255)",
                      }}
                    >
                      <MenuItem onClick={() => setContainerAtivo(1)}>
                        Diario
                      </MenuItem>
                      <MenuItem onClick={() => setContainerAtivo(2)}>
                        Mensal
                      </MenuItem>
                      <MenuItem onClick={() => setContainerAtivo(3)}>
                        Anual
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </div>
              </TableRow>
            </div>
            {/* Diario DDD */}
            <div
              className="Periodo-container"
              style={{
                width: "100%",
                display: containerAtivo === 1 ? "block" : "none",
                height: "100%",
              }}
            >
              <Table sx={{ borderBottom: "none" }} className="Table-G">
                <TableHead className="TableHead-G">
                  <TableRow
                    className="header-G"
                    sx={{
                      borderBottom: "1px solid #0000001c",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: "45px",
                      width: "100%",
                    }}
                  >
                    <div className="esquerda-G">
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          padding: "16px 20px 16px 0px",
                          marginLeft: "42px",
                          fontWeight: "700",
                          fontSize: "15px",
                          color: "#676A6C",
                        }}
                      >
                        Data Venc.
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          fontWeight: "700",
                          fontSize: "15px",
                          color: "#676A6C",
                          position: "relative",
                          right: "0",
                        }}
                      >
                        Descrição
                      </TableCell>
                    </div>
                    <div className="direita-G">
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          color: "#676A6C",
                          fontWeight: "700",
                          fontSize: "15px",
                        }}
                      >
                        Pagamento
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          color: "#676A6C",
                          fontWeight: "700",
                          fontSize: "15px",
                          marginLeft: "5px",
                          paddingRight: "0px",
                          paddingLeft: "6px",
                        }}
                      >
                        Valor R$
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          color: "#676A6C",
                          fontWeight: "700",
                          fontSize: "15px",
                          position: "relative",
                          right: "-43px",
                        }}
                      >
                        Saldo
                      </TableCell>
                    </div>
                  </TableRow>
                </TableHead>
                <TableBody className="ContainerTable-G">
                  <div
                    className="ContainerTable-G"
                    style={{ borderBottom: "1px solid #0000001c" }}
                  >
                    {/* {cargas.map((periodo) => (
                          <TableRow
                            key={periodo.IdRegistro}
                            sx={{
                              borderBottom: "1px solid #0000001c",
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="esquerdaDiario">
                              <TableCell
                                sx={{ borderBottom: "none" }}
                                className="TipoSaldo"
                                style={{ width: "0" }}
                              >
                                <div
                                  style={{
                                    width: "21.5px",
                                    padding: "0px",
                                    display:
                                      periodo.Credito !== null ||
                                      periodo.Debito !== null
                                        ? ""
                                        : "flex",
                                    justifyContent:
                                      periodo.Credito !== null ||
                                      periodo.Debito !== null
                                        ? ""
                                        : "center",
                                    borderBottom: "none",
                                  }}
                                >
                                  <img
                                    className="TipoSaldoLogo"
                                    src={
                                      periodo.Credito !== null &&
                                      periodo.Credito > periodo.Debito
                                        ? Credito
                                        : periodo.Credito === null &&
                                          periodo.Debito === null
                                        ? Zero
                                        : periodo.Credito === 0 &&
                                          periodo.Debito === 0
                                        ? Zero
                                        : Debito
                                    }
                                    alt={
                                      periodo.Credito !== null &&
                                      periodo.Credito > periodo.Debito
                                        ? "Credito"
                                        : "Debito"
                                    }
                                  />
                                </div>
                              </TableCell>
                              <TableCell
                                className="DataVenc"
                                style={{
                                  width: "119px",
                                  borderBottom: "none",
                                }}
                              >
                                <p
                                  className="DataVenc"
                                  style={{
                                    color:
                                      periodo.DataVenc !== null ? "" : "#676A6C",
                                    display:
                                      periodo.DataVenc !== null ? "" : "flex",
                                    justifyContent:
                                      periodo.DataVenc !== null ? "" : "center",
                                    marginRight:
                                      periodo.DataVenc !== null ? "" : "39px",
                                    paddingLeft:
                                      periodo.DataVenc !== null ? "" : "31px",
                                  }}
                                >
                                  {periodo.DataVenc !== null
                                    ? format(
                                        new Date(periodo.DataVenc),
                                        "dd/MM/yyyy"
                                      )
                                    : "-"}
                                </p>
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "left",
                                  padding: "7px",
                                  fontWeight: "300",
                                  borderBottom: "none",
                                }}
                                className="containerCliente"
                                align="right"
                              >
                                <p
                                  className="historico"
                                  style={{ fontWeight: "500" }}
                                >
                                  {periodo.Historico}
                                </p>
                                <p className="pessoa">{periodo.Pessoa}</p>
                              </TableCell>
                            </div>
                            <div
                              className="direitaDiario"
                              style={{ marginRight: "41px" }}
                            >
                              <TableCell
                                className="containerPagamento"
                                sx={{ borderBottom: "none" }}
                              >
                                <div className="containerAllSpan">
                                  <div className="containerSpan Forma">
                                    <span
                                      style={
                                        periodo.FormaPagto != null
                                          ? {}
                                          : {
                                              display: "flex",
                                              justifyContent: "center",
                                            }
                                      }
                                    >
                                      {periodo.FormaPagto != null
                                        ? periodo.FormaPagto
                                        : "-"}
                                    </span>
                                  </div>
                                  <div className="containerSpan">
                                    <span
                                      style={{
                                        fontWeight: "600",
                                        position: "relative",
                                        left: "0px",
                                        color:
                                          (periodo.Debito !== null &&
                                            periodo.Debito !== 0) ||
                                          (periodo.Credito !== null &&
                                            periodo.Credito !== 0)
                                            ? periodo.Debito !== null &&
                                              periodo.Debito !== 0
                                              ? "#FF4C51"
                                              : "#489D0A"
                                            : "#676A6C",
                                      }}
                                    >
                                      {periodo.Debito !== null &&
                                      periodo.Debito !== 0
                                        ? "-"
                                        : ""}
                                      {periodo.Debito !== null ||
                                      periodo.Credito !== null
                                        ? formaSaldo(
                                            periodo.Debito !== null &&
                                              periodo.Debito !== 0
                                              ? periodo.Debito
                                              : periodo.Credito,
                                            periodo.Credito !== null &&
                                              periodo.Credito !== 0
                                              ? "-"
                                              : periodo.Credito,
                                            periodo.Debito === null ||
                                              periodo.Debito === 0
                                              ? "-"
                                              : periodo.Debito
                                          )
                                            .toString()
                                            .replace("NaN", "0.00")
                                            .replace("R$", "")
                                            .trim()
                                        : ""}
                                    </span>
                                  </div>
                                  <div
                                    className="containerSpan Saldo"
                                    style={{
                                      fontWeight: "600",
                                      position: "relative",
                                      left: "40px",
                                      color:
                                        periodo.Saldo < 0 ? "#FF4C51" : "#1976d2",
                                    }}
                                  >
                                    <span
                                      style={{
                                        backgroundColor:
                                          periodo.Saldo < 0 ? "#FFECEC" : "#EAF6FF",
                                        display: "flex",
                                        padding: "4% 0px 0px 30%",
                                        width: "120px",
                                        height: "30px",
                                        paddingTop: "4%",
                                        borderRadius: "5px",
                                      }}
                                    >
                                      {formaSaldo(periodo.Saldo)
                                        .toString()
                                        .replace("NaN", "0.00")
                                        .replace("R$", "")
                                        .trim()}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                            </div>
                          </TableRow>
                        ))} */}
                  </div>
                </TableBody>
                <TableFooter className="footer-G">
                  <TableRow>
                    <div className="containerTotais">
                      <div className="bloco ContainerCreditos">
                        <p
                          style={{
                            backgroundColor: "#e1eedd",
                            color: "#489D0A",
                          }}
                        >
                          {" "}
                          <img src={Credito} />{" "}
                          {/* {formaSaldo(Math.floor(Creditos).toFixed(2)).replace(
                                "R$",
                                ""
                              )} */}
                        </p>
                      </div>
                      <div className="bloco containerDebitos">
                        <p
                          style={{
                            backgroundColor: "rgb(255, 236, 236)",
                            color: "#FF4C51",
                          }}
                        >
                          <img src={Debito} />
                          {/* {formaSaldo(Math.floor(Debitos).toFixed(2))
                                .replace("R$", "")
                                .startsWith("-")
                                ? formaSaldo(Math.floor(Debitos).toFixed(2))
                                : "-" +
                                  formaSaldo(
                                    Math.floor(Debitos).toFixed(2)
                                  ).replace("R$", "")} */}
                        </p>
                      </div>
                      <div className="bloco containerSaldos">
                        {/* <p
                              style={{
                                backgroundColor:
                                  Saldos > 0 ? "rgb(234, 246, 255)" : "#FFECEC",
                                color: Saldos > 0 ? "rgb(25, 118, 210)" : "#FF4C51",
                              }}
                            >
                              <img
                                src={Saldos > 0 ? Saldo1 : Saldo2}
                                alt="Ícone de Saldo"
                              />
                              {formaSaldo(Math.floor(Saldos).toFixed(2)).replace(
                                "R$",
                                ""
                              )}
                            </p> */}
                      </div>
                    </div>
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
    </React.Fragment>
  );
}

export default Cargas;
