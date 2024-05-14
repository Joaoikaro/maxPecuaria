/*eslint-disable no-unused-vars*/
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Chart } from "react-google-charts";
import axios from "axios";
import { Menu, MenuItem, TableCell, Typography } from "@mui/material";
import GraficoHorizontal from "./GraficoHorizontal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DataGlobal from "./globalData";
import { Input } from "@mui/joy";

const GraficoDonut = () => {
  const currentDate = new Date().toISOString();
  // const dataMesInicio = format(currentDate, "yyyy-01-01");
  // const currentDateFormatted = format(currentDate, "yyyy-MM-dd");
  const {
    DataInicial,
    DataFinal,
    defaultFinal,
    defaultInicial,
    setStartDate,
    setEndDate,
    tipo,
    setTipo,
  } = DataGlobal();
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [porcentagens, setPorcentagens] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [quantidade, setQuantidade] = useState();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          `https://gerentemax.somee.com/Dashboard/Fianceiro/Contas/ListarPorPeriodoAgrupado_FormaPagto?dataInicial=${DataInicial}&dataFinal=${DataFinal}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;

        const chartData = data.map((item) => [
          item.FormaPagto || "Forma não reconhecida",
          parseFloat(item.Quantidade),
        ]);

        const formas = data.map((item) =>
          item.FormaPagto !== "" ? item.FormaPagto : "Forma não reconhecida"
        );

        const quantidades = data.map((item) => item.Quantidade);
        const totalQuantidades = quantidades.reduce(
          (acc, quantidade) => acc + quantidade,
          0
        );
        const porcentagens = quantidades.map(
          (quantidade) =>
            ((quantidade / totalQuantidades) * 100).toFixed(2) + "%"
        );
        setChartData([["Forma de Pagamento", "Valor Movimento"], ...chartData]);
        setQuantidade(totalQuantidades);
        setFormasPagamento(formas);
        setPorcentagens(porcentagens);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DataInicial, DataFinal]);

  const handleFiltrarPizza = (event) => {
    event.preventDefault();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "-50px",
        marginLeft: "-80px",
      }}
    >
      <div className="Filtros-M">
        <form
          onChange={handleFiltrarPizza}
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-end",
            height: "50px",
          }}
        >
          <Input
            type="date"
            label="Data Inicial"
            defaultValue={defaultInicial}
            onChange={(event) => setStartDate(event.target.value)}
            placeholder="Data Inicial"
            slotProps={{
              input: {
                min: "1990-01-01",
                max: "2099-12-31",
              },
            }}
            size="small"
            style={{
              marginRight: "15px",
              color: "#676A6C",
              borderBottom: "none",
              borderRadius: "5px",
              background: "#ffff",
              border: "none",
              boxShadow: "none",
              width: "115px",
              cursor: "pointer"
            }}
          />
          <Input
            type="date"
            label="Data Final"
            defaultValue={defaultFinal}
            onChange={(event) => setEndDate(event.target.value)}
            placeholder="Data Final"
            size="small"
            slotProps={{
              input: {
                min: "1990-01-01",
                max: "2099-12-31",
              },
            }}
            style={{
              color: "#676A6C",
              borderRadius: "5px",
              background: "#ffff",
              border: "none",
              boxShadow: "none",
              width: "115px",
              cursor: "pointer",
            }}
          />
          <TableCell className="opcaoMenu" sx={{ borderBottom: "none" }}>
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
              {tipo == "Dia" ? "Diario" : tipo == "Mes" ? "Mensal" : "Anual"}
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
              <MenuItem onClick={() => setTipo("Dia")}>Diario</MenuItem>
              <MenuItem onClick={() => setTipo("Mes")}>Mensal</MenuItem>
              <MenuItem onClick={() => setTipo("Ano")}>Anual</MenuItem>
            </Menu>
          </TableCell>
        </form>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginLeft: "0px",
        }}
      >
        <div style={{ marginRight: "0", marginLeft: "4.5%" }}>
          <Chart
            maxwidth="540px"
            height="280px"
            chartType="PieChart"
            loader={<div>Carregando dados...</div>}
            data={chartData}
            options={{
              pieHole: 0.3,
              noData: { text: "Sem dados" },
              colors: [
                "#459d10",
                "#990099",
                "#3266cc",
                "#9ca1a4",
                "#fdb900",
                "#20a5ff",
                "#8c29f7",
                "#00cc99",
                "#ff6666",
                "#ffcc00",
                "#66ccff",
                "#ff3399",
                "#33cc33",
              ],
            }}
          />
        </div>
        <GraficoHorizontal data1={DataInicial} data2={DataFinal} tipo={tipo} />
      </div>
    </div>
  );
};

export default GraficoDonut;
