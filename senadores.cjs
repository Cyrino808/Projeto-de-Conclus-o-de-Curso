const XLSX = require('xlsx')
const fs = require("fs");
const currentDate = new Date()
const http = require('http')
const https = require('https')
const axios = require('axios')
const cheerio = require('cheerio')
const unidecode = require('unidecode');
const senadores = [
  {"nome": "Alan Rick", "codigo": "5672"},
  {"nome": "Marcio Bittar", "codigo": "285"},
  {"nome": "Sergio Petecao", "codigo": "4560"},
  {"nome": "Fernando Farias", "codigo": "6345"},
  {"nome": "Renan Calheiros", "codigo": "70"},
  {"nome": "Rodrigo Cunha", "codigo": "5905"},
  {"nome": "Eduardo Braga", "codigo": "4994"},
  {"nome": "Omar Aziz", "codigo": "5525"},
  {"nome": "Plinio Valerio", "codigo": "5502"},
  {"nome": "Davi Alcolumbre", "codigo": "3830"},
  {"nome": "Lucas Barreto", "codigo": "5926"},
  {"nome": "Randolfe Rodrigues", "codigo": "5012"},
  {"nome": "Angelo Coronel", "codigo": "5967"},
  {"nome": "Jaques Wagner", "codigo": "581"},
  {"nome": "Otto Alencar", "codigo": "5523"},
  {"nome": "Cid Gomes", "codigo": "5973"},
  {"nome": "Eduardo Girao", "codigo": "5976"},
  {"nome": "Janaina Farias", "codigo": "6351"},
  {"nome": "Damares Alves", "codigo": "6335"},
  {"nome": "Izalci Lucas", "codigo": "4770"},
  {"nome": "Leila Barros", "codigo": "5979"},
  {"nome": "Fabiano Contarato", "codigo": "5953"},
  {"nome": "Magno Malta", "codigo": "631"},
  {"nome": "Marcos do Val", "codigo": "5942"},
  {"nome": "Jorge Kajuru", "codigo": "5895"},
  {"nome": "Vanderlan Cardoso", "codigo": "5899"},
  {"nome": "Wilder Morais", "codigo": "5070"},
  {"nome": "Ana Paula Lobato", "codigo": "6358"},
  {"nome": "Eliziane Gama", "codigo": "5718"},
  {"nome": "Weverton", "codigo": "5411"},
  {"nome": "Carlos Viana", "codigo": "5990"},
  {"nome": "Cleitinho", "codigo": "6337"},
  {"nome": "Rodrigo Pacheco", "codigo": "5732"},
  {"nome": "Nelsinho Trad", "codigo": "5985"},
  {"nome": "Soraya Thronicke", "codigo": "5988"},
  {"nome": "Tereza Cristina", "codigo": "5736"},
  {"nome": "Jayme Campos", "codigo": "4531"},
  {"nome": "Margareth Buzetti", "codigo": "6304"},
  {"nome": "Wellington Fagundes", "codigo": "1173"},
  {"nome": "Beto Faro", "codigo": "4639"},
  {"nome": "Jader Barbalho", "codigo": "35"},
  {"nome": "Zequinha Marinho", "codigo": "3806"},
  {"nome": "Daniella Ribeiro", "codigo": "5998"},
  {"nome": "Efraim Filho", "codigo": "4642"},
  {"nome": "Veneziano Vital do Rego", "codigo": "5748"},
  {"nome": "Fernando Dueire", "codigo": "5917"},
  {"nome": "Humberto Costa", "codigo": "5008"},
  {"nome": "Teresa Leitao", "codigo": "6338"},
  {"nome": "Ciro Nogueira", "codigo": "739"},
  {"nome": "Jussara Lima", "codigo": "6369"},
  {"nome": "Marcelo Castro", "codigo": "742"},
  {"nome": "Flavio Arns", "codigo": "345"},
  {"nome": "Oriovisto Guimaraes", "codigo": "5924"},
  {"nome": "Sergio Moro", "codigo": "6331"},
  {"nome": "Carlos Portinho", "codigo": "5936"},
  {"nome": "Flavio Bolsonaro", "codigo": "5894"},
  {"nome": "Romario", "codigo": "5322"},
  {"nome": "Rogerio Marinho", "codigo": "4694"},
  {"nome": "Styvenson Valentim", "codigo": "5959"},
  {"nome": "Zenaide Maia", "codigo": "5783"},
  {"nome": "Confucio Moura", "codigo": "475"},
  {"nome": "Jaime Bagattoli", "codigo": "6340"},
  {"nome": "Marcos Rogerio", "codigo": "5422"},
  {"nome": "Chico Rodrigues", "codigo": "470"},
  {"nome": "Dr. Hiran", "codigo": "5793"},
  {"nome": "Mecias de Jesus", "codigo": "6027"},
  {"nome": "Hamilton Mourao", "codigo": "6341"},
  {"nome": "Ireneu Orth", "codigo": "6015"},
  {"nome": "Paulo Paim", "codigo": "825"},
  {"nome": "Esperidiao Amin", "codigo": "22"},
  {"nome": "Ivete da Silveira", "codigo": "6010"},
  {"nome": "Jorge Seif", "codigo": "6342"},
  {"nome": "Alessandro Vieira", "codigo": "5982"},
  {"nome": "Laercio Oliveira", "codigo": "4811"},
  {"nome": "Rogerio Carvalho", "codigo": "5352"},
  {"nome": "Astronauta Marcos Pontes", "codigo": "6009"},
  {"nome": "Giordano", "codigo": "6008"},
  {"nome": "Mara Gabrilli", "codigo": "5376"},
  {"nome": "Eduardo Gomes", "codigo": "3777"},
  {"nome": "Iraja", "codigo": "5385"},
  {"nome": "Professora Dorinha Seabra", "codigo": "5386"}
]

