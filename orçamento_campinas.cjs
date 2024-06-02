const XLSX = require('xlsx')
const fs = require("fs");


async function receitas_campinas() {
    // Carregar o arquivo Excel
    const workbook = XLSX.readFile("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/tabelas/Receitas_campinas_2023.csv");
    // Suponha que os dados estão na primeira aba da planilha
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // Converter dados da planilha para JSON
    const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let total = 0;
    let receita = [];
    let receitaPorCategoria = {};

    for (let i = 1; i < dados.length; i++) {
        let categoria = removeNumbers(String(dados[i][1]));

        // Verificar se a categoria já existe na lista de receitas
        if (!receita.includes(categoria)) {
            receita.push(categoria);
        }

        // Verificar se a categoria já existe no objeto receitaPorCategoria
        if (!receitaPorCategoria[categoria]) {
            receitaPorCategoria[categoria] = 0;
        }

        // Acumular o valor da receita para a categoria
        let valorReceita = formatCurrencyString(dados[i][4]);
        receitaPorCategoria[categoria] += valorReceita;
        total += valorReceita;
    }


    let receitaArray = Object.entries(receitaPorCategoria);
    receitaArray.sort((a, b) => b[1] - a[1]);
    for(let i=0;i<receitaArray.length;i++){
        if(receitaArray[i][1]>70000000){
            //console.log(receitaArray[i])
        }
    }
    return (await agrega(receitaArray))
}

function agrega(dados){
    let aux
    let resultado = []
    let icms = 0
    let issqn = 0
    let ipva = 0
    let irf = 0
    let impsobA = 0
    let lixo = 0
    let fundeb = 0 
    let saude = 0
    let itbi = 0
    let publicidade = 0
    let iluminacao = 0
    let banco = 0
    let credito = 0
    let municipio = 0
    let ipi = 0
    let outros = 0

    for(let i=0; i<dados.length; i++){
        aux = dados[i][0].split(" ")

        if(aux.includes("ICMS")){
            icms += dados[i][1]
        } else if(aux.includes("ISSQN")){
            issqn += dados[i][1]
        } else if(aux.includes("IPVA")){
            ipva += dados[i][1]
        } else if(aux.includes("IRF")){
            irf += dados[i][1]
        } else if(aux.includes("IMPSOB/A")){
            impsobA += dados[i][1]
        }else if(aux.includes("LIXO")){
            lixo += dados[i][1]
        }else if(aux.includes("FUNDEB")){
            fundeb += dados[i][1]
        }else if(aux.includes("SAÚDE")){
            saude += dados[i][1]
        }else if(aux.includes("(ITBI)")){
            itbi+=dados[i][1]
        }else if(aux.includes("PUBLICIDADE")){
            publicidade+=dados[i][1]
        }else if(aux.includes("ILUMINAÇÃO")){
            iluminacao+=dados[i][1]
        }else if(aux.includes("BANCÁRIOS")){
            banco+=dados[i][1]
        }else if(aux.includes("SUS")){
            saude+=dados[i][1]
        }else if(aux.includes("CRÉDITO")){
            credito+=dados[i][1]
        }else if(aux.includes("IPI")){
            ipi+=dados[i][1]
        }else if(aux.includes("MUNICÍPIOS")){
            municipio+=dados[i][1]
        }else if(aux.includes("EDUCAÇÃO")){
            fundeb+=dados[i][1]
        }else {
            outros+=dados[i][1]
        }
    }

    resultado.push(["ICMS", icms])
    resultado.push(["ISSQN", issqn])
    resultado.push(["IPVA", ipva])
    resultado.push(["IRF", irf])
    resultado.push(["IMPSOB/A", impsobA])
    resultado.push(["LIXO", lixo])
    resultado.push(["TRANSFERÊNCIAS DE RECURSOS PARA A EDUCAÇÃO", fundeb])
    resultado.push(["TRANSFERÊNCIAS DE RECURSOS PARA A SAÚDE", saude])
    resultado.push(["ITBI", itbi])
    resultado.push(["PUBLICIDADE", publicidade])
    resultado.push(["BANCÁRIOS", banco])
    resultado.push(["ILUMINAÇÃO", iluminacao])
    resultado.push(["OUTRAS OPERAÇÕES DE CRÉDITO", credito])
    resultado.push(["FUNDO DE PARTICIPAÇÃO DO MUNICÍPIOS", municipio])
    resultado.push(["IPI", ipi])
    resultado.push(["OUTROS", outros])

    return resultado
}

