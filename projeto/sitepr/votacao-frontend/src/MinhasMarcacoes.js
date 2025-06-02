import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import './MinhasMarcacoes.css';

const MinhasMarcacoes = () => {
  const [aulasMarcadas, setAulasMarcadas] = useState([]);
  const [avaliandoAula, setAvaliandoAula] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [medias, setMedias] = useState({});

  // Pega o CSRF cookie
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

useEffect(() => {
  async function fetchMedias() {
    const mediasTemp = {};
    for (const aula of aulasMarcadas) {
      try {
        const res = await axios.get(`http://localhost:8000/api/comentarios/?aula_id=${aula.id}`, { withCredentials: true });
        const comentarios = res.data || [];
        if (comentarios.length > 0) {
          const soma = comentarios.reduce((acc, c) => acc + c.nota, 0);
          mediasTemp[aula.id] = soma / comentarios.length;
        } else {
          mediasTemp[aula.id] = 0;
        }
      } catch (error) {
        mediasTemp[aula.id] = 0;
      }
    }
    setMedias(mediasTemp);
  }

  if (aulasMarcadas.length > 0) {
    fetchMedias();
  }
}, [aulasMarcadas]);


  useEffect(() => {
    // Busca as marcações do usuário
    axios.get('http://localhost:8000/api/marcacoes/', { withCredentials: true })
      .then((res) => {
        const aulas = res.data.map((m) => ({
          id: m.aula_detalhes.id,
          marcacaoId: m.id,  // <- este é o que deve ser usado para deletar!
          data: m.aula_detalhes.data,
          hora_inicio: m.aula_detalhes.hora_inicio,
          hora_fim: m.aula_detalhes.hora_fim,
          modalidade: m.aula_detalhes.modalidade.nome,
          descricao: m.aula_detalhes.modalidade.descricao,
          participantes_atual: m.aula_detalhes.participantes_atual,
          max_participantes: m.aula_detalhes.max_participantes,
          status: m.status,
        }));

        aulas.sort((a, b) => new Date(`${a.data}T${a.hora_inicio}`) - new Date(`${b.data}T${b.hora_inicio}`));
        console.log("Aulas Marcadas:", aulas);

        setAulasMarcadas(aulas);
      })
      .catch((err) => {
        console.error('Erro ao buscar marcações:', err);
      });
  }, []);

const desmarcarAula = async (marcacaoId) => {
  try {
    await axios.delete(`http://localhost:8000/api/marcacoes/${marcacaoId}/`, {
      withCredentials: true,
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
    });
    setAulasMarcadas((prev) => prev.filter((aula) => aula.marcacaoId !== marcacaoId));
  } catch (error) {
    console.error('Erro ao desmarcar aula:', error);
  }
};


  const abrirModalAvaliacao = async (aula) => {
    setAvaliandoAula(aula);
    setNovoComentario('');
    setNota(0);
    setHoverNota(0);

    try {
      const res = await axios.get(`http://localhost:8000/api/comentarios/?aula_id=${aula.id}`, { withCredentials: true });
      setComentarios(res.data || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setComentarios([]);
    }
  };
  
    const enviarAvaliacao = async () => {
  if (nota === 0) return;

  try {
    // Envia a avaliação sem fechar o modal imediatamente
    await axios.post('http://localhost:8000/api/comentarios/', {
      aula: avaliandoAula.id,
      nota,
      texto: novoComentario.trim() || '',
    }, {
      withCredentials: true,
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
    });

    // Após enviar, busque novamente os comentários atualizados
    const res = await axios.get(`http://localhost:8000/api/comentarios/?aula_id=${avaliandoAula.id}`, { withCredentials: true });
    setComentarios(res.data || []);

    // Limpar os campos de input, mas manter o modal aberto
    setNovoComentario('');
    setNota(0);
    // Não fechamos o modal aqui, apenas limpamos os inputs
  } catch (error) {
    if (error.response) {
      console.error('Erro ao enviar avaliação:', error.response.data);
    } else {
      console.error('Erro ao enviar avaliação:', error.message);
    }
  }
};




const fecharModalAvaliacao = () => {
  setAvaliandoAula(null);
  setComentarios([]);  // Limpa os comentários para o próximo modal
  setNovoComentario('');
  setNota(0);
  setHoverNota(0);

  // Ao fechar o modal, atualiza a média localmente
  if (avaliandoAula) {
    const novasAvaliacoes = comentarios;
    const soma = novasAvaliacoes.reduce((acc, c) => acc + c.nota, 0);
    const mediaAtualizada = soma / novasAvaliacoes.length;

    setMedias((prevMedias) => ({
      ...prevMedias,
      [avaliandoAula.id]: mediaAtualizada,
    }));
  }
};

const renderStar = (starNumber, media) => {
  if (media >= starNumber) {
    // Estrela cheia
    return (
      <svg key={starNumber} width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
      </svg>
    );
  } else if (media >= starNumber - 0.5) {
    // Estrela meio preenchida — usamos um clipPath para metade da estrela preenchida
    return (
      <svg key={starNumber} width="24" height="24" viewBox="0 0 24 24" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id={`halfGrad${starNumber}`}>
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="transparent" stopOpacity="1" />
          </linearGradient>
        </defs>
        <polygon
          points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"
          fill={`url(#halfGrad${starNumber})`}
        />
        <polygon
          points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"
          fill="none"
        />
      </svg>
    );
  } else {
    // Estrela vazia
    return (
      <svg key={starNumber} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
      </svg>
    );
  }
};


  // Renderiza estrelas com hover e click
  const renderStars = () =>
    [1, 2, 3, 4, 5].map((star) => {
      const isFilled = hoverNota >= star || (!hoverNota && nota >= star);
      return (
        <svg
          key={star}
          onClick={() => setNota(star)}
          onMouseEnter={() => setHoverNota(star)}
          onMouseLeave={() => setHoverNota(0)}
          className={`star ${isFilled ? 'filled' : ''}`}
          height="30"
          width="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ cursor: 'pointer' }}
        >
          <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
        </svg>
      );
    });

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="containerMM">
        <h2 className="subtituloMM">Minhas Marcações</h2>
        <p className="paragrafo-aulas">{aulasMarcadas.length} aula(s).</p>

        {aulasMarcadas.length === 0 ? (
          <p>Você ainda não marcou nenhuma aula.</p>
        ) : (
          aulasMarcadas.map((aula) => {
            // Aula pode ser avaliada se status cancelada e aula já terminou
            const podeAvaliar = aula.status === 'cancelada';

            return (
  <div
    className={`aula-card ${aula.status === 'cancelada' ? 'cancelada' : ''}`}
    key={aula.id}
    style={{ display: 'flex', flexDirection: 'column' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <div>
        <strong>{aula.modalidade}</strong>
        <div style={{ marginLeft: '10px' }}>
          <p>{aula.data} - {aula.hora_inicio} às {aula.hora_fim}</p>
          <p>{aula.descricao}</p>
          <p>Participantes: {aula.participantes_atual} / {aula.max_participantes} 👥</p>

          {aula.status === 'cancelada' && (
            <p>
              Média das avaliações:{' '}
              {[1, 2, 3, 4, 5].map(star => renderStar(star, medias[aula.id] || 0))}
              {' '}({medias[aula.id] ? medias[aula.id].toFixed(1) : 'Sem avaliações'})
            </p>
          )}
        </div>
      </div>

      <div className="botoes-aula">
        {aula.status !== 'cancelada' && (
          <button
            className="botao-desmarcar"
            onClick={() => desmarcarAula(aula.marcacaoId)}
          >
            Desmarcar
          </button>
        )}

                    {podeAvaliar && (
                      <button
                        className="botao-avaliar"
                        onClick={() => abrirModalAvaliacao(aula)}
                      >
                        Avaliar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {avaliandoAula && (
  <div className="modali-backdrop" onClick={fecharModalAvaliacao}>
    <div className="modali-content" onClick={e => e.stopPropagation()}>
      <h3>Avaliações para {avaliandoAula.modalidade} - {avaliandoAula.data}</h3>

      <div className="comentarios-lista" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1em' }}>
        {comentarios.length === 0 ? (
          <p>Nenhuma avaliação ainda.</p>
        ) : (
          comentarios.map(c => (
            <div key={c.id} className="comentario-item" style={{ borderBottom: '1px solid #ddd', padding: '5px 0' }}>
              {/* Linha do autor e data/hora */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', color: '#555', marginBottom: '4px' }}>
                <span><strong>{c.autor_nome || 'Anónimo'}</strong></span>
                <span>{new Date(c.criado_em).toLocaleString()}</span>
              </div>

              <p>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: s <= c.nota ? '#FFD700' : '#ccc' }}>★</span>
                ))}
              </p>
              <p>{c.texto}</p>
            </div>
          ))
        )}
      </div>


              <div className="estrelas-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5em' }}>
                {renderStars()}
              </div>

              <textarea
                rows="3"
                placeholder="Deixe seu comentário (opcional)..."
                value={novoComentario}
                onChange={e => setNovoComentario(e.target.value)}
                style={{ width: '100%', marginBottom: '0.5em' }}
              />
              <button onClick={fecharModalAvaliacao} style={{ marginLeft: '5em' }}>Fechar</button>
              <button onClick={enviarAvaliacao} disabled={nota === 0}>Enviar Avaliação</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinhasMarcacoes;
