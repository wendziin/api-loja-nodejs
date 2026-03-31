const request = require('supertest');
const app = require('../src/app'); // Importa o nosso servidor sem "ligar" a porta

describe('Testando o CRUD de Categorias', () => {
  it('Deve retornar status 200 ao buscar a lista de categorias', async () => {
    // Simula uma requisição GET na nossa rota
    const res = await request(app).get('/v1/category/search');
    
    // O Jest valida se o status HTTP foi 200 (OK)
    expect(res.statusCode).toEqual(200);
    
    // Valida se o retorno possui a propriedade "data"
    expect(res.body).toHaveProperty('data');
  });
});