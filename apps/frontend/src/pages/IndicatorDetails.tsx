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
          paddingBottom: "15px",
        }}
      >
        <h1 style={{ margin: "0 0 5px 0" }}>
          {indicator ? indicator.name : "Histórico do Indicador"}
        </h1>
        {indicator && (
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            Código: <strong>{indicator.code}</strong> | Fonte:{" "}
            <strong>{indicator.source}</strong> | Frequência:{" "}
            <strong>{indicator.frequency}</strong>
          </p>
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
              textAlign: "left",
            }}
          >
            <th style={{ padding: "12px" }}>Data</th>
            <th style={{ padding: "12px" }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}>{record.date}</td>
              <td style={{ padding: "12px", fontWeight: "500" }}>
                {record.value}
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