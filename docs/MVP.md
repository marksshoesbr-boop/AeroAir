# MVP — AeroAir

## Problema e proposta

A pessoa informa quando pode viajar. O AeroAir compara ofertas compatíveis e explica o compromisso entre preço, horários e tempo disponível no destino. A promessa é encontrar as melhores opções nas fontes consultadas, sem alegar cobertura de todo o mercado ou menor preço absoluto.

## Jornada web

1. Informar aeroportos de origem e destino, datas e quantidade de passageiros.
2. Definir janela permitida de saída da ida, janela de saída da volta e chegada máxima à origem.
3. Informar horários preferidos dentro dessas janelas e orçamento total da viagem.
4. Comparar menor preço, maior tempo no destino e melhor equilíbrio.
5. Ver detalhes da tarifa, bagagem, escalas, fornecedor, horário da consulta e preço total antes de ir à compra.
6. Opcionalmente criar conta para salvar preferências e acompanhar pesquisas.

A primeira pesquisa deve funcionar sem cadastro. Alternativas fora das janelas só podem ser pesquisadas após alteração explícita dos limites pelo usuário.

## Semântica dos horários

- Datas completas com fuso são obrigatórias; 00h de segunda-feira não é 00h de domingo.
- Cada aeroporto deve ter fuso IANA no catálogo da interface/backend.
- Os instantes enviados ao motor têm offset explícito ou Z.
- Chegada máxima significa chegada do voo ao aeroporto de origem, não chegada em casa.
- Tempo no destino: intervalo entre chegada da ida e saída da volta, sem estimar deslocamento terrestre.
- Conexões e troca de aeroporto devem ser apresentadas antes da compra.

## Motor inicial implementado

Entrada: consulta com rota exata, janelas obrigatórias inclusivas, horários preferidos e orçamento em centavos; lista de ofertas completas de ida e volta para o mesmo grupo de passageiros.

As ofertas incluem id, origem, destino, quatro instantes, total em centavos e moeda BRL. A camada de integração deverá garantir tarifa atualizada, passageiros, bagagens e taxas comparáveis. Ofertas malformadas são rejeitadas. A consulta inválida gera erro; lista vazia gera resultado vazio.

Ordenações:
- Preço: menor total, com desempate por maior tempo no destino.
- Tempo: maior permanência, com desempate por menor preço.
- Equilíbrio: preço total + penalidade em centavos por hora de desvio dos horários preferidos de saída da ida e chegada da volta. Padrão provisório de R$ 30 por hora, configurável. **É um critério de ordenação, não uma cobrança.**
- Empates restantes usam o id para resultado determinístico.

## Critérios de aceite

- Nenhuma oferta ultrapassa limites obrigatórios ou orçamento.
- Retorno depois da meia-noite respeita a data e o fuso.
- Tarifa e duração inválidas não aparecem como boas ofertas.
- Sem resultados: mostrar estado vazio e permitir que o usuário edite a flexibilidade.
- Valores fictícios sempre identificados; indisponibilidade de um fornecedor nunca vira promoção inventada.
- Preço deve ser revalidado antes do encaminhamento quando o fornecedor permitir.

## Integração de dados — pendente

Avaliar APIs e parceiros quanto a cobertura nacional, preço total, quotas, atualização, termos de uso, custos e links de compra. Navegação automatizada não é uma dependência assumida e não deve contornar controles dos sites. Nenhum fornecedor foi contratado ou integrado.

Segredos ficam no backend e fora do Git. Consultas devem registrar fonte e instante de obtenção. Falha parcial de fornecedor precisa ser informada. Não coletar CPF, pagamento ou documentos no protótipo; a compra inicial será no fornecedor.

## Fases

1. Fundação: especificação, domínio e testes (esta entrega).
2. Web demonstrativa: formulário acessível e responsivo, resultados, comparação e estado vazio.
3. Pesquisa real: backend, provedor, atualização e rastreabilidade.
4. Contas e alertas: autenticação, armazenamento, exclusão e consentimento.
5. iOS: escolher empacotamento ou interface nativa, testar e preparar distribuição.

## Fora do primeiro MVP

Emissão de bilhetes, processamento de pagamentos, milhas, garantia de menor preço, previsão de tarifa, combinação não protegida de bilhetes e lançamento simultâneo na App Store.
