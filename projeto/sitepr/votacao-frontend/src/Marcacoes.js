import Sidebar from './Sidebar';
import Header from './Header';
import './Marcacoes.css';

import React, { useState, useRef, useEffect } from 'react';

const todasModalidades = [
  'Crossfit', 'Yoga', 'Zumba', 'PT', 'Pilates',
  'JUMP', 'Kickboxing', 'HIIT', 'Capoeira', 'Boxe', 'Bicicleta'
];

const aulasDisponiveis = [
  {
    id: 1,
    data: '2025-05-15',
    horaInicio: '09:00',
    horaFim: '11:00',
    modalidade: 'Pilates',
    descricao: 'Aula de Pilates para todos os níveis.'
  },
  {
    id: 2,
    data: '2025-05-16',
    horaInicio: '17:00',
    horaFim: '19:00',
    modalidade: 'Pilates',
    descricao: 'Trabalho de respiração e postura com foco em flexibilidade.'
  },
  {
    id: 3,
    data: '2025-05-17',
    horaInicio: '08:00',
    horaFim: '10:00',
    modalidade: 'Yoga',
    descricao: 'Yoga matinal com foco em alongamento e respiração.'
  },
  {
    id: 4,
    data: '2025-05-18',
    horaInicio: '10:00',
    horaFim: '12:00',
    modalidade: 'Boxe',
    descricao: 'Aula de Boxe para iniciantes.'
  },
  {
    id: 5,
    data: '2025-05-19',
    horaInicio: '18:00',
    horaFim: '20:00',
    modalidade: 'Zumba',
    descricao: 'Aula animada de Zumba para todas as idades.'
  },
];

const Marcacoes = () => {
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [data, setData] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [aulasMarcadas, setAulasMarcadas] = useState([]);
  const dropdownRef = useRef(null);

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

  const aulasFiltradas = aulasDisponiveis.filter((aula) => {
    const correspondeModalidade =
      modalidadesSelecionadas.length === 0 ||
      modalidadesSelecionadas.includes(aula.modalidade);
    const correspondeData = data === '' || aula.data === data;

    return correspondeModalidade && correspondeData;
  });

  const alternarMarcacao = (id) => {
    setAulasMarcadas((prevMarcadas) =>
      prevMarcadas.includes(id)
        ? prevMarcadas.filter((marcada) => marcada !== id)
        : [...prevMarcadas, id]
    );
    setAulaSelecionada(null); // Fecha o modal
  };

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
                  {todasModalidades.map((mod, index) => (
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
          {aulasFiltradas.length === 0 ? (
            <p>Sem marcações no momento.</p>
          ) : (
            aulasFiltradas.map((aula) => (
              <button
                key={aula.id}
                className={`aula-botao ${aulasMarcadas.includes(aula.id) ? 'aula-marcada' : ''}`}
                onClick={() => setAulaSelecionada(aula)}
              >
                <strong>{aula.data}</strong><br />
                {aula.horaInicio} - {aula.horaFim}<br />
                {aula.modalidade}
              </button>
            ))
          )}
        </div>
      </div> {/* Fecha .container */}

      {aulaSelecionada && (
        <div className="detalhes-aula">
          <div className="modal-box">
            <h3>{aulaSelecionada.modalidade}</h3>
            <p><strong>Descrição:</strong> {aulaSelecionada.descricao}</p>
            <p><strong>Data:</strong> {aulaSelecionada.data}</p>
            <p><strong>Horário:</strong> {aulaSelecionada.horaInicio} - {aulaSelecionada.horaFim}</p>
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

