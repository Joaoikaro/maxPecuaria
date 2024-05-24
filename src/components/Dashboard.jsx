/* eslint-disable no-unused-vars */
// eslint-disable-next-line react-hooks/exhaustive-deps
import "../styles/Graficos.css";
import React from "react";
import { format } from "date-fns";
import GraficoPizza from "./GraficoDonut";
import $ from "jquery";
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
import { useEffect, useState } from "react";
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

function Graficos() {
  const navigate = useNavigate();
  const [bancos, setBancos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [graficos, setGraficos] = useState([]);
  const [graficosAno, setGraficosAno] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Debitos, setDebitos] = useState([]);
  const [Creditos, setCreditos] = useState([]);
  const [Saldos, setSaldos] = useState([]);
  const [containerAtivo, setContainerAtivo] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const currentDate = new Date().toISOString();
  const dataMesInicio = format(currentDate, "yyyy/MM/01");
  const currentDateFormatted = format(currentDate, "yyyy/MM/dd");
  const [DataInicial, setStartDate] = useState(dataMesInicio);
  const [DataFinal, setEndDate] = useState(currentDateFormatted);
  const { defaultFinal, defaultInicial } = DataGlobal();

  const abrirMenus = () => {
    const sidebar = $(".Sidebar");
    if (sidebar.is(":visible")) {
      sidebar.stop().fadeOut(100);
    } else {
      sidebar.stop().fadeIn(300);
    }
  };

  useEffect(() => {
    abrirMenus();
  }, []);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (token == null) {
      localStorage.clear();
      navigate("/");
    } else {
      axios
        .get(
          "https://gerentemax.somee.com/Dashboard/SaldoConta/ListarSaldoContas",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setBancos(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const formaSaldo = (saldo) => {
    return parseFloat(saldo).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const saldoTotal = bancos.reduce(
    (total, banco) => total + parseFloat(banco.VlSaldo),
    0
  );

  const DiarioGet = () => {
    setLoading(true);

    if (containerAtivo === 1) {
      const token = localStorage.getItem("accessToken");
      const data = {
        DataInicial: format(DataInicial, "yyyy/MM/dd"),
        DataFinal: format(DataFinal, "yyyy/MM/dd"),
      };

      const url = `https://www.gerentemax.somee.com/Dashboard/Fianceiro/FluxoDeCaixa/ListarPorPeriodo?dataInicial=${data.DataInicial}&dataFinal=${data.DataFinal}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setPeriodos(response.data);

          const ultimoObjeto = response.data[response.data.length - 1];
          const saldoDoUltimo = ultimoObjeto.Saldo;

          setSaldos(saldoDoUltimo);

          const somaCredito = response.data.reduce(
            (total, periodo) => total + (periodo.Credito || 0),
            0
          );
          setCreditos(somaCredito);

          const somaDebito = response.data.reduce(
            (total, periodo) => total + (periodo.Debito || 0),
            0
          );
          setDebitos(somaDebito);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          console.log("Deu erro");
          setLoading(false);
        });
    } else {
      console.log("DiarioGet parou no Else");
    }
  };

  const MensalGet = () => {
    setLoading(true);

    if (containerAtivo == 2) {
      const token = localStorage.getItem("accessToken");
      const data = {
        DataInicial: format(DataInicial, "yyyy/MM/dd"),
        DataFinal: format(DataFinal, "yyyy/MM/dd"),
        TipoAgrupamento: "Mes",
      };

      const url = `https://www.gerentemax.somee.com/Dashboard/Fianceiro/FluxoDeCaixa/ListarPorPeriodoAgrupado?dataInicial=${data.DataInicial}&dataFinal=${data.DataFinal}&tipoAgrupamento=${data.TipoAgrupamento}
    `;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setGraficos(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const AnoGet = () => {
    setLoading(true);

    if (containerAtivo == 3) {
      const token = localStorage.getItem("accessToken");
      const data = {
        DataInicial: format(DataInicial, "yyyy/MM/dd"),
        DataFinal: format(DataFinal, "yyyy/MM/dd"),
        TipoAgrupamento: "Ano",
      };

      const url = `https://www.gerentemax.somee.com/Dashboard/Fianceiro/FluxoDeCaixa/ListarPorPeriodoAgrupado?dataInicial=${data.DataInicial}&dataFinal=${data.DataFinal}&tipoAgrupamento=${data.TipoAgrupamento}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setLoading(false);
          setGraficosAno(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerAtivo === 1) {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const data = {
        DataInicial: DataInicial,
        DataFinal: DataFinal,
      };

      const url = `https://www.gerentemax.somee.com/Dashboard/Fianceiro/FluxoDeCaixa/ListarPorPeriodo?dataInicial=${data.DataInicial}&dataFinal=${data.DataFinal}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setPeriodos(response.data);
          const ultimoObjeto = response.data[response.data.length - 1];
          const saldoDoUltimo = ultimoObjeto.Saldo;

          setSaldos(saldoDoUltimo);

          const somaCredito = response.data.reduce(
            (total, periodo) => total + (periodo.Credito || 0),
            0
          );
          setCreditos(somaCredito);

          const somaDebito = response.data.reduce(
            (total, periodo) => total + (periodo.Debito || 0),
            0
          );
          setDebitos(somaDebito);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    setLoading(true);

    if (containerAtivo == 2) {
      const token = localStorage.getItem("accessToken");
      const data = {
        DataInicial: format(DataInicial, "yyyy/MM/dd"),
        DataFinal: format(DataFinal, "yyyy/MM/dd"),
        TipoAgrupamento: "Mes",
      };

      const url = `https://www.gerentemax.somee.com/Dashboard/Fianceiro/FluxoDeCaixa/ListarPorPeriodoAgrupado?dataInicial=${data.DataInicial}&dataFinal=${data.DataFinal}&tipoAgrupamento=${data.TipoAgrupamento}
    `;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setGraficos(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerAtivo]);

  useEffect(() => {
    if (containerAtivo == 3) {
      const token = localStorage.getItem("accessToken");
      const data = {
        DataInicial: format(DataInicial, "yyyy/MM/dd"),
        DataFinal: format(DataFinal, "yyyy/MM/dd"),
        TipoAgrupamento: "Ano",
      };

      const url = `https://www.gerentemax.somee.com/Dashboard/Fianceiro/FluxoDeCaixa/ListarPorPeriodoAgrupado?dataInicial=${data.DataInicial}&dataFinal=${data.DataFinal}&tipoAgrupamento=${data.TipoAgrupamento}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setLoading(false);
          setGraficosAno(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerAtivo]);

  const GraficoMesCredito = graficos
    .map((item) => {
      return item.Credito !== null && item.SaldoInicialSN === false
        ? item.Credito
        : null;
    })
    .filter((value) => value !== null);

  const creditoMes = GraficoMesCredito.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  const GraficoMesDebito = graficos
    .map((item) => {
      return item.Debito !== null && item.SaldoInicialSN === false
        ? item.Debito
        : null;
    })
    .filter((value) => value !== null);

  const DebitoMes = GraficoMesDebito.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  const mesesAbreviados = graficos
    .filter((item) => item.Mes !== null && item.Ano !== null)
    .map((item) => {
      const nomeMes = new Date(`${item.Ano}-${item.Mes}-01`)
        .toLocaleDateString("pt-BR", { month: "short" })
        .toLocaleUpperCase()
        .replace(".", "");

      return `${nomeMes}/${item.Ano}`;
    });

  const mesesAbreviados2 = [
    "",
    ...graficos
      .filter((item) => item.Mes !== null && item.Ano !== null)
      .map((item) => {
        const nomeMes = new Date(`${item.Ano}-${item.Mes}-01`)
          .toLocaleDateString("pt-BR", { month: "short" })
          .toLocaleUpperCase()
          .replace(".", "");

        return `${nomeMes}/${item.Ano}`;
      }),
  ];

  const GraficoAnoCredito = graficosAno
    .map((item) => {
      return item.Credito !== null && item.SaldoInicialSN === false
        ? item.Credito
        : null;
    })
    .filter((value) => value !== null);

  const creditoAno = GraficoAnoCredito.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  const GraficoAnoDebito = graficosAno
    .map((item) => {
      return item.Debito !== null && item.SaldoInicialSN === false
        ? item.Debito
        : null;
    })
    .filter((value) => value !== null);

  const DebitoAno = GraficoAnoDebito.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  const xAxisData = graficosAno
    .map((item) => {
      return item.Ano !== null ? `${item.Ano}` : null;
    })
    .filter((value) => value !== null);

  const dadosOrganizados = graficosAno.map((item, index) => {
    if (item.SaldoPeriodo === null && index > 0) {
      return { ...item, Ano: null };
    }
    return item;
  });

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
      <div className="MainDash">
        <div className="preenchimento-Dashboard"></div>
        <div className="GridDash">
          <Grid
            container
            spacing={2}
            xs={12}
            sm={12}
            md={12}
            lg={12}
            sx={{ width: "90%" }}
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
                    <TableRow
                      className="header-P"
                      sx={{ borderBottom: "none" }}
                    >
                      <TableCell
                        className="TableTitle-P"
                        sx={{
                          fontWeight: "700",
                          fontSize: "15px",
                          color: "#717171",
                          display: "flex",
                        }}
                      >
                        Saldo Contas
                        <Typography
                          sx={{
                            fontWeight: "700",
                            fontSize: "15px",
                            color: saldoTotal < 0 ? "#FF4C51" : "#005ca8",
                          }}
                        >
                          {formaSaldo(saldoTotal)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <div className="ContainerTable-P">
                      {bancos.map((banco) => (
                        <TableRow key={banco.IdRegistro} sx={{ width: "100%" }}>
                          <div className="Bancos-P">
                            <div className="containerLeftVdd">
                              <TableCell
                                className="BancoLogo"
                                sx={{ borderBottom: "none" }}
                              >
                                <img
                                  className="BancoLogoIMG"
                                  src={banco.Imagem}
                                  style={{ borderRadius: "10px" }}
                                  alt="Teste"
                                />
                              </TableCell>
                              <div className="BancoNome-container">
                                <TableCell
                                  className="BancoNome"
                                  sx={{
                                    fontWeight: "700",
                                    fontSize: "12px",
                                    color: "#676A6C",
                                    padding: "0px",
                                    textAlign: "left",
                                    borderBottom: "none",
                                  }}
                                >
                                  {banco.NomeConta}
                                </TableCell>
                                <TableCell
                                  className="BancoData"
                                  sx={{
                                    padding: "0px",
                                    color: "#A8AAB0",
                                    fontSize: "12px",
                                    borderBottom: "none",
                                  }}
                                >
                                  {format(
                                    new Date(banco.DataSaldo),
                                    "dd/MM/yyyy"
                                  )}
                                </TableCell>
                              </div>
                            </div>
                            <div
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
                                  color:
                                    parseFloat(banco.VlSaldo) < 0
                                      ? "#FF4C51"
                                      : "#489D0A",
                                  fontWeight: "700",
                                  textAlign: "right",
                                  fontSize: "13px",
                                  // padding: "0px 16px 0px 0px",
                                }}
                              >
                                <p>{formaSaldo(banco.VlSaldo)}</p>
                              </TableCell>
                            </div>
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
                              Financeiro contas
                            </Typography>
                          </div>
                          <GraficoPizza />
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
                  }}
                >
                  <TableRow
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#ffffffff",
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
                      <TableCell
                        className="fluxoTitulo"
                        style={{ border: "none" }}
                      >
                        <Typography
                          sx={{
                            color: "#676A6C",
                            fontSize: "17px",
                            fontWeight: "700",
                          }}
                        >
                          Fluxo De Caixa
                        </Typography>
                      </TableCell>
                    </Typography>
                    <div>
                      <TableCell
                        className="Data-input"
                        style={{ border: "none" }}
                      >
                        <form
                          onChange={handleSubmit}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Input
                            type="date"
                            label="Data Inicial"
                            defaultValue={defaultInicial}
                            onChange={(event) =>
                              setStartDate(event.target.value)
                            }
                            slotProps={{
                              input: {
                                min: "1990-01-01",
                                max: "2099-12-31",
                              },
                            }}
                            onBlur={
                              containerAtivo === 1
                                ? DiarioGet
                                : containerAtivo === 2
                                ? MensalGet
                                : containerAtivo === 3
                                ? AnoGet
                                : console.log("Onblur Data Inicial deu errado")
                            }
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
                            onBlur={
                              containerAtivo === 1
                                ? DiarioGet
                                : containerAtivo === 2
                                ? MensalGet
                                : containerAtivo === 3
                                ? AnoGet
                                : console.log("Onblur Data Final deu errado")
                            }
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
                      <TableCell
                        className="opcaoMenu"
                        sx={{ borderBottom: "0px" }}
                      >
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
                        {periodos.map((periodo) => (
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
                                      periodo.DataVenc !== null
                                        ? ""
                                        : "#676A6C",
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
                                        periodo.Saldo < 0
                                          ? "#FF4C51"
                                          : "#1976d2",
                                    }}
                                  >
                                    <span
                                      style={{
                                        backgroundColor:
                                          periodo.Saldo < 0
                                            ? "#FFECEC"
                                            : "#EAF6FF",
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
                        ))}
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
                              {formaSaldo(
                                Math.floor(Creditos).toFixed(2)
                              ).replace("R$", "")}
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
                              {formaSaldo(Math.floor(Debitos).toFixed(2))
                                .replace("R$", "")
                                .startsWith("-")
                                ? formaSaldo(Math.floor(Debitos).toFixed(2))
                                : "-" +
                                  formaSaldo(
                                    Math.floor(Debitos).toFixed(2)
                                  ).replace("R$", "")}
                            </p>
                          </div>
                          <div className="bloco containerSaldos">
                            <p
                              style={{
                                backgroundColor:
                                  Saldos > 0 ? "rgb(234, 246, 255)" : "#FFECEC",
                                color:
                                  Saldos > 0 ? "rgb(25, 118, 210)" : "#FF4C51",
                              }}
                            >
                              <img
                                src={Saldos > 0 ? Saldo1 : Saldo2}
                                alt="Ícone de Saldo"
                              />
                              {formaSaldo(
                                Math.floor(Saldos).toFixed(2)
                              ).replace("R$", "")}
                            </p>
                          </div>
                        </div>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
                {/* Mensal MMMM */}
                <div
                  className="Periodo-container"
                  style={{
                    width: "100%",
                    display: containerAtivo === 2 ? "block" : "none",
                  }}
                >
                  <Table stickyHeader className="Grafico Grafico-Mensal">
                    {graficos && graficos.length > 0 ? (
                      <div
                        className="GraficoMensal-container"
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <div
                          style={{
                            flex: 1,
                            overflowY: "scroll",
                            overflowX: "hidden",
                            height: "368px",
                            width: "100%",
                          }}
                          className="GraficoSim"
                        >
                          <TableContainer
                            component={Paper}
                            sx={{ overflowX: "auto", padding: "5px" }}
                          >
                            <Table stickyHeader sx={{ width: "100%" }}>
                              <TableHead className="TableHead-G">
                                <TableRow>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      Descrição
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      S. Inicial
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      Crédito
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      Débito
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                      }}
                                    >
                                      S. Periodo
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                      }}
                                    >
                                      S. Final
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {graficos.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell
                                      sx={{
                                        color: "#717171",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      {mesesAbreviados2[index]}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        padding: "16px 18px 16px 16px",
                                        textAlign: "right",
                                        color:
                                          isNaN(item.SaldoInicial) ||
                                          item.SaldoInicial === null ||
                                          item.SaldoInicial === false
                                            ? "#717171"
                                            : item.SaldoInicial < 0
                                            ? "#FF4C51"
                                            : item.SaldoInicial > 0
                                            ? "#489D0A"
                                            : null,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formaSaldo(item.SaldoInicial).replace(
                                        "R$",
                                        ""
                                      )}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        padding: "16px 18px 16px 16px",
                                        textAlign: "right",
                                        color: "#489D0A",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formaSaldo(item.Credito)
                                        .toString()
                                        .replace("R$", "")
                                        .replace("NaN", "0,00")}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        padding: "16px 18px 16px 16px",
                                        textAlign: "right",
                                        color: "#FF4C51",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formaSaldo(item.Debito)
                                        .toString()
                                        .replace("R$", "")
                                        .replace("NaN", "0,00")}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        padding: "16px 18px 16px 16px",
                                        textAlign: "right",
                                        color:
                                          isNaN(item.SaldoPeriodo) ||
                                          item.SaldoPeriodo === null ||
                                          item.SaldoPeriodo === false
                                            ? "#717171"
                                            : item.SaldoPeriodo < 0
                                            ? "#FF4C51"
                                            : item.SaldoPeriodo > 0
                                            ? "#489D0A"
                                            : null,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formaSaldo(item.SaldoPeriodo)
                                        .toString()
                                        .replace("R$", "")
                                        .replace("NaN", "0,00")}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        padding: "16px 18px 16px 16px",
                                        textAlign: "right",
                                        color:
                                          isNaN(item.SaldoFinal) ||
                                          item.SaldoFinal === null ||
                                          item.SaldoFinal === false
                                            ? "#717171"
                                            : item.SaldoFinal < 0
                                            ? "#FF4C51"
                                            : item.SaldoFinal > 0
                                            ? "#489D0A"
                                            : null,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formaSaldo(item.SaldoFinal)
                                        .toString()
                                        .replace("R$", "")
                                        .replace("NaN", "0,00")}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                        <div style={{ flex: 1 }}>
                          {/* BBM BarChart Mensal */}
                          <BarChart
                            colors={["#489D0A", "#FF4C51"]}
                            width={750}
                            height={370}
                            series={[
                              {
                                data: creditoMes,
                                label: "Crédito",
                                id: "Cre",
                              },
                              {
                                data: DebitoMes,
                                label: "Débito",
                                id: "Deb",
                              },
                            ]}
                            xAxis={
                              xAxisData
                                ? [
                                    {
                                      data: mesesAbreviados,
                                      scaleType: "band",
                                    },
                                  ]
                                : []
                            }
                          >
                            <Bar
                              dataKey="Credito"
                              fill="#489D0A"
                              label={{ position: "top" }}
                            />
                            <Bar
                              dataKey="Debito"
                              fill="#FF4C51"
                              label={{ position: "top" }}
                            />
                          </BarChart>
                        </div>
                      </div>
                    ) : (
                      <p>Aguardando dados...</p>
                    )}
                  </Table>
                </div>
                {/* Anual AAA */}
                <div
                  className="Periodo-container"
                  style={{
                    width: "100%",
                    display: containerAtivo === 3 ? "block" : "none",
                  }}
                >
                  <Table className="Grafico Grafico-Anual">
                    {graficosAno && graficosAno.length > 0 ? (
                      <div
                        className="GraficoMensal-container"
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <div
                          style={{
                            flex: 1,
                            overflowY: "scroll",
                            overflowX: "hidden",
                            height: "368px",
                          }}
                          className="GraficoSim"
                        >
                          <TableContainer
                            component={Paper}
                            sx={{ overflowX: "auto" }}
                          >
                            <Table
                              sx={{ width: "100%", borderCollapse: "collapse" }}
                            >
                              <TableHead
                                sx={{ position: "sticky", top: 0, zIndex: 1 }}
                              >
                                <TableRow
                                  sx={{ position: "sticky", top: 0, zIndex: 1 }}
                                >
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      Descrição
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      S. Inicial
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      Crédito
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      Débito
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      S. Periodo
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ padding: "5px" }}>
                                    <Typography
                                      sx={{
                                        backgroundColor: "#b7e0ff",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        color: "#005ca8",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      S. Final
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {dadosOrganizados.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell
                                      sx={{
                                        color: "#717171",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                      }}
                                    >
                                      {item.Ano}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color:
                                          isNaN(item.SaldoInicial) ||
                                          item.SaldoInicial === null ||
                                          item.SaldoInicial === false
                                            ? "#717171"
                                            : item.SaldoInicial < 0
                                            ? "#FF4C51"
                                            : item.SaldoInicial > 0
                                            ? "#489D0A"
                                            : null,
                                        fontWeight: "bold",
                                        textAlign: "right",
                                      }}
                                    >
                                      {formaSaldo(item.SaldoInicial).replace(
                                        "R$",
                                        ""
                                      )}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "#489D0A",
                                        fontWeight: "bold",
                                        textAlign: "right",
                                      }}
                                    >
                                      {formaSaldo(item.Credito)
                                        .toString()
                                        .replace("R$", "")
                                        .replace("NaN", "0,00")}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: "#FF4C51",
                                        fontWeight: "bold",
                                        textAlign: "right",
                                      }}
                                    >
                                      {formaSaldo(item.Debito)
                                        .toString()
                                        .replace("R$", "")
                                        .replace("NaN", "0,00")}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: "right",
                                        color:
                                          isNaN(item.SaldoPeriodo) ||
                                          item.SaldoPeriodo === null ||
                                          item.SaldoPeriodo === false
                                            ? "#717171"
                                            : item.SaldoPeriodo < 0
                                            ? "#FF4C51"
                                            : item.SaldoPeriodo > 0
                                            ? "#489D0A"
                                            : null,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formaSaldo(item.SaldoPeriodo)
                                        .toString()
                                        .replace("R$", "")
                                        .replace("NaN", "0,00")}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: "right",
                                        color:
                                          isNaN(item.SaldoFinal) ||
                                          item.SaldoFinal === null ||
                                          item.SaldoFinal === false
                                            ? "#717171"
                                            : item.SaldoFinal < 0
                                            ? "#FF4C51"
                                            : item.SaldoFinal > 0
                                            ? "#489D0A"
                                            : null,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formaSaldo(item.SaldoFinal)
                                        .toString()
                                        .replace("R$", "")
                                        .replace("NaN", "0,00")}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                        {/* BBA BarChart Anual*/}
                        <div style={{ flex: 1, overflow: "visible" }}>
                          <BarChart
                            colors={["#489D0A", "#FF4C51"]}
                            width={750}
                            height={370}
                            series={
                              creditoAno.length > 0 && DebitoAno.length > 0
                                ? [
                                    {
                                      data: creditoAno,
                                      label: "Crédito",
                                      id: "Cre",
                                    },
                                    {
                                      data: DebitoAno,
                                      label: "Débito",
                                      id: "Deb",
                                    },
                                  ]
                                : []
                            }
                            xAxis={
                              xAxisData.length > 0
                                ? [
                                    {
                                      data: xAxisData,
                                      scaleType: "band",
                                    },
                                  ]
                                : []
                            }
                          >
                            <Bar
                              dataKey="Credito"
                              fill="#489D0A"
                              label={{ position: "top" }}
                            />
                            <Bar
                              dataKey="Debito"
                              fill="#FF4C51"
                              label={{ position: "top" }}
                            />
                          </BarChart>
                        </div>
                      </div>
                    ) : (
                      <p>Aguardando dados...</p>
                    )}
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
    </React.Fragment>
  );
}

export default Graficos;
