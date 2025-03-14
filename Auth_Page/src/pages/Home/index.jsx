import { useEffect, useState} from "react";
import "./style.css";
import api from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    email: ""
  });
  
  async function getUsers() {
    try {
      setLoading(true);
      const usersFromApi = await api.get('/users');
      console.log("Dados recebidos:", usersFromApi.data);
      setUsers(usersFromApi.data);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setError("Falha ao carregar usuários. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }
  async function createUser(e) {
    e.preventDefault();
    try {
      // NÃO converta para número, pois seu modelo espera uma string
      // const age = parseInt(formData.idade, 10);
      
      if (!formData.nome || !formData.idade || !formData.email) {
        alert("Por favor, preencha todos os campos");
        return;
      }
      
      // Ajuste os nomes dos campos para corresponder ao modelo Prisma
      await api.post('/users', {
        name: formData.nome,     // Mudando de 'nome' para 'name'
        age: formData.idade,     // Mudando de 'idade' para 'age' (como string, sem parseInt)
        email: formData.email
      });
      
      // Limpar formulário
      setFormData({ nome: "", idade: "", email: "" });
      getUsers();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("Falha ao criar usuário. Tente novamente.");
    }
  }
  async function deleteUser(id) {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/users/${id}`);
        getUsers();
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        alert("Falha ao excluir usuário. Tente novamente.");
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <div className="main-content">
        <div className="header">
          <h1>Sistema de Gerenciamento de Usuários</h1>
          <p>Crie, visualize e gerencie usuários facilmente</p>
        </div>
        <div className="user-form-container">
          <h2>Crie o Seu Usuário</h2>
          <form onSubmit={createUser} className="user-form">
            <div className="form-group">
              <input 
                id="nome"
                type="text" 
                name="nome" 
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite o nome completo"
                required
              />
            </div>
            
            <div className="form-group">
              <input 
                id="idade"
                type="number" 
                name="idade" 
                value={formData.idade}
                onChange={handleChange}
                placeholder="Digite a idade"
                min="1"
                max="120"
                required
              />
            </div>
            
            <div className="form-group">
              <input 
                id="email"
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="exemplo@email.com"
                required
              />
            </div>
            
            <button type="submit" className="btn-submit">
              Adicionar Usuário
            </button>
          </form>
        </div>
      </div>

      <div className="users-list-container">
          {loading ? (
            <p className="loading-message">Carregando usuários...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : users.length === 0 ? (
            <p className="empty-message">Nenhum usuário cadastrado</p>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <div className="user-card" key={user.id}>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p><strong>Idade:</strong> {user.age} anos</p>
                    <p><strong>Email:</strong> {user.email}</p>
                  </div>
                  <button 
                    onClick={() => deleteUser(user.id)} 
                    className="btn-delete"
                    title="Excluir usuário"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  
  );
}

export default Home;