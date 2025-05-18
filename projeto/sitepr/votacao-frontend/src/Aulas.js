import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Aulas.css';
import Sidebar from './Sidebar';
import Header from './Header';

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function formatDate(date) {
  return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' });
}

const Aulas = () => {
  const [aulas, setAulas] = useState([]);

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/aulas/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAulas(response.data);
    } catch (error) {
      console.error('Erro ao buscar aulas', error);
    }
  };

  const removerAula = async (id) => {
    if (window.confirm("Tens a certeza que queres remover esta aula?")) {
      try {
        await axios.delete(`http://localhost:8000/api/aulas/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAulas(aulas.filter(aula => aula.id !== id));
      } catch (error) {
        console.error('Erro ao remover aula', error);
      }
    }
  };

  const aulasPorSemana = aulas.reduce((acc, aula) => {
    const dataObj = new Date(`${aula.data}T${aula.hora_inicio}`);
    const year = dataObj.getFullYear();
    const week = getWeekNumber(dataObj);
    const key = `${year}-W${week}`;

    if (!acc[key]) {
      acc[key] = { week, year, aulas: [] };
    }
    acc[key].aulas.push(aula);
    return acc;
  }, {});

  const semanasOrdenadas = Object.keys(aulasPorSemana).sort();

  return (
    <>
      <Header />
      <Sidebar />
      <div className="container">
        {aulas.length === 0 ? (
          <p>Não há aulas disponíveis.</p>
        ) : (
          semanasOrdenadas.map((semanaKey) => {
            const { aulas, week, year } = aulasPorSemana[semanaKey];
            const firstDate = new Date(`${aulas[0].data}T00:00:00`);
            const day = firstDate.getDay() || 7;
            const monday = new Date(firstDate);
            monday.setDate(firstDate.getDate() - day + 1);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);

            const aulasOrdenadas = aulas.sort((a, b) => {
              const dateA = new Date(`${a.data}T${a.hora_inicio}`);
              const dateB = new Date(`${b.data}T${b.hora_inicio}`);
              return dateA - dateB;
            });

            return (
              <div key={semanaKey} className="semana-container">
                <h2 className="semana-titulo">
                  Semana {week} - {formatDate(monday)} a {formatDate(sunday)} {year}
                </h2>
                <div className="aulas-container">
                  {aulasOrdenadas.map((aula) => (
                    <div key={aula.id} className="aula-botao">
                      <strong>{aula.modalidade.nome}</strong>
                      <p>
                        {aula.data} às {aula.hora_inicio} - {aula.hora_fim}
                      </p>
                      <button className="btn-remover" onClick={() => removerAula(aula.id)}>Remover</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Aulas;
