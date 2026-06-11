# Selection Sort Visualizer - O Desafio dos Halteres

Uma aplicação web interativa projetada para tangibilizar o custo computacional do algoritmo de ordenação **Selection Sort**, utilizando a metáfora visual de organização de halteres em uma academia.

## 🎯 Objetivo do Projeto
O propósito deste projeto não é apenas ordenar arrays, mas demonstrar o comportamento algorítmico e a complexidade de tempo na prática. A interface separa o custo da operação em duas métricas fundamentais:
* **Esforço Visual (Comparações):** Representa o loop interno do algoritmo mapeando o array em busca do valor mínimo.
* **Esforço Físico (Trocas/Swaps):** Representa a realocação de memória no array apenas quando o valor mínimo real é encontrado.

Ao visualizar essas métricas, fica evidente a natureza computacional `O(n²)` do Selection Sort, onde o número de varreduras cresce exponencialmente em relação às trocas efetivas.

## 🛠️ Stack Tecnológico
* **Lógica e Controle de Estado:** JavaScript (Vanilla) com uso de processamento assíncrono (`async/await`) para controle de steps e animação de DOM.
* **Estilização e Layout:** CSS3 (Flexbox, transições condicionais e UI Reativa).
* **Estrutura:** HTML5.

## ⚙️ Como a Lógica Funciona (Under the Hood)
O motor de renderização `render()` reage ao estado atual do array `halteres`. O algoritmo itera sobre o array identificando o índice do elemento mais leve (`indiceMaisLeve`). O uso de `Promises` e `setTimeout` foi implementado para pausar a thread de execução do JS e permitir a visualização humana do processamento frame a frame.
