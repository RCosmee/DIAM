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
  const [userId, setUserId] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [avaliandoAula, setAvaliandoAula] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState({});

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          withCredentials: true,
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error('Erro ao buscar o usuário', error);
      }
    };

    getUserId();
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/aulas/', {
      withCredentials: true,
    });
    setAulas(response.data);

    // Obter média de avaliação para cada aula
    for (let aula of response.data) {
      // Ajuste da URL para o path correto
      const res = await axios.get(`http://localhost:8000/api/aulas/${aula.id}/comentarios/`, { withCredentials: true });
      setMediaAvaliacoes(prevState => ({
        ...prevState,
        [aula.id]: res.data.media_avaliacao, // Assumindo que o campo de média é "media_avaliacao"
      }));
    }
  } catch (error) {
    console.error('Erro ao buscar aulas', error);
  }
};


  const removerAula = async (id) => {
    if (window.confirm("Tens a certeza que queres remover esta aula?")) {
      try {
        const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken=')).split('=')[1];

        await axios.delete(`http://localhost:8000/api/aulas/${id}/`, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        });

        setAulas(aulas.filter((aula) => aula.id !== id));
        const updatedMediaAvaliacoes = { ...mediaAvaliacoes };
        delete updatedMediaAvaliacoes[id];
        setMediaAvaliacoes(updatedMediaAvaliacoes);
      } catch (error) {
        console.error('Erro ao remover aula', error);
      }
    }
  };

  const abrirModalAvaliacao = async (aula) => {
    setAvaliandoAula(aula);
    try {
      const res = await axios.get(`http://localhost:8000/api/comentarios/?aula_id=${aula.id}`, { withCredentials: true });
      setComentarios(res.data || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setComentarios([]);
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setComentarios([]);
  };

  const aulasPorSemana = aulas.reduce((acc, aula) => {
    if (aula.pt === userId) {
      const dataObj = new Date(`${aula.data}T${aula.hora_inicio}`);
      const year = dataObj.getFullYear();
      const week = getWeekNumber(dataObj);
      const key = `${year}-W${week}`;

      if (!acc[key]) {
        acc[key] = { week, year, aulas: [] };
      }
      acc[key].aulas.push(aula);
    }
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
                  {aulasOrdenadas.map((aula) => {
                    const aulaData = new Date(`${aula.data}T${aula.hora_inicio}`);
                    const aulaAntiga = aulaData < new Date();
                    const media = mediaAvaliacoes[aula.id] || 0;

                    return (
                      <div
                        key={aula.id}
                        className={`aula-botao ${aulaAntiga ? 'aula-antiga' : ''}`}
                      >
                        <strong>{aula.modalidade ? aula.modalidade.nome : 'Modalidade não definida'}</strong>
                        <p>{aula.data} às {aula.hora_inicio} - {aula.hora_fim}</p>
                        <p>{aula.participantes_atual} / {aula.max_participantes} 👥</p>
                        <p>{media ? media.toFixed(1) : 'Sem avaliações'} ★</p>
                        <div className="button-group">
                          <button className="btnii-avaliar" onClick={() => abrirModalAvaliacao(aula)}>
                            Ver Avaliações
                          </button>
                          <button className="btn-remover" onClick={() => removerAula(aula.id)}>
                            Remover
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Avaliações */}
      {modalAberto && (
        <div className="modalii">
          <div className="modalii-conteudo">
            <button className="btnii-fechar" onClick={fecharModal}>X</button>
            <h3>
              {avaliandoAula?.modalidade ? 
                `${avaliandoAula.modalidade.nome} - ${formatDate(new Date(`${avaliandoAula.data}T00:00:00`))} às ${avaliandoAula.hora_inicio} - ${avaliandoAula.hora_fim}`
                : 'Modalidade não definida'}
            </h3>
            <div className="comentariosii-container">
              {comentarios.length === 0 ? (
                <p>Não há avaliações para esta aula.</p>
              ) : (
                comentarios.map((comentario) => (
                  <div key={comentario.id} className="comentarioii">
                    <p><strong>{comentario.autor_nome || 'Nome não disponível'}</strong> ({comentario.nota}★/5★)</p>
                    <p>{comentario.texto}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Aulas;
