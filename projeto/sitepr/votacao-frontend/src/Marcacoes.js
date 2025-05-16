import Sidebar from './Sidebar';
import Header from './Header';
import './Marcacoes.css';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';

const Marcacoes = () => {
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [data, setData] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [aulasMarcadas, setAulasMarcadas] = useState([]);
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/aulas/')
      .then((response) => {
        setAulasDisponiveis(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar aulas:', error);
      });
  }, []);

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
    setModalidadesSelecionadas((prev) =>
      prev.includes(modalidade)
        ? prev.filter((m) => m !== modalidade)
        : [...prev, modalidade]
    );
  };

  const confirmarSelecao = () => {
    setMostrarDropdown(false);
  };

  // Filtra aulas conforme modalidades (pelo nome da modalidade) e data
  const aulasFiltradas = aulasDisponiveis.filter((aula) => {
    const nomeModalidade = aula.modalidade?.nome;
    const correspondeModalidade =
      modalidadesSelecionadas.length === 0 || modalidadesSelecionadas.includes(nomeModalidade);
    const correspondeData = data === '' || aula.data === data;

    return correspondeModalidade && correspondeData;
  });

  // Ordena aulas da mais antiga para a mais futura
  const aulasOrdenadas = aulasFiltradas.slice().sort((a, b) => {
    const dataHoraA = new Date(`${a.data.split('-').reverse().join('-')}T${a.hora_inicio}`);
    const dataHoraB = new Date(`${b.data.split('-').reverse().join('-')}T${b.hora_inicio}`);
    return dataHoraA - dataHoraB;
  });

  const alternarMarcacao = (id) => {
    setAulasMarcadas((prevMarcadas) =>
      prevMarcadas.includes(id)
        ? prevMarcadas.filter((marcada) => marcada !== id)
        : [...prevMarcadas, id]
    );
    setAulaSelecionada(null);
  };

  // Coleta lista única de modalidades dos dados recebidos (caso não use todasModalidades fixo)
  const modalidadesUnicas = Array.from(new Set(aulasDisponiveis.map(a => a.modalidade?.nome).filter(Boolean)));

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="container">
        <h2 className="subtitulo">Marcações</h2>

        <div className="filtros">
          <label>
            Modalidade:
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
                        checked={modalidadesSelecionadas.includes(mod)}
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
            Data:
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
                className={`aula-botao ${aulasMarcadas.includes(aula.id) ? 'aula-marcada' : ''}`}
                onClick={() => setAulaSelecionada(aula)}
              >
                <strong>{aula.data}</strong><br />
                {aula.hora_inicio} - {aula.hora_fim}<br />
                {aula.modalidade?.nome}
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
              <button onClick={() => alternarMarcacao(aulaSelecionada.id)}>
                {aulasMarcadas.includes(aulaSelecionada.id) ? 'Desmarcar' : 'Marcar'}
              </button>
              <button onClick={() => setAulaSelecionada(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marcacoes;