async function pega_gastos_senadores(codigo){
    let ano = '2023'
    let url = "https://www6g.senado.leg.br/transparencia/sen/"+ codigo +"/?ano="+ ano // substitua pela URL que deseja fazer o scraping
    const htmlData = await fetchData(url);
    
    if (htmlData) {
        const $ = cheerio.load(htmlData);
        const data = [];
        $('table.table-striped tbody tr').each((index, element) => {
            const row = {};
    
            const cells = $(element).find('td');
            let recurso = $(cells[0]).text().trim();
            let valor = $(cells[1]).text().trim();


            if (recurso.startsWith('Diárias')) {
                recurso = 'Diárias';
            }

        row.recurso = recurso;
        row.valor = valor;
        data.push(row);
        });
        return data
    } 
}

async function fetchData(url) {
    try {
        const { data } = await axios.get(url);
        return data;

    } catch (error) {
       // console.error('Error fetching data:', error);
        return null;
    }
}

async function main(nome){
  let data
    for(let i=0;i<senadores.length;i++){
      if(senadores[i].nome.toLocaleUpperCase() == nome){
        data = await pega_gastos_senadores(senadores[i].codigo)
      }
    }
   

    for(let i=0;i<data.length;i++){

        if(data[i].recurso == 'Diárias'){
            data.splice(i,1)
        }else if(data[i].recurso == 'Passagens emitidas'){
            data.splice(i,1)
        }
    }

    return data
    
}



async function senadores_formatado(){

  const workbook = XLSX.readFile("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/tabelas/Senadores_lista.csv");
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  let dados_formatados = []

  for(let i=1;i<dados.length;i++){
    dados_formatados.push(removerAcentos(unidecode(dados[i][0])) + '!' + dados[i][1] + '!' + dados[i][2] + '!')
  }

  return dados_formatados
}

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


module.exports = {
    main:main,
    senadores_formatado:senadores_formatado
  };

