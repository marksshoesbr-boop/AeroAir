# Protótipo web mobile — AeroAir

Interface responsiva em HTML, CSS e JavaScript, na pasta `web/`. Prioriza celular com navegação inferior e formulários em três etapas.

## Rodar localmente

Na raiz do repositório: `python -m http.server 8000 --directory web`. Abra http://localhost:8000.

## Fluxos implementados

- Criar e editar radares com aeroportos, destino, datas, horários, passageiros e orçamento.
- Pausar, retomar e excluir radares.
- Comparar oportunidades fictícias por preço, permanência e equilíbrio demonstrativo.
- Salvar favoritos e abrir detalhes.
- Simular uma queda de preço e receber um alerta dentro do app.
- Restaurar o cenário inicial pelo avatar do perfil.

As preferências ficam em localStorage no navegador. Não há conta real, backend, consulta de companhias, reservas, pagamentos ou notificações externas. A simulação ocorre somente quando o botão é acionado. O motor da demonstração é independente do motor de domínio inicial; unificar contratos antes de integrar um provedor real.

O inventário sintético inclui Florianópolis, Recife e Rio de Janeiro, com saídas de VCP, CGH e GRU. Datas e companhias são apenas ilustrativas. As ilustrações SVG são decorativas, não fotografias dos destinos.

## Verificação

Sintaxe JavaScript verificada com `node --check web/app.js`. Fluxo de criação conferido no navegador em viewport de 390 px; simulação de preço e criação de alerta verificadas no navegador. O iOS nativo e notificações push não fazem parte desta entrega.

## Atualização do produto

Monitoramento de buscas salvas e alertas passam a ser centrais ao MVP, conforme refinamento da proposta. A integração real depende de um fornecedor que permita consultas recorrentes em segundo plano.
