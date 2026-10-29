# AeroAir

Viagens que cabem na sua agenda e no seu bolso.

Aplicativo para encontrar passagens de ida e volta a partir da disponibilidade do viajante, com foco inicial em viagens nacionais de fim de semana.

## Estado atual

Base inicial do projeto: especificação do MVP e motor de filtragem e ordenação com testes automatizados. **Já há um protótipo web mobile na pasta `web/`, com dados fictícios. Ainda não há cadastro, consulta a companhias, preços reais ou aplicativo iOS publicado.** Os dados dos testes são fictícios.

## Executar os testes

Requer Node.js 22 ou superior. Não há dependências externas nesta etapa.

```sh
npm test
```

## Estrutura

- `src/search.js`: validação de ofertas, limites obrigatórios e classificação.
- `test/search.test.js`: exemplos executáveis das regras.
- `docs/MVP.md`: experiência, critérios de aceite, fases e integração de dados.

## Regra principal

Limites obrigatórios nunca são flexibilizados automaticamente. Horários preferidos servem para comparar alternativas dentro dos limites autorizados. A volta tem um limite de **chegada à origem**, inclusive quando ocorre no dia seguinte.

O motor recebe ofertas completas de ida e volta para a rota solicitada, com valor total em centavos e moeda BRL. Ele não procura nem combina tarifas de fornecedores.

## Próximas entregas

1. Protótipo web responsivo com ofertas demonstrativas claramente identificadas.
2. Validação de acesso, cobertura, custos e condições de um fornecedor de voos.
3. Backend de pesquisa, atualização do preço e encaminhamento para compra.
4. Conta, preferências salvas e alertas com consentimento.
5. Versão iOS após validação da experiência web.

Código de domínio separado da interface para permitir reutilização. A estratégia de distribuição iOS ainda será definida; publicar na web não publica automaticamente na App Store.

## Testar o protótipo web

Execute `python -m http.server 8000 --directory web` e abra http://localhost:8000. Consulte [os fluxos e limites da simulação](docs/PROTOTIPO-WEB.md).
