Atividade Prática - analise e teste com Jest do DOGUITO PETSHOP

ESTRUTURA DO PROJETO 
Contem HTML e JS modificados apos anailise dos erros; app.test.js com os testes automatizados e package.json feito.
CSS original sem modificações, e pasta com HTML E JS original disponivel na pasta Og code.

Para fazer os teste, tomei notas da maneira que foi feita os testes unitários no código do sistema bancario.
OBVIAMENTE com diferenças ja que estamos trabalhando com JS/JEST ao contrario de com testes unitários JAVA/JUNIT

No app.js original, ele não passou nos seguintes testes:
8.Pet deve possuir tipo (cachorro, gato, etc) x
9.Pet deve possuir idade válida (número) x
11.Produto deve possuir preço maior que zero x
15.Deve permitir remover produto do carrinho x
19.Cliente VIP deve receber desconto de 15% x
20.Carrinho não deve aceitar produto com preço igual a zero x

Alem disso notei problemas no HTML, como não ter forma visual de ver se é VIP ou muda de usuario, remover do carrinho apenas o mais recente item.
Outras modificações que tavez seriam necessarias para um sistema completo, como a opção de remover pets, users e produtos não iram ser feitas.

