let halteres = [];
let rodando = false;
let metricas = { varreduras: 0, trocas: 0 };
let contadorPassos = 1; // Variável global de controle de passos

const container = document.getElementById('chao-academia');
const statusText = document.getElementById('status');
const btnIniciar = document.getElementById('btn-iniciar');
const btnRandomizar = document.getElementById('btn-randomizar');
const uiVarreduras = document.getElementById('stat-varreduras');
const uiTrocas = document.getElementById('stat-trocas');
const uiVelocidade = document.getElementById('velocidade');
const uiValorVelocidade = document.getElementById('valor-velocidade');
const uiHistorico = document.getElementById('historico');

// Controlador de tempo baseado no slider da interface
const sleep = (ms) => {
    const multiplicador = parseFloat(uiVelocidade.value);
    return new Promise(resolve => setTimeout(resolve, ms / multiplicador));
};

uiVelocidade.addEventListener('input', (e) => {
    uiValorVelocidade.innerText = `${parseFloat(e.target.value).toFixed(1)}x`;
});

// Sistema de registro de eventos (Log de Passos)
function logAcao(mensagem, tipoClass = '') {
    const li = document.createElement('li');
    
    // Injeta o contador de passos em vez do relógio
    li.innerHTML = `<span class="timestamp">[Passo ${contadorPassos}]</span> ${mensagem}`;
    
    if (tipoClass) li.classList.add(tipoClass);
    
    uiHistorico.prepend(li);
    contadorPassos++; // Incrementa para a próxima ação
}

function atualizarMetricas() {
    uiVarreduras.innerText = metricas.varreduras;
    uiTrocas.innerText = metricas.trocas;
}

function gerarPesosAleatorios() {
    const quantidade = Math.floor(Math.random() * 4) + 5; 
    halteres = Array.from({ length: quantidade }, () => Math.floor(Math.random() * 99) + 2);
    
    metricas = { varreduras: 0, trocas: 0 };
    contadorPassos = 1; // Zera o contador ao iniciar nova bagunça
    atualizarMetricas();
    
    uiHistorico.innerHTML = ''; 
    logAcao(`O salão abriu: ${quantidade} halteres foram largados no chão da academia.`);
    
    render({vagaAtual: 0, indiceMaisLeve: -1, halterSendoObservado: -1, mensagem: "Halteres bagunçados. Pronto para organizar."});
}

// Motor de renderização reativa
function render(estado) {
    container.innerHTML = '';
    statusText.innerText = estado.mensagem;

    halteres.forEach((peso, index) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('halter-wrapper');
        
        const barra = document.createElement('div');
        barra.classList.add('halter');
        barra.style.height = `${peso * 2 + 50}px`; 

        const rotulo = document.createElement('div');
        rotulo.classList.add('halter-peso');
        rotulo.innerText = `${peso}kg`;

        if (index < estado.vagaAtual) {
            barra.classList.add('sorted');
        } else if (index === estado.indiceMaisLeve) {
            barra.classList.add('minimum');
        } else if (index === estado.halterSendoObservado) {
            barra.classList.add('scanning');
            wrapper.classList.add('scanning');
        }

        wrapper.appendChild(barra);
        wrapper.appendChild(rotulo);
        container.appendChild(wrapper);
    });
}

// Lógica Principal: Selection Sort com Metáfora Visual
async function iniciarOrdenacao() {
    if (rodando) return;
    rodando = true;
    btnIniciar.disabled = true;
    btnRandomizar.disabled = true;
    
    metricas = { varreduras: 0, trocas: 0 };
    contadorPassos = 1; // Zera o contador para o início da ordenação
    atualizarMetricas();
    
    uiHistorico.innerHTML = '';
    logAcao("O Personal Trainer começou a organizar o suporte.", "acao-sucesso");
    
    let n = halteres.length;

    for (let vagaAtual = 0; vagaAtual < n; vagaAtual++) {
        let indiceMaisLeve = vagaAtual;
        
        logAcao(`--- Preenchendo a vaga ${vagaAtual + 1} do suporte ---`);
        logAcao(`O personal olha a bagunça e chuta que o halter de ${halteres[indiceMaisLeve]}kg é o mais leve.`);
        render({vagaAtual, indiceMaisLeve, halterSendoObservado: -1, mensagem: `Analisando a vaga ${vagaAtual + 1}. O personal acha que o de ${halteres[indiceMaisLeve]}kg é o mais leve.`});
        await sleep(800);

        for (let i = vagaAtual + 1; i < n; i++) {
            metricas.varreduras++;
            atualizarMetricas();
            
            logAcao(`Ele caminha pelo salão: O halter de ${halteres[i]}kg é mais leve que o de ${halteres[indiceMaisLeve]}kg?`);
            render({vagaAtual, indiceMaisLeve, halterSendoObservado: i, mensagem: `Comparando com ${halteres[i]}kg...`});
            await sleep(600);

            if (halteres[i] < halteres[indiceMaisLeve]) {
                logAcao(`-> Sim! Ele muda o alvo. O mais leve agora é o de ${halteres[i]}kg.`, "acao-minimo");
                indiceMaisLeve = i;
                render({vagaAtual, indiceMaisLeve, halterSendoObservado: i, mensagem: `Novo alvo: O mais leve da vez é o de ${halteres[indiceMaisLeve]}kg.`});
                await sleep(800);
            }
        }

        if (indiceMaisLeve !== vagaAtual) {
            metricas.trocas++;
            atualizarMetricas();
            
            logAcao(`Força física: Ele pega o de ${halteres[indiceMaisLeve]}kg e coloca na vaga ${vagaAtual + 1} (tirando o de ${halteres[vagaAtual]}kg do caminho).`, "acao-swap");
            render({vagaAtual, indiceMaisLeve, halterSendoObservado: -1, mensagem: `O personal troca o de ${halteres[vagaAtual]}kg pelo de ${halteres[indiceMaisLeve]}kg.`});
            await sleep(800);
            
            let temp = halteres[vagaAtual];
            halteres[vagaAtual] = halteres[indiceMaisLeve];
            halteres[indiceMaisLeve] = temp;
        } else {
            logAcao(`Sorte grande: O halter de ${halteres[vagaAtual]}kg já era o mais leve. Não precisou fazer esforço para trocar.`);
        }
    }
    
    logAcao("Trabalho concluído! O suporte da academia está perfeitamente organizado do mais leve ao mais pesado.", "acao-sucesso");
    render({vagaAtual: n, indiceMaisLeve: -1, halterSendoObservado: -1, mensagem: "Organização finalizada com sucesso."});
    
    rodando = false;
    btnIniciar.disabled = false;
    btnRandomizar.disabled = false;
}

// Inicialização de eventos
btnIniciar.addEventListener('click', iniciarOrdenacao);
btnRandomizar.addEventListener('click', gerarPesosAleatorios);

// Execução inicial
gerarPesosAleatorios();