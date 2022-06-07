const form = document.querySelector('#form');
let saldoPositivo = 0;
let saldoNegativo = 0;
let saldoAtual = 0;
let banco = buscarTarefaBD();

function adicionarTransacaoBD() {
    localStorage.setItem('dados', JSON.stringify(banco));
};

function buscarTarefaBD() {
    const bancoString = localStorage.getItem('dados');
    const bancoObj = JSON.parse(bancoString);

    return bancoObj
};

function carregarPag() {
    if (banco === null) {
        banco = [];
    } else {
        banco.forEach(({ nomeTransacao, valorTansacao }) => {
            addTransacoesContainer(nomeTransacao, valorTansacao);
        });
    };
};

function imprimirSaldoPositivoOuNegativoNaTela(money, saldo) {
    money.textContent = `R$ ${saldo.toFixed(2)}`;
};

function apagarTransacao(event) {
    const elementoClicado = event.target;
    const deletar = elementoClicado.dataset.deletar
    const itemTransacao = document.querySelector(`[data-nome="${deletar}"]`);
    const nomeItemTransacao = itemTransacao.dataset.nome;
    const valorItemTransacao = itemTransacao.dataset.valor;
    console.log(nomeItemTransacao, valorItemTransacao)

    if (deletar) {
        itemTransacao.remove();
        banco = banco.filter((item) => item.nomeTransacao !== nomeItemTransacao);
        adicionarTransacaoBD();
    };
};

function imprimirTransacoesNaTela(classe, nomeTransacao, valorTansacao) {
    transactions.innerHTML +=
        `<li  class="${classe}" data-nome="${nomeTransacao}" data-valor="${valorTansacao}">
          ${nomeTransacao.toUpperCase()} <span>R$ ${valorTansacao.toFixed(2)}</span>
          <button class="delete-btn" data-deletar="${nomeTransacao}">x</button>
        </li>`;
};

function imprimirBalancoTotalNaTela(saldoAtual) {
    balance.textContent = `R$${(saldoAtual).toFixed(2)}`;
};

function addTransacoesContainer(nomeTransacao, valorTansacao) {
    const valorPositivo = valorTansacao > 0;
    const valorNegativo = valorTansacao < 0;
    const classeMinusPlus = valorNegativo ? 'minus' : 'plus';

    imprimirTransacoesNaTela(classeMinusPlus, nomeTransacao, valorTansacao);

    if (valorPositivo) {
        saldoPositivo += valorTansacao;
        imprimirSaldoPositivoOuNegativoNaTela(moneyPlus, saldoPositivo);
    };

    if (valorNegativo) {
        saldoNegativo += valorTansacao;
        imprimirSaldoPositivoOuNegativoNaTela(moneyMinus, saldoNegativo);
    };

    saldoAtual = saldoPositivo + saldoNegativo;
    imprimirBalancoTotalNaTela(saldoAtual);
}

function adicionarTransacao(event) {
    event.preventDefault();

    if (text.value && amount.value) {
        const nomeTransacao = text.value;
        const valorTansacao = Number(amount.value);

        banco.push({
            nomeTransacao,
            valorTansacao
        });

        adicionarTransacaoBD(banco);
        addTransacoesContainer(nomeTransacao, valorTansacao);
    };

    form.reset();
    text.focus();
};

window.addEventListener('load', carregarPag);
form.addEventListener('submit', adicionarTransacao);
transactions.addEventListener('click', apagarTransacao);