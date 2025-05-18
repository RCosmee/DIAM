import Sidebar from './Sidebar';
import Header from './Header';
import './Marcacoes.css';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';

const Marcacoes = () => {
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [modalidadesTemp, setModalidadesTemp] = useState([]); // Modalidades temporárias
  const [data, setData] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [aulasMarcadas, setAulasMarcadas] = useState([]);
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
  const [userId, setUserId] = useState(null);
  const dropdownRef = useRef(null);

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

  // Buscar utilizador
  useEffect(() => {
    axios.get('http://localhost:8000/api/user/', { withCredentials: true })
      .then((response) => {
        setUserId(response.data.id);
      })
      .catch((error) => {
        console.error('Erro ao buscar utilizador:', error);
      });
  }, []);

  // Buscar aulas
  useEffect(() => {
    axios.get('http://localhost:8000/api/aulas/', { withCredentials: true })
      .then((response) => {
        setAulasDisponiveis(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar aulas:', error);
      });
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios.get('http://localhost:8000/api/marcacoes/', { withCredentials: true })
      .then((response) => {
        const marcacoesDoUser = response.data.filter(m => m.user === userId);
        const dadosFormatados = marcacoesDoUser
          .filter(m => m.status !== 'cancelada')
          .map(m => ({
            aulaId: m.aula_detalhes.id,
            marcacaoId: m.id,
            status: m.status,
            aulaDetalhes: m.aula_detalhes
          }));

        setAulasMarcadas(dadosFormatados);
      })
      .catch((error) => {
        console.error('Erro ao buscar marcações:', error);
      });
  }, [userId]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleModalidade = (modalidade) => {
    setModalidadesTemp((prev) =>
      prev.includes(modalidade)
        ? prev.filter((m) => m !== modalidade)
        : [...prev, modalidade]
    );
  };

  const confirmarSelecao = () => {
    setModalidadesSelecionadas(modalidadesTemp);  // Atualiza as modalidades selecionadas
    setMostrarDropdown(false);
  };

  const aulasFiltradas = aulasDisponiveis.filter((aula) => {
    const hoje = new Date();
    const dataHora = new Date(`${aula.data}T${aula.hora_inicio}`);
    
    if (dataHora < hoje || aula.status === 'cancelada') return false;
    
    const nomeModalidade = aula.modalidade?.nome;
    const correspondeModalidade =
      modalidadesSelecionadas.length === 0 || modalidadesSelecionadas.includes(nomeModalidade);
    const correspondeData = data === '' || aula.data === data;
    
    return correspondeModalidade && correspondeData;
  });

  const aulasOrdenadas = aulasFiltradas.slice().sort((a, b) => {
    const dataHoraA = new Date(`${a.data}T${a.hora_inicio}`);
    const dataHoraB = new Date(`${b.data}T${b.hora_inicio}`);
    if (dataHoraA < dataHoraB) return -1;
    if (dataHoraA > dataHoraB) return 1;
    const nomeA = a.modalidade?.nome?.toLowerCase() || '';
    const nomeB = b.modalidade?.nome?.toLowerCase() || '';
    return nomeA.localeCompare(nomeB);
  });

  const alternarMarcacao = async (aulaId) => {
    const marcada = aulasMarcadas.find((m) => m.aulaId === aulaId);

    try {
      if (marcada) {
        await axios.delete(`http://localhost:8000/api/marcacoes/${marcada.marcacaoId}/`, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });
        setAulasMarcadas((prev) => prev.filter((m) => m.aulaId !== aulaId));
      } else {
        const response = await axios.post(
          `http://localhost:8000/api/marcacoes/?idaula=${aulaId}`,
          {},
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        );
        setAulasMarcadas((prev) => [...prev, { aulaId: aulaId, marcacaoId: response.data.id }]);
      }

      // Atualizar a lista de aulas disponíveis para refletir participantes_atual
      const response = await axios.get('http://localhost:8000/api/aulas/', { withCredentials: true });
      setAulasDisponiveis(response.data);

      setAulaSelecionada(null);
    } catch (error) {
      console.error('Erro ao (des)marcar aula:', error);
    }
  };

  const modalidadesUnicas = Array.from(new Set(aulasDisponiveis.map(a => a.modalidade?.nome).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="container">
        <h2 className="subtitulo">Marcações</h2>
        <p>{aulasMarcadas.length} aula(s) marcadas.</p>

       <div className="filtros">
        <label>
          <span>Modalidade: </span>
          <div className="dropdown-container" ref={dropdownRef}>
            <div
              className="select-box"
              onClick={() => setMostrarDropdown(!mostrarDropdown)}
            >
              Selecione ▾
            </div>
            {mostrarDropdown && (
              <div className="dropdown">
                {modalidadesUnicas.map((mod, index) => (
                  <label key={index} className="option">
                    <input
                      type="checkbox"
                      checked={modalidadesTemp.includes(mod)} // Usando modalidadesTemp
                      onChange={() => toggleModalidade(mod)}
                    />
                    {mod}
                  </label>
                ))}
                <button
                  className="confirm-button"
                  onClick={confirmarSelecao}
                >
                  Confirmar
                </button>
              </div>
            )}
          </div>
        </label>

        <label>
          <span>Data: </span>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="input"
          />
        </label>
      </div>

        <div className="aulas-container">
          {aulasOrdenadas.length === 0 ? (
            <p>Sem marcações no momento.</p>
          ) : (
            aulasOrdenadas.map((aula) => (
              <button
                key={aula.id}
                className={`aula-botao ${aulasMarcadas.some(m => m.aulaId === aula.id) ? 'aula-marcada' : aula.participantes_atual >= aula.max_participantes ? 'aula-cheia' : ''}`}
                onClick={() => {
                  const marcada = aulasMarcadas.some(m => m.aulaId === aula.id);
                  const cheia = aula.participantes_atual >= aula.max_participantes;
                  if (!cheia || marcada) {
                    setAulaSelecionada(aula);
                  }
                }}
              >
                <strong>{aula.data}</strong><br />
                {aula.hora_inicio} - {aula.hora_fim}<br />
                {aula.modalidade?.nome}<br />
                {aula.participantes_atual} / {aula.max_participantes} 👥
              </button>
            ))
          )}
        </div>
      </div>

      {aulaSelecionada && (
        <div className="detalhes-aula">
          <div className="modal-box">
            <h3>{aulaSelecionada.modalidade?.nome}</h3>
            <p><strong>Descrição:</strong> {aulaSelecionada.modalidade?.descricao}</p>
            <p><strong>Data:</strong> {aulaSelecionada.data}</p>
            <p><strong>Horário:</strong> {aulaSelecionada.hora_inicio} - {aulaSelecionada.hora_fim}</p>
            <div className="modal-buttons">
              <button className="modal-buttons-fechar" onClick={() => setAulaSelecionada(null)}>Fechar</button>
              <button onClick={() => alternarMarcacao(aulaSelecionada.id)}>
                {aulasMarcadas.some(m => m.aulaId === aulaSelecionada.id) ? 'Desmarcar' : 'Marcar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marcacoes;
