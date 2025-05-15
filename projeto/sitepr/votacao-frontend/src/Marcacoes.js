import Sidebar from './Sidebar';
import Header from './Header';
import './Marcacoes.css';

import React, { useState, useRef, useEffect } from 'react';

const todasModalidades = [
  'Crossfit', 'Yoga', 'Zumba', 'PT', 'Pilates',
  'JUMP', 'Kickboxing', 'HIIT', 'Capoeira', 'Boxe', 'Bicicleta'
];

const Marcacoes = () => {
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [data, setData] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [aulasMarcadas, setAulasMarcadas] = useState([]);
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
  const [novaAula, setNovaAula] = useState({
    modalidade: '',
    data: '',
    hora_inicio: '',
    hora_fim: '',
    descricao: ''
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Busca as aulas disponíveis do backend ao carregar o componente
    fetch('http://localhost:8000/api/aulas/')
      .then(response => response.json())
      .then(data => {
        // Como a modalidade vem como ID, pode ser necessário buscar o nome da modalidade aqui,
        // ou modificar o backend para retornar nome da modalidade diretamente.
        setAulasDisponiveis(data);
      });

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
      modalidadesSelecionadas.includes(aula.modalidade_nome || aula.modalidade); // aqui supõe-se que você tenha o nome da modalidade ou o ID
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

  // Função para adicionar nova aula via POST para o backend
  const adicionarAula = (e) => {
    e.preventDefault();

    // Transformar modalidade em ID? Supondo que a modalidade seja o nome, você pode precisar ajustar isso no backend
    // Para teste, vamos enviar a modalidade como string. Se for necessário, ajuste para enviar o ID da modalidade.

    const payload = {
      modalidade: novaAula.modalidade,  // Se for ID, coloque o ID aqui
      data: novaAula.data,
      hora_inicio: novaAula.hora_inicio,
      hora_fim: novaAula.hora_fim,
      descricao: novaAula.descricao,
      max_participantes: 20  // Pode adicionar campo no formulário para isso se quiser
    };

    fetch('http://localhost:8000/api/aulas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (response.ok) {
        alert('Aula adicionada com sucesso!');
        // Atualiza a lista de aulas após adicionar
        return response.json();
      } else {
        alert('Erro ao adicionar aula.');
        throw new Error('Erro ao adicionar aula');
      }
    })
    .then(novaAulaCriada => {
      setAulasDisponiveis([...aulasDisponiveis, novaAulaCriada]);
      setNovaAula({
        modalidade: '',
        data: '',
        hora_inicio: '',
        hora_fim: '',
        descricao: ''
      });
    })
    .catch(console.error);
  };

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="container">
        <h2 className="subtitulo">Marcações</h2>

        {/* FORMULÁRIO PARA ADICIONAR NOVA AULA */}
        <form onSubmit={adicionarAula} className="formulario-aula">
          <h3>Adicionar Nova Aula</h3>
          <input
            type="text"
            placeholder="Modalidade (ex: Pilates)"
            value={novaAula.modalidade}
            onChange={(e) => setNovaAula({ ...novaAula, modalidade: e.target.value })}
            required
          />
          <input
            type="date"
            value={novaAula.data}
            onChange={(e) => setNovaAula({ ...novaAula, data: e.target.value })}
            required
          />
          <input
            type="time"
            value={novaAula.hora_inicio}
            onChange={(e) => setNovaAula({ ...novaAula, hora_inicio: e.target.value })}
            required
          />
          <input
            type="time"
            value={novaAula.hora_fim}
            onChange={(e) => setNovaAula({ ...novaAula, hora_fim: e.target.value })}
            required
          />
          <textarea
            placeholder="Descrição"
            value={novaAula.descricao}
            onChange={(e) => setNovaAula({ ...novaAula, descricao: e.target.value })}
            required
          ></textarea>
          <button type="submit">Adicionar Aula</button>
        </form>

        {/* FILTROS DE MODALIDADE E DATA */}
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

        {/* LISTA DE AULAS FILTRADAS */}
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
                {/* Se tiver nome da modalidade, use aula.modalidade_nome, senão aula.modalidade */}
                {aula.modalidade_nome || aula.modalidade}
              </button>
            ))
          )}
        </div>
      </div> {/* Fecha .container */}

      {/* DETALHES DA AULA SELECIONADA */}
      {aulaSelecionada && (
        <div className="detalhes-aula">
          <div className="modal-box">
            <h3>{aulaSelecionada.modalidade_nome || aulaSelecionada.modalidade}</h3>
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
