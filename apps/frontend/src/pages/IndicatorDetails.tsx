import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../infra/http/api";

interface HistoryRecord {
  date: string;
  value: number;
}

interface Indicator {
  id: string;
  name: string;
  code: string;
  source: string;
  frequency: string;
  description?: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const formatValue = (value: number, code?: string) => {
  if (value === undefined || value === null) return 'N/A';

  switch (code) {
    case 'GDP':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value) + ' Bi';
    case 'USD_BRL':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(value);
    case 'SELIC':
      return `${value}% a.d.`;
    case 'SELIC_META':
      return `${value}% a.a.`;
    case 'IPCA':
    case 'FEDFUNDS':
      return `${value}%`;
    default:
      return new Intl.NumberFormat('pt-BR').format(value);
  }
};

export const IndicatorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<HistoryRecord[] | null>(null);
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      api.get(`/v1/indicators/${id}/history`),
      api.get("/v1/indicators")
    ])
      .then(([historyResponse, indicatorsResponse]) => {
        setData(historyResponse.data);
        
        const indicatorsList: Indicator[] = indicatorsResponse.data;
        const currentIndicator = indicatorsList.find((item) => item.id === id);
        if (currentIndicator) {
          setIndicator(currentIndicator);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div style={{ padding: "20px" }}>A carregar dados...</div>;
  if (!data || data.length === 0)
    return (
      <div style={{ padding: "20px" }}>Sem dados de histórico disponíveis.</div>
    );

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <Link
        to="/"
        style={{ textDecoration: "none", color: "#0066cc", fontWeight: "bold" }}
      >
        &larr; Voltar para Dashboard
      </Link>

      <div
        style={{
          marginTop: "20px",
          borderBottom: "2px solid #eee",
          paddingBottom: "20px",
        }}
      >
        <h1 style={{ margin: "0 0 15px 0", textAlign: "left", fontSize: "2.2rem" }}>
          {indicator ? indicator.name : "Histórico do Indicador"}
        </h1>
        
        {indicator && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ backgroundColor: "#f0f4f8", color: "#334155", padding: "6px 12px", borderRadius: "16px", fontSize: "14px" }}>
              Código: <strong>{indicator.code}</strong>
            </span>
            <span style={{ backgroundColor: "#f0f4f8", color: "#334155", padding: "6px 12px", borderRadius: "16px", fontSize: "14px" }}>
              Fonte: <strong>{indicator.source}</strong>
            </span>
            <span style={{ backgroundColor: "#f0f4f8", color: "#334155", padding: "6px 12px", borderRadius: "16px", fontSize: "14px" }}>
              Frequência: <strong>{indicator.frequency}</strong>
            </span>
          </div>
        )}
      </div>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #dee2e6",
            }}
          >
            <th style={{ padding: "12px", textAlign: "left", width: "50%" }}>Data</th>
            <th style={{ padding: "12px", textAlign: "left", width: "50%" }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px", textAlign: "left" }}>
                {formatDate(record.date)}
              </td>
              <td style={{ padding: "12px", textAlign: "left", fontWeight: "500" }}>
                {formatValue(record.value, indicator?.code)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          border: "1px solid #ddd",
          backgroundColor: "#f9f9f9",
        }}
      >
        <strong>Aviso de Limitações:</strong> O conteúdo em tela possui
        propósito de instrução. Os números não formam aconselhamento de finanças
        ou apostas de mercado. Restrições de sistemas de fornecimento de dados
        causam riscos de defasagem nos valores.
      </div>
    </div>
  );
};