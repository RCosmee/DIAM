import Sidebar from './Sidebar';
import Header from './Header';
import './Marcacoes.css';

import React, { useState, useRef, useEffect } from 'react';
import api from './api'; // <- Importa o axios configurado

const todasModalidades = [
  'Crossfit', 'Yoga', 'Zumba', 'PT', 'Pilates',
  'JUMP', 'Kickboxing', 'HIIT', 'Capoeira', 'Boxe', 'Bicicleta'
];

const Marcacoes = () => {
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [data, setData] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [aulas, setAulas] = useState([]);
  const [aulasMarcadas, setAulasMarcadas] = useState([]);

  const dropdownRef = useRef(null);
  const userId = 1; // ← Aqui colocas o ID do utilizador autenticado

  useEffect(() => {
    api.get('aulas/')
      .then(response => setAulas(response.data))
      .catch(error => console.error('Erro ao buscar aulas:', error));
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

  const aulasFiltradas = aulas.filter((aula) => {
    const correspondeModalidade =
      modalidadesSelecionadas.length === 0 ||
      modalidadesSelecionadas.includes(aula.modalidade);
    const correspondeData = data === '' || aula.data === data;

    return correspondeModalidade && correspondeData;
  });

  const marcarAula = (aulaId) => {
    api.post('marcacoes/', {
      aula: aulaId,
      atleta: userId,
      status: 'marcada',
    })
      .then(() => {
        alert('Aula marcada com sucesso!');
        setAulasMarcadas(prev => [...prev, aulaId]);
      })
      .catch(() => alert('Erro ao marcar aula.'));
  };

  const desmarcarAula = (aulaId) => {
    // Aqui podes adaptar com DELETE ou outra rota do backend
    alert('Funcionalidade de desmarcar ainda não implementada.');
    setAulasMarcadas(prev => prev.filter(id => id !== aulaId));
  };

  const alternarMarcacao = (id) => {
    if (aulasMarcadas.includes(id)) {
      desmarcarAula(id);
    } else {
      marcarAula(id);
    }
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
                {aula.hora_inicio} - {aula.hora_fim}<br />
                {aula.modalidade}
              </button>
            ))
          )}
        </div>
      </div>

      {aulaSelecionada && (
        <div className="detalhes-aula">
          <div className="modal-box">
            <h3>{aulaSelecionada.modalidade}</h3>
            <p><strong>Descrição:</strong> {aulaSelecionada.descricao}</p>
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
