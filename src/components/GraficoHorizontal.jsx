/* eslint-disable react/prop-types */
/*eslint-disable no-unused-vars*/
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DataGlobal from "./globalData";
import numeral from "numeral";

const GraficoHorizontal = (props) => {
  const currentDate = new Date().toISOString();
  const dataMesInicio = format(currentDate, "yyyy-01-01");
  const currentDateFormatted = format(currentDate, "yyyy-MM-dd");
  const { DataInicial, DataFinal, tipo, setEndDate, setStartDate } =
    DataGlobal();

  const [debitos, setDebitos] = useState([]);
  const [Creditos, setCreditos] = useState([]);
  const [mesesData, setMeses] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      const data = {
        DataInicial: DataInicial,
        DataFinal: DataFinal,
        TipoAgrupamento: tipo,
      };

      const filterByYear = (data) => {
        const anosData = data.reduce((acc, item) => {
          const year = item.Ano;
          if (!acc[year]) {
            acc[year] = { Creditos: [], Debitos: [] };
          }
          return acc;
        }, {});
        setMeses(anosData);
      };

      const formatForDaily = (data) => {
        const diasData = data.reduce((acc, item) => {
          const day = item.Dia;
          const month = item.Mes;
          const monthName = [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
          ][month];
          const formattedDate = `${day}/${monthName}`;
          if (!acc[formattedDate]) {
            acc[formattedDate] = { Creditos: [], Debitos: [] };
          }
          return acc;
        }, {});
        setMeses(diasData);
      };
      // eslint-disable-next-line react/prop-types
      const url = `https://www.gerentemax.somee.com/Dashboard/Fianceiro/FluxoDeCaixa/ListarPorPeriodoAgrupado?dataInicial=${props.data1}&dataFinal=${props.data2}&tipoAgrupamento=${props.tipo}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const dataWithoutFirstObject = response.data.slice(1);
          const debitosData = dataWithoutFirstObject.map((item) => item.Debito);
          const creditosData = dataWithoutFirstObject.map(
            (item) => item.Credito
          );
          if (props.tipo === "Ano") {
            filterByYear(dataWithoutFirstObject);
          } else if (props.tipo === "Dia") {
            formatForDaily(dataWithoutFirstObject);
          } else {
            const mesesData = dataWithoutFirstObject.reduce((acc, item) => {
              const monthNames = [
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
                "Set",
                "Out",
                "Nov",
                "Dez",
              ];
              const monthName = monthNames[item.Mes - 1];
              const year = item.Ano;

              const monthYear = `${monthName}/${year}`;

              if (!acc[monthYear]) {
                acc[monthYear] = { Creditos: [], Debitos: [] };
              }

              return acc;
            }, {});
            setMeses(mesesData);
          }
          setDebitos(debitosData);
          setCreditos(creditosData);
          setDadosCarregados(true);
          
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps, react/prop-types
  }, [
    DataInicial,
    DataFinal,
    setStartDate,
    setEndDate,
    props.data1,
    props.data2,
    props.tipo,
  ]);

  function formatNumber(value) {
    const isNegative = value < 0;
    const absValue = Math.abs(value);
    const suffixes = ["", "K", "M", "B", "T"];
    const tier = (Math.log10(absValue) / 3) | 0;
    if (tier === 0) {
      return isNegative ? `-${absValue.toFixed(2)}` : absValue.toFixed(2);
    }
    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaledValue = absValue / scale;
    const formattedValue = scaledValue.toFixed(2);
    return isNegative
      ? `-${formattedValue}${suffix}`
      : `${formattedValue}${suffix}`;
  }

  if (!dadosCarregados) {
    return null;
  }

  const series = [
    {
      name: "Créditos",
      data: Creditos.map((credito) => (credito !== null ? credito : 0)),
    },
    {
      name: "Debitos",
      data: debitos.map((debito) => (debito !== null ? -debito : 0)),
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: "100%",
      width: "100%",
      stacked: true,
      toolbar: {
        show: false,
      },
    },

    legend: {
      show: true,
      showForSingleSeries: false,
      inverseOrder: true,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: "top",
    },
    colors: ["#008FFB", "#FF4560"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        borderRadiusApplication: "around",
        borderRadiusWhenStacked: "last",
        barHeight: "100%",
        dataLabels: {
          position: "top",
        },
        formatter: function (val) {
          return formatNumber(val);
        },
      },
    },

    dataLabels: {
      enabled: false,
      offsetX: -5,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value) {
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        },
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },

    xaxis: {
      categories:
        tipo == "Mes"
          ? Object.keys(mesesData).filter((key) => key !== "undefined")
          : tipo == "Dia"
          ? console.log("Xaxis dos dias")
          : tipo == "Ano"
          ? console.log("Xaxis dos anos")
          : [],
      labels: {
        formatter: function (val) {
          return abbreviateNumber(val);
        },
      },
    },
  };

  function abbreviateNumber(value) {
    const suffixes = ["", "K", "M", "B", "T"];
    const tier = (Math.log10(Math.abs(value)) / 3) | 0;
    if (tier === 0) return value;
    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = value / scale;
    return scaled.toFixed(1) + suffix;
  }

  

  return (
    <div
      id="chart"
      style={{ width: "100%", marginTop: "-10px" }}
    >
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height="100%"
        width="98%"
      />
    </div>
  );
};

export default GraficoHorizontal;
