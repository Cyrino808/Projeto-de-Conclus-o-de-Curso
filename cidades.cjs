const XLSX = require('xlsx')
function formata_nome_cidade(str) {
    let aux = str.replace(/[0-9]/g, '');
    aux = aux.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
    return aux.toUpperCase()
}
async function main(nome){
    const nome_cidade = formata_nome_cidade(nome)
    const workbook = XLSX.readFile("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/tabelas/ginibr.csv");
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    let dados_formatados = []
    
    for(let i=3;i<5568;i++){
        
        if((formata_nome_cidade(dados[i][0])) == nome_cidade){
            dados_formatados.push(formata_nome_cidade(dados[i][0]) + '/' + dados[i][1] + '/' + dados[i][2] + '/' + dados[i][3])
        }
        
    }
    return dados_formatados 
  }
  module.exports = {
    main:main
  };