import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import './PaginaPrincipal.css';


const PaginaPrincipal = () => {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [aulasMarcadas, setAulasMarcadas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [aulasDoDiaSelecionado, setAulasDoDiaSelecionado] = useState([]);

  const diasDaSemana = [
    'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo'
  ];

  function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


  useEffect(() => {
    // Buscar aulas marcadas da API e guardar no state
    axios.get('http://localhost:8000/api/marcacoes/', { withCredentials: true })
      .then(res => {
        setAulasMarcadas(res.data);
      })
      .catch(err => {
        console.error('Erro ao buscar aulas marcadas:', err);
      });
  }, []);

  const gerarDiasDoMes = (ano, mes) => {
    const primeiroDiaDoMes = new Date(ano, mes, 1);
    const ultimoDiaDoMes = new Date(ano, mes + 1, 0);
    const dias = [];

    for (let i = 1; i <= ultimoDiaDoMes.getDate(); i++) {
      dias.push(new Date(ano, mes, i));
    }

    const diasAntes = primeiroDiaDoMes.getDay() === 0 ? 6 : primeiroDiaDoMes.getDay() - 1;
    const diasCompletos = [...Array(diasAntes).fill(null), ...dias];

    return diasCompletos;
  };

  const mudarMes = (incremento) => {
    setDataAtual((prevData) => {
      const novoMes = prevData.getMonth() + incremento;
      return new Date(prevData.getFullYear(), novoMes, 1);
    });
  };

  const formatarMesAno = () => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`;
  };

  const voltarAoMesAtual = () => {
    setDataAtual(new Date());
  };

  // Função para encontrar todas as aulas marcadas no dia
  const aulasDoDia = (date) => {
    if (!date) return [];
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return aulasMarcadas.filter(aula => aula.aula_detalhes && aula.status === 'marcada' && aula.aula_detalhes.data === dateStr);
  };

  // Abre modal mostrando todas as aulas do dia clicado
  const abrirModal = (date) => {
    if (!date) return;
    const aulas = aulasDoDia(date);
    setAulasDoDiaSelecionado(aulas);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setAulasDoDiaSelecionado([]);
  };

  const desmarcarAula = async (id) => {
  try {
    const csrfToken = getCookie('csrftoken');

    await axios.delete(`http://localhost:8000/api/marcacoes/${id}/`, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
      withCredentials: true,
    });

    setAulasMarcadas(prev => prev.filter(aula => aula.id !== id));
    setAulasDoDiaSelecionado(prev => prev.filter(aula => aula.id !== id));
  } catch (error) {
    console.error('Erro ao desmarcar aula:', error.response?.data || error.message);
  }
};
  const diasDoMes = gerarDiasDoMes(dataAtual.getFullYear(), dataAtual.getMonth());

  return (
    <>
      <Header />
      <Sidebar />
      <div className="pagina-principal">
        <div className="conteudo">
          <h1 className="subtituloPP">Página Principal</h1>
          <h2>O meu horário:</h2>

          <div className="calendario">
            <div className="mes-nav">
              <button onClick={() => mudarMes(-1)}>&lt;</button>
              <span>{formatarMesAno()}</span>
              <button onClick={() => mudarMes(1)}>&gt;</button>
              <button className="voltar-hoje" onClick={voltarAoMesAtual}>Hoje</button>
            </div>

            <div className="dias-semana">
              {diasDaSemana.map((dia, idx) => (
                <div key={idx} className="dia-semana">{dia}</div>
              ))}
            </div>

            <div className="dias-mes">
              {diasDoMes.map((dia, idx) => {
                if (!dia) return <div key={idx} className="dia-mes vazio"></div>;

                const hoje = new Date();
                const ehHoje =
                  dia.getDate() === hoje.getDate() &&
                  dia.getMonth() === hoje.getMonth() &&
                  dia.getFullYear() === hoje.getFullYear();

                const aulas = aulasDoDia(dia);

                // Ordenar por hora de início (mais cedo primeiro)
                const aulasOrdenadas = aulas.slice().sort((a, b) => {
                  return a.aula_detalhes.hora_inicio.localeCompare(b.aula_detalhes.hora_inicio);
                });

                const aulaMaisCedo = aulasOrdenadas[0];


                return (
                  <div
                    key={idx}
                    className={`dia-mes ${ehHoje ? 'hoje' : ''}`}
                    onClick={() => abrirModal(dia)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <div className="numero-dia">{dia.getDate()}</div>
                    {aulas.length > 0 && aulaMaisCedo && (
                      <div className="evento">
                        <strong>{aulaMaisCedo.aula_detalhes.modalidade.nome}</strong><br />
                        {aulaMaisCedo.aula_detalhes.hora_inicio} - {aulaMaisCedo.aula_detalhes.hora_fim}
                        {aulas.length > 1 && (
                          <div className="mais-aulas">+{aulas.length - 1}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="modale-backdrop" onClick={fecharModal}>
          <div className="modale-content" onClick={e => e.stopPropagation()}>
            <h2>Aulas do dia</h2>
            {aulasDoDiaSelecionado.length === 0 && <p>Sem aulas marcadas neste dia.</p>}
            {aulasDoDiaSelecionado.map(aula => (
              <div key={aula.id} className="aula-modale-item">
                <strong>{aula.aula_detalhes.modalidade.nome}</strong><br />
                <span>{aula.aula_detalhes.participantes_atual} / {aula.aula_detalhes.participantes_max} 👥 </span><br />
                {aula.aula_detalhes.hora_inicio} - {aula.aula_detalhes.hora_fim}<br />
                <button onClick={() => desmarcarAula(aula.id)}>Desmarcar</button>
              </div>
            ))}
            <button className="fechar-modale-btn" onClick={fecharModal}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaginaPrincipal;