function removeNumbers(inputString) {
    
    let string = inputString.replace(/\d/g, '')
    string = string.replace(/\./g, '')
    return string
}

function formatCurrencyString(dados) {
    let formattedString = dados.replace('R$', '').trim();
    formattedString = formattedString.replace(/\./g, '');
    formattedString = formattedString.replace(',', '.');
    formattedString = parseFloat(formattedString)
    return formattedString;
}
/*
[
    'Órgão',
    'CNPJ ou CPF/Credor',
    'Função',
    'Subfunção',
    'Programa',
    'Fonte',
    'Número do processo de compra',
    'Valor Empenhado',
    'Ação',
    'Natureza Despesa',
    'Dia'
  ]
  [
  'CAMARA MUNICIPAL',
  '33.050.196/0001-88 - COMPANHIA PAULISTA DE FORCA E LUZ',
  'Legislativa',
  'Ação Legislativa',
  'SUSTENTABILIDADE E TRANSPARÊNCIA NO PROCESSO LEGISLATIVO E DO CONTROLE EXTERNO',
  'Geral Total',
  <1 empty item>,
  'R$ 11.616,27',
  'MANUTENÇÃO DOS SERVIÇOS',
  'Outros Serviços De Terceiros - Pessoa Jurídica',
  44957.99967592592
]
  */

gastos_campinas()
async function gastos_campinas() {
    // Carregar o arquivo Excel
    const workbook = XLSX.readFile("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/tabelas/Despesas_campinas_2023.csv");
    // Suponha que os dados estão na primeira aba da planilha
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // Converter dados da planilha para JSON
    const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let total = 0;
    let gasto = [];
    let gastoPorCategoria = {};

    for (let i = 1; i < dados.length; i++) {
        let categoria = dados[i][0]

        // Verificar se a categoria já existe na lista de receitas
        if (!gasto.includes(categoria)) {
            gasto.push(categoria);
        }

        // Verificar se a categoria já existe no objeto receitaPorCategoria
        if (!gastoPorCategoria[categoria]) {
            gastoPorCategoria[categoria] = 0;
        }

        // Acumular o valor da receita para a categoria
        let valorReceita = formatCurrencyString(dados[i][7]);
        gastoPorCategoria[categoria] += valorReceita;
        total += valorReceita;
    }


    let receitaArray = Object.entries(gastoPorCategoria);
    receitaArray.sort((a, b) => b[1] - a[1]);
    return receitaArray
}



async function pega_gasto_categoria(dados,tipogasto){
    let total = 0;
    let gasto = [];
    let gastoPorCategoria = {};

    for (let i = 1; i < dados.length; i++) {
        let categoria = dados[i][8]

        if(dados[i][0] == tipogasto){
            if (!gasto.includes(categoria)) {
                gasto.push(categoria);
            }

            if (!gastoPorCategoria[categoria]) {
                gastoPorCategoria[categoria] = 0;
            }

            let valorReceita = formatCurrencyString(dados[i][7]);
            gastoPorCategoria[categoria] += valorReceita;
            total += valorReceita;
        }
       
    }

    let receitaArray = Object.entries(gastoPorCategoria);
    receitaArray.sort((a, b) => b[1] - a[1]);

    return receitaArray
}


module.exports = {
    receitas_campinas:receitas_campinas,
    gastos_campinas:gastos_campinas,
    pega_gasto_categoria:pega_gasto_categoria
  };