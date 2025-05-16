import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './CriarAula.css';
import axios from 'axios';

const CriarAula = () => {
  const [modalidade, setModalidade] = useState('');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [maxParticipantes, setMaxParticipantes] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/aulas/', {
        modalidade_nome: modalidade,
        data,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        max_participantes: maxParticipantes
      });
      setMensagem('✅ Aula criada com sucesso!');
      // Limpa os campos
      setModalidade('');
      setData('');
      setHoraInicio('');
      setHoraFim('');
      setMaxParticipantes('');
    } catch (error) {
      console.error('Erro ao criar aula:', error);
      setMensagem('❌ Erro ao criar aula.');
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="criar-aula-container">
        <h2>Criar Nova Aula</h2>
        <form className="criar-aula-form" onSubmit={handleSubmit}>
          <label>
            Modalidade:
            <input
              type="text"
              value={modalidade}
              onChange={(e) => setModalidade(e.target.value)}
              required
            />
          </label>
          <label>
            Data:
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </label>
          <label>
            Hora Início:
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
          </label>
          <label>
            Hora Fim:
            <input
              type="time"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
              required
            />
          </label>
          <label>
            Máximo de Participantes:
            <input
              type="number"
              min="1"
              value={maxParticipantes}
              onChange={(e) => setMaxParticipantes(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn-criar">Criar Aula</button>
        </form>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
};

export default CriarAula;
