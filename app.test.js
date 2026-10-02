const {
  clientes, pets, produtos, carrinho,
  criarCliente, cadastrarPet, criarProduto,
  adicionarCarrinho, removerCarrinho,
  calcularTotal, finalizarCompra, nextSlide, prevSlide
} = require('./app.js');

describe('Suíte de Testes PetShop Doguito (Jest)', () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="clienteNome" />
      <input id="clienteEmail" />
      <input type="checkbox" id="clienteVip" />
      <ul id="listaClientes"></ul>

      <input id="petNome" />
      <input id="petTipo" />
      <input id="petIdade" />
      <ul id="listaPets"></ul>

      <input id="produtoNome" />
      <input id="produtoPreco" />
      <ul id="listaProdutos"></ul>

      <select id="produtoSelect"></select>
      <ul id="listaCarrinho"></ul>
      <span id="total">0</span>

      <div class="slides" style="transform: translateX(0%)">
        <div class="slide"></div>
        <div class="slide"></div>
        <div class="slide"></div>
      </div>
    `;
    clientes.length = 0;
    pets.length = 0;
    produtos.length = 0;
    carrinho.length = 0;

    window.alert = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  
  describe('1. Testes de Cliente', () => {
    test('1. Deve permitir criar cliente com nome válido [v]', () => {
      document.getElementById('clienteNome').value = 'João Silva';
      document.getElementById('clienteEmail').value = 'joao@email.com';
      criarCliente();
      expect(clientes.length).toBe(1);
      expect(clientes[0].nome).toBe('João Silva');
    });

    test('2. Não deve permitir cliente com nome vazio [v]', () => {
      document.getElementById('clienteNome').value = '';
      document.getElementById('clienteEmail').value = 'joao@email.com';
      criarCliente();
      expect(clientes.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Nome inválido');
    });

    test('3. Deve permitir cadastrar cliente com email válido [v]', () => {
      document.getElementById('clienteNome').value = 'Maria';
      document.getElementById('clienteEmail').value = 'maria@teste.com';
      criarCliente();
      expect(clientes[0].email).toBe('maria@teste.com');
    });

    test('4. Não deve permitir email inválido [v]', () => {
      document.getElementById('clienteNome').value = 'Maria';
      document.getElementById('clienteEmail').value = 'emailinvalido';
      criarCliente();
      expect(clientes.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Email inválido');
    });

    test('5. Deve permitir marcar cliente como VIP [v]', () => {
      document.getElementById('clienteNome').value = 'Carlos';
      document.getElementById('clienteEmail').value = 'carlos@email.com';
      document.getElementById('clienteVip').checked = true;
      criarCliente();
      expect(clientes[0].vip).toBe(true);
    });
  });

  describe('2. Testes de Pet', () => {
    test('6. Deve permitir cadastrar um pet [v]', () => {
      document.getElementById('petNome').value = 'Rex';
      document.getElementById('petTipo').value = 'Cachorro';
      document.getElementById('petIdade').value = '3';
      cadastrarPet();
      expect(pets.length).toBe(1);
    });

    test('7. Pet deve possuir nome obrigatório [v]', () => {
      document.getElementById('petNome').value = '';
      cadastrarPet();
      expect(pets.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Pet precisa de nome');
    });

    test('8. Pet deve possuir tipo (cachorro, gato, etc) [x - Falha na implementação atual]', () => {
      document.getElementById('petNome').value = 'Bob';
      document.getElementById('petTipo').value = ''; // Tipo vazio
      document.getElementById('petIdade').value = '2';
      cadastrarPet();
      
      // O teste falha pois o sistema cadastra pet sem tipo
      expect(pets[0].tipo).not.toBe('');
    });

    test('9. Pet deve possuir idade válida (número) [x - Falha na implementação atual]', () => {
      document.getElementById('petNome').value = 'Rex';
      document.getElementById('petTipo').value = 'Cachorro';
      document.getElementById('petIdade').value = 'abc'; // Idade inválida
      cadastrarPet();

      // O teste falha pois o código atual gera NaN e não impede o cadastro
      expect(Number.isNaN(pets[0].idade)).toBe(false);
    });
  });

  describe('3. Testes de Produto', () => {
    test('10. Deve permitir criar produto com nome [v]', () => {
      document.getElementById('produtoNome').value = 'Ração';
      document.getElementById('produtoPreco').value = '50';
      criarProduto();
      expect(produtos[0].nome).toBe('Ração');
    });

    test('11. Produto deve possuir preço maior que zero [x - Falha na implementação atual]', () => {
      document.getElementById('produtoNome').value = 'Amostra Grátis';
      document.getElementById('produtoPreco').value = '0';
      criarProduto();

      // O teste falha pois aceita preço igual a 0 (código atual só barra preco < 0)
      expect(produtos.length).toBe(0);
    });

    test('12. Produto não pode possuir preço negativo [v]', () => {
      document.getElementById('produtoNome').value = 'Shampoo';
      document.getElementById('produtoPreco').value = '-10';
      criarProduto();
      expect(produtos.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Preço inválido');
    });

    test('13. Produto deve aparecer na lista de produtos cadastrados [v]', () => {
      document.getElementById('produtoNome').value = 'Coleira';
      document.getElementById('produtoPreco').value = '25';
      criarProduto();

      const lista = document.getElementById('listaProdutos');
      expect(lista.children.length).toBe(1);
      expect(lista.children[0].innerText).toContain('Coleira');
    });
  });

  describe('4. Testes de Carrinho', () => {
    beforeEach(() => {
      produtos.push({ nome: 'Ração 10kg', preco: 120.00 });
      produtos.push({ nome: 'Brinquedo', preco: 30.00 });
      
      const select = document.getElementById('produtoSelect');
      select.innerHTML = '<option value="0">Ração 10kg</option><option value="1">Brinquedo</option>';
    });

    test('14. Deve permitir adicionar produto ao carrinho [v]', () => {
      document.getElementById('produtoSelect').value = '0';
      adicionarCarrinho();
      expect(carrinho.length).toBe(1);
      expect(carrinho[0].nome).toBe('Ração 10kg');
    });

    test('15. Deve permitir remover produto do carrinho [x - Falha com carrinho vazio na implementação atual]', () => {
      // Ao tentar remover sem itens, a implementação atual faz shift() sem tratar carrinho vazio
      removerCarrinho();
      expect(carrinho.length).toBe(0);
    });

    test('16. Carrinho deve listar todos os produtos adicionados [v]', () => {
      carrinho.push({ nome: 'Ração 10kg', preco: 120.00 }, { nome: 'Brinquedo', preco: 30.00 });
      
      document.getElementById('produtoSelect').value = '0';
      adicionarCarrinho(); // renderiza carrinho
      
      const lista = document.getElementById('listaCarrinho');
      expect(lista.children.length).toBe(3);
    });

    test('17. Carrinho deve calcular o valor total da compra [v]', () => {
      carrinho.push({ nome: 'Brinquedo', preco: 30.00 }, { nome: 'Petisco', preco: 20.00 });
      const total = calcularTotal();
      expect(total).toBe('50.00');
    });
  });

  describe('5. Testes de Regras de Negócio', () => {
    test('18. Compra acima de R$100 deve aplicar desconto de 10% [v]', () => {
      carrinho.push({ nome: 'Ração Premium', preco: 150.00 });
      const total = calcularTotal();
      expect(total).toBe('135.00'); // 150 - 10% = 135
    });

    test('19. Cliente VIP deve receber desconto de 15% [x - Falha na implementação atual]', () => {
      // Regra de VIP não foi implementada na função calcularTotal()
      clientes.push({ nome: 'Ana', email: 'ana@email.com', vip: true });
      carrinho.push({ nome: 'Produto', preco: 100.00 });
      
      const total = calcularTotal();
      expect(total).toBe('85.00'); // Falhará pois o código retorna 100.00
    });

    test('20. Carrinho não deve aceitar produto com preço igual a zero [x - Falha na implementação atual]', () => {
      produtos.push({ nome: 'Grátis', preco: 0 });
      
      const select = document.getElementById('produtoSelect');
      select.innerHTML = '<option value="0">Grátis</option>';
      select.value = '0';

      adicionarCarrinho();
      
      // O teste falhará pois o carrinho aceita produto com preço 0
      expect(carrinho.length).toBe(0);
    });
  });

  describe('6. Outros Testes', () => {
    test('21. Carrinho vazio deve retornar total igual a 0 [v]', () => {
      const total = calcularTotal();
      expect(total).toBe('0.00');
    });

    test('22. Ao finalizar compra o carrinho deve ser limpo [v]', () => {
      carrinho.push({ nome: 'Ração', preco: 50.00 });
      finalizarCompra();
      expect(carrinho.length).toBe(0);
    });

    test('23. O carrossel deve trocar automaticamente as imagens [v]', () => {
      nextSlide();
      const slides = document.querySelector('.slides');
      expect(slides.style.transform).toBe('translateX(-100%)');
    });

    test('24. Os botões Adicionar / Remover / Finalizar devem funcionar corretamente [v]', () => {
      produtos.push({ nome: 'Shampoo', preco: 25.00 });
      document.getElementById('produtoSelect').innerHTML = '<option value="0">Shampoo</option>';

      adicionarCarrinho();
      expect(carrinho.length).toBe(1);

      removerCarrinho();
      expect(carrinho.length).toBe(0);

      carrinho.push({ nome: 'Shampoo', preco: 25.00 });
      finalizarCompra();
      expect(carrinho.length).toBe(0);
    });
  });

});
