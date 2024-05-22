import { useState } from "react";
import { format } from "date-fns";

const useDataGlobal = () => {
  const currentDate = new Date().toISOString();
  const dataMesInicio = format(new Date(currentDate), "yyyy/01/01");
  const currentDateFormatted = format(new Date(currentDate), "yyyy/MM/dd");
  const dataMesInicioDefault = format(new Date(currentDate), "yyyy-01-01");
  const currentDateFormattedDefault = format(new Date(currentDate), "yyyy-MM-dd");

  const [DataInicial, setStartDate] = useState(dataMesInicio);
  const [DataFinal, setEndDate] = useState(currentDateFormatted);
  const [tipo, setTipo] = useState("Mes");
  const [defaultInicial, setDefaulticial] = useState(dataMesInicioDefault.toString());
  const [defaultFinal, setDefaultFinal] = useState(currentDateFormattedDefault.toString());
  const [dataInicialGrafico, setDataInicialGrafico] = useState(dataMesInicio);
  const [dataFinalGrafico, setDataFinalGrafico] = useState(currentDateFormatted);
  const [checked, setChecked] = useState(false);
  const [TipoAgrupamentoPessoaProduto, setTipoAgrupamentoPessoaProduto] = useState("PRODUTO");
  const [tipoContratoGrafico, setTipoContratoGrafico] = useState(1);
  const [tipoGrafico, setTipoGrafico] = useState(null);
  const [loading, setLoading] = useState(false);


  return {
    loading,
    setLoading,
    DataInicial,
    DataFinal,
    setStartDate,
    setEndDate,
    tipo,
    setTipo,
    defaultInicial,
    defaultFinal,
    setDefaulticial,
    setDefaultFinal,
    checked,
    setChecked,
    dataInicialGrafico,
    setDataInicialGrafico,
    dataFinalGrafico,
    setDataFinalGrafico,
    TipoAgrupamentoPessoaProduto,
    setTipoAgrupamentoPessoaProduto,
    tipoContratoGrafico,
    setTipoContratoGrafico,
    tipoGrafico,
    setTipoGrafico,
  };
};

export default useDataGlobal;
