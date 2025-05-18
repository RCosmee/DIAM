import React, { useState, useEffect } from 'react';
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
  const [ptId, setPtId] = useState(null);
  const [erroDataHora, setErroDataHora] = useState('');
  const [modalidades, setModalidades] = useState([]);  // Para armazenar as modalidades

  // Função para obter o ID do usuário logado
  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/', { withCredentials: true });
      setPtId(response.data.id); // Definir o pt_id com o ID do usuário logado
    } catch (error) {
      console.error('Erro ao obter o usuário logado:', error);
    }
  };

  // Função para obter as modalidades
  const fetchModalidades = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/modalidades/');
      setModalidades(response.data);  // Armazenar as modalidades recebidas
    } catch (error) {
      console.error('Erro ao buscar modalidades:', error);
    }
  };

  // Hook para buscar o usuário logado e as modalidades quando o componente for montado
  useEffect(() => {
    fetchUserId();
    fetchModalidades();
  }, []);

  // Função para pegar o CSRF token
  const getCsrfToken = () => {
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/);
    return csrfToken ? csrfToken[1] : '';
  };

  // Função para validar se a data e hora de início são no futuro
  const validarDataHora = () => {
    const dataInicio = new Date(`${data}T${horaInicio}`);
    const dataFim = new Date(`${data}T${horaFim}`);
    const agora = new Date();

    // Verificar se a data de início é no futuro
    if (dataInicio <= agora) {
      setErroDataHora('A data e hora de início devem ser no futuro.');
      return false;
    }

    // Verificar se a data de fim é posterior à data de início
    if (dataFim <= dataInicio) {
      setErroDataHora('A data de fim deve ser posterior à data de início.');
      return false;
    }

    // Se tudo estiver válido, limpar a mensagem de erro
    setErroDataHora('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação das datas e horas
    if (!validarDataHora()) {
      return; // Não envia o formulário se a validação falhar
    }

    try {
      const csrfToken = getCsrfToken(); // Pega o CSRF token

      await axios.post('http://localhost:8000/api/aulas/', {
        modalidade_nome: modalidade,
        data,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        max_participantes: maxParticipantes,
        pt_id: ptId, // Adiciona o ID do usuário logado
      }, {
        withCredentials: true, // Envia cookies de autenticação
        headers: {
          'X-CSRFToken': csrfToken, // Inclui o CSRF token no cabeçalho
        }
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
            <select
              value={modalidade}
              onChange={(e) => setModalidade(e.target.value)}
              required
            >
              <option value="">Selecione uma modalidade</option>
              {modalidades.map((modalidade) => (
                <option key={modalidade.id} value={modalidade.nome}>
                  {modalidade.nome}
                </option>
              ))}
            </select>
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

        {/* Exibe mensagens de erro ou sucesso */}
        {erroDataHora && <p className="erro-mensagem">{erroDataHora}</p>}
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
};

export default CriarAula;
