import Sidebar from './Sidebar';
import Header from './Header';
import './Marcacoes.css';

import React, { useState, useRef, useEffect } from 'react';

const todasModalidades = [
  'Crossfit', 'Yoga', 'Zumba', 'PT', 'Pilates',
  'JUMP', 'Kickboxing', 'HIIT', 'Capoeira', 'Boxe', 'Bicicleta'
];

// Simulação de aulas
const aulasExemplo = [
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
    data: '2025-05-15',
    horaInicio: '17:00',
    horaFim: '19:00',
    modalidade: 'Crossfit',
    descricao: 'Crossfit de alta intensidade.'
  },
  {
    id: 3,
    data: '2025-05-16',
    horaInicio: '08:00',
    horaFim: '10:00',
    modalidade: 'Yoga',
    descricao: 'Aula de Yoga matinal para relaxar.'
  },
  {
    id: 4,
    data: '2025-05-16',
    horaInicio: '18:00',
    horaFim: '20:00',
    modalidade: 'Zumba',
    descricao: 'Zumba para melhorar seu cardio com diversão!'
  },
];

const Marcacoes = () => {
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [data, setData] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [aulasMarcadas, setAulasMarcadas] = useState([]);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);

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

  const aulasFiltradas = aulasExemplo.filter((aula) => {
    const matchModalidade =
      modalidadesSelecionadas.length === 0 || modalidadesSelecionadas.includes(aula.modalidade);
    const matchData = !data || aula.data === data;
    return matchModalidade && matchData;
  });

  const alternarMarcacao = (id) => {
    setAulasMarcadas((prev) =>
      prev.includes(id) ? prev.filter((aulaId) => aulaId !== id) : [...prev, id]
    );
    setAulaSelecionada(null);
  };

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="container">
        <h2 className="subtitulo">Marcações</h2>

        <div className="filtros">
          <label style={{ marginRight: '10px' }}>
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
          {aulasFiltradas.length === 0 && <p>Nenhuma aula encontrada.</p>}
          {aulasFiltradas.map((aula) => (
            <button
              key={aula.id}
              className={`aula-botao ${aulasMarcadas.includes(aula.id) ? 'marcada' : ''}`}
              onClick={() => setAulaSelecionada(aula)}
            >
              <div>{aula.data}</div>
              <div>{aula.horaInicio} - {aula.horaFim}</div>
              <div>{aula.modalidade}</div>
            </button>
          ))}
        </div>
      </div>

      {aulaSelecionada && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{aulaSelecionada.modalidade}</h3>
            <p>{aulaSelecionada.descricao}</p>
            <p>{aulaSelecionada.data} | {aulaSelecionada.horaInicio} - {aulaSelecionada.horaFim}</p>
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
