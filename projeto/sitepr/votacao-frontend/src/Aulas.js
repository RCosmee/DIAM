import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Aulas.css';
import Sidebar from './Sidebar';
import Header from './Header';
const Aulas = () => {
  const [aulas, setAulas] = useState([]);

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/aulas/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAulas(response.data);
    } catch (error) {
      console.error('Erro ao buscar aulas', error);
    }
  };

  const removerAula = async (id) => {
    if (window.confirm("Tens a certeza que queres remover esta aula?")) {
      try {
        await axios.delete(`http://localhost:8000/api/aulas/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAulas(aulas.filter(aula => aula.id !== id));
      } catch (error) {
        console.error('Erro ao remover aula', error);
      }
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
    <div className="aulas-container">
      {aulas.length === 0 ? (
        <p>Não há aulas disponíveis.</p>
      ) : (
        aulas.map((aula) => (
          <div key={aula.id} className="aula-botao">
            <strong>{aula.modalidade.nome}</strong>
            <p>{aula.data} às {aula.hora_inicio}</p>
            <button onClick={() => removerAula(aula.id)}>Remover</button>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default Aulas;
