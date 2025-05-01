import React, { useState } from 'react';
import './PaginaPrincipal.css';

const PaginaPrincipal = () => {
  const [dataAtual, setDataAtual] = useState(new Date());

  const diasDaSemana = [
    'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo'
  ];

  // Função para gerar os dias do mês com base no mês e ano
  const gerarDiasDoMes = (ano, mes) => {
    const primeiroDiaDoMes = new Date(ano, mes, 1);
    const ultimoDiaDoMes = new Date(ano, mes + 1, 0);
    const dias = [];

    // Preenche os dias do mês
    for (let i = 1; i <= ultimoDiaDoMes.getDate(); i++) {
      dias.push(new Date(ano, mes, i));
    }

    // Preenche os dias anteriores (caso o primeiro dia não seja segunda-feira)
    const diasAntes = primeiroDiaDoMes.getDay() === 0 ? 6 : primeiroDiaDoMes.getDay() - 1;
    const diasCompletos = [...Array(diasAntes).fill(null), ...dias];

    return diasCompletos;
  };

  // Função para navegar entre meses
  const mudarMes = (incremento) => {
    setDataAtual((prevData) => {
      const novoMes = prevData.getMonth() + incremento;
      return new Date(prevData.getFullYear(), novoMes, 1);
    });
  };

  // Função para formatar o mês (ex: "Abril 2025")
  const formatarMesAno = () => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const mes = meses[dataAtual.getMonth()];
    const ano = dataAtual.getFullYear();
    return `${mes} ${ano}`;
  };

  // Função para voltar ao mês de hoje
  const voltarAoMesAtual = () => {
    setDataAtual(new Date());
  };

  const diasDoMes = gerarDiasDoMes(dataAtual.getFullYear(), dataAtual.getMonth());

  return (
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
              const hoje = new Date();
              const ehHoje =
                dia &&
                dia.getDate() === hoje.getDate() &&
                dia.getMonth() === hoje.getMonth() &&
                dia.getFullYear() === hoje.getFullYear();

              return (
                <div key={idx} className={`dia-mes ${ehHoje ? 'hoje' : ''}`}>
                  {dia ? (
                    <>
                      <div className="numero-dia">{dia.getDate()}</div>
                      {dia.getDate() === 30 && (
                        <div className="evento">
                          Pilates <br /> 18h-20h
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="dia-mes vazio"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaPrincipal;
