import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import './Marcacoes.css'; // ou MinhasMarcacoes.css

const MinhasMarcacoes = () => {
  const [aulasMarcadas, setAulasMarcadas] = useState([]);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  useEffect(() => {
    axios.get('http://localhost:8000/api/marcacoes/', { withCredentials: true })
      .then((res) => {
        const aulas = res.data.map((m) => ({
          id: m.id,
          data: m.aula_detalhes.data,
          hora_inicio: m.aula_detalhes.hora_inicio,
          hora_fim: m.aula_detalhes.hora_fim,
          modalidade: m.aula_detalhes.modalidade.nome,
          descricao: m.aula_detalhes.modalidade.descricao,
          participantes_atual: m.aula_detalhes.participantes_atual,
          max_participantes: m.aula_detalhes.max_participantes,
        }));

        // Ordenar por data/hora
        aulas.sort((a, b) => {
          const dataA = new Date(`${a.data}T${a.hora_inicio}`);
          const dataB = new Date(`${b.data}T${b.hora_inicio}`);
          return dataA - dataB;
        });

        setAulasMarcadas(aulas);
      })
      .catch((err) => {
        console.error('Erro ao buscar marcações:', err);
      });
  }, []);

  const desmarcarAula = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/marcacoes/${id}/`, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
      setAulasMarcadas((prev) => prev.filter((aula) => aula.id !== id));
    } catch (error) {
      console.error('Erro ao desmarcar aula:', error);
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="container">
        <h2 className="subtitulo">Minhas Marcações</h2>

        {aulasMarcadas.length === 0 ? (
          <p>Você ainda não marcou nenhuma aula.</p>
        ) : (
          aulasMarcadas.map((aula) => (
            <div className="aula-card" key={aula.id}>
              <strong>{aula.modalidade}</strong>
              <p>{aula.data} - {aula.hora_inicio} às {aula.hora_fim}</p>
              <p>{aula.descricao}</p>
              <p>Participantes: {aula.participantes_atual} / {aula.max_participantes} 👥</p>
              <button className="botao-desmarcar" onClick={() => desmarcarAula(aula.id)}>Desmarcar</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MinhasMarcacoes;
