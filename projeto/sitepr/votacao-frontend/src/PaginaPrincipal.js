import React from 'react';
import './PaginaPrincipal.css';

const PaginaPrincipal = () => {
  const diasDaSemana = [
    'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo'
  ];

  const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="pagina-principal">

      <div className="conteudo">

        <h2>O meu horário:</h2>
        <div className="calendario">
          <div className="mes-nav">&lt; Abril 2025 &gt;</div>

          <div className="dias-semana">
            {diasDaSemana.map((dia, idx) => (
              <div key={idx} className="dia-semana">{dia}</div>
            ))}
          </div>

          <div className="dias-mes">
            {diasMes.map((dia) => (
              <div key={dia} className="dia-mes">
                <div className="numero-dia">{dia}</div>
                {dia === 30 && (
                  <div className="evento">
                    Pilates <br /> 18h-20h
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaPrincipal;
