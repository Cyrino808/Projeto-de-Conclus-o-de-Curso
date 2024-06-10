import express from 'express'; 
import ejs from 'ejs'; 
import path from 'path';
import http from 'http'; 
import https from 'https';
import XLSX from 'xlsx';
import Queue from 'better-queue';
import fetch from 'node-fetch';
import * as cheerio from "cheerio"
import axios from "axios"
import * as fs from "fs"
import funções_ocr from './ocr.cjs';
import funções_orçamento_campinas from './orçamento_campinas.cjs';
import senador from './senadores.cjs';
import dados_cidades from './cidades.cjs';
//funções.pega_imagem()
const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'public')));
app.set('view engine', 'ejs'); 
const filePath = 'C:/Users/vinim/OneDrive/Área de Trabalho/TCC/RELATORIO_DTB_BRASIL_MUNICIPIO.xls';

server.listen(8000, () => {
    console.log("Server running on port 8000");
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//LISTAS DE DADOS
let lista_vereadores= [{ nome: "Arnaldo Salvetti" },{ nome: "Carlinhos Camelô" },{ nome: "Carmo Luiz" },{ nome: "Cecílio Santos" },{ nome: "Débora Palermo" },{ nome: "Edison Ribeiro" },{ nome: "Eduardo Magoga" },{ nome: "Fernando Mendes" },{ nome: "Filipe Marchesi" },{ nome: "Guida Calixto" },{ nome: "Gustavo Petta" },{ nome: "Higor Diego" },{ nome: "Jair Farmácia" },{ nome: "Jorge Schneider" },{ nome: "Juscelino da Barbarense" },{ nome: "Luiz Cirilo" },{ nome: "Luiz Rossini" },{ nome: "Major Jaime" },{ nome: "Marcelo Farmácia" },{ nome: "Marcelo Silva" },{ nome: "Mariana Conti" },{ nome: "Marrom Cunha" },{ nome: "Nelson Hossri" },{ nome: "Otto Alejandro" },{ nome: "Paolla Miguel" },{ nome: "Paulo Bufalo" },{ nome: "Paulo Gaspar" },{ nome: "Paulo Haddad" },{ nome: "Permínio Monteiro" },{ nome: "Presidência" },{ nome: "Professor Alberto" },{ nome: "Rodrigo da Farmadic" },{ nome: "Rubens Gás" },{ nome: "Zé Carlos" }]

const estadosPorRegiao = {
    norte: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
    nordeste: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
    centroOeste: ['GO', 'MT', 'MS', 'DF'],
    sudeste: ['ES', 'MG', 'RJ', 'SP'],
    sul: ['PR', 'RS', 'SC']
  };

let estados = [
    { "sigla": "AC", "nome_estado": "Acre" },
    { "sigla": "AL", "nome_estado": "Alagoas" },
    { "sigla": "AP", "nome_estado": "Amapá" },
    { "sigla": "AM", "nome_estado": "Amazonas" },
    { "sigla": "BA", "nome_estado": "Bahia" },
    { "sigla": "CE", "nome_estado": "Ceará" },
    { "sigla": "DF", "nome_estado": "Distrito Federal" },
    { "sigla": "ES", "nome_estado": "Espírito Santo" },
    { "sigla": "GO", "nome_estado": "Goiás" },
    { "sigla": "MA", "nome_estado": "Maranhão" },
    { "sigla": "MT", "nome_estado": "Mato Grosso" },
    { "sigla": "MS", "nome_estado": "Mato Grosso do Sul" },
    { "sigla": "MG", "nome_estado": "Minas Gerais" },
    { "sigla": "PA", "nome_estado": "Pará" },
    { "sigla": "PB", "nome_estado": "Paraíba" },
    { "sigla": "PR", "nome_estado": "Paraná" },
    { "sigla": "PE", "nome_estado": "Pernambuco" },
    { "sigla": "PI", "nome_estado": "Piauí" },
    { "sigla": "RJ", "nome_estado": "Rio de Janeiro" },
    { "sigla": "RN", "nome_estado": "Rio Grande do Norte" },
    { "sigla": "RS", "nome_estado": "Rio Grande do Sul" },
    { "sigla": "RO", "nome_estado": "Rondônia" },
    { "sigla": "RR", "nome_estado": "Roraima" },
    { "sigla": "SC", "nome_estado": "Santa Catarina" },
    { "sigla": "SP", "nome_estado": "São Paulo" },
    { "sigla": "SE", "nome_estado": "Sergipe" },
    { "sigla": "TO", "nome_estado": "Tocantins" }
]

let lista_aeroportos = [
    {
        "codigo": "AJU",
        "nome_aeroporto": "Aeroporto Santa Maria",
        "estado": "SE"
    },
    {
        "codigo": "BEL",
        "nome_aeroporto": "Aeroporto Val de Caes",
        "estado": "PA"
    },
    {
        "codigo": "BGX",
        "nome_aeroporto": "Aeroporto de Bagé",
        "estado": "RS"
    },
    {
        "codigo": "BNU",
        "nome_aeroporto": "Aeroporto de Blumenau",
        "estado": "SC"
    },
    {
        "codigo": "BPS",
        "nome_aeroporto": "Aeroporto de Porto Seguro",
        "estado": "BA"
    },
    {
        "codigo": "BSB",
        "nome_aeroporto": "Aeroporto Juscelino Kubitschek",
        "estado": "DF"
    },
    {
        "codigo": "BVB",
        "nome_aeroporto": "Aeroporto de Boa Vista",
        "estado": "RR"
    },
    {
        "codigo": "CAC",
        "nome_aeroporto": "Aeroporto de Cascavel",
        "estado": "PR"
    },
    {
        "codigo": "CFB",
        "nome_aeroporto": "Aeroporto de Cabo Frio",
        "estado": "RJ"
    },
    {
        "codigo": "CGB",
        "nome_aeroporto": "Aeroporto de Cuiabá",
        "estado": "MT"
    },
    {
        "codigo": "CGH",
        "nome_aeroporto": "Aeroporto de Congonhas",
        "estado": "SP"
    },
    {
        "codigo": "CGR",
        "nome_aeroporto": "Aeroporto de Campo Grande",
        "estado": "MS"
    },
    {
        "codigo": "CNF",
        "nome_aeroporto": "Aeroporto de Confins",
        "estado": "MG"
    },
    {
        "codigo": "CPV",
        "nome_aeroporto": "Aeroporto João Suassuna",
        "estado": "PB"
    },
    {
        "codigo": "CWB",
        "nome_aeroporto": "Aeroporto Afonso Pena",
        "estado": "PR"
    },
    {
        "codigo": "CXJ",
        "nome_aeroporto": "Aeroporto de Caxias do Sul",
        "estado": "RS"
    },
    {
        "codigo": "FLN",
        "nome_aeroporto": "Aeroporto de Florianópolis",
        "estado": "SC"
    },
    {
        "codigo": "FOR",
        "nome_aeroporto": "Aeroporto Pinto Martins",
        "estado": "CE"
    },
    {
        "codigo": "GIG",
        "nome_aeroporto": "Aeroporto do Galeão",
        "estado": "RJ"
    },
    {
        "codigo": "GPB",
        "nome_aeroporto": "Aeroporto de Guarapuava",
        "estado": "PR"
    },
    {
        "codigo": "GRU",
        "nome_aeroporto": "Aeroporto Franco Montoro",
        "estado": "SP"
    },
    {
        "codigo": "GYN",
        "nome_aeroporto": "Aeroporto de Goiânia",
        "estado": "GO"
    },
    {
        "codigo": "IGU",
        "nome_aeroporto": "Aeroporto das Cataratas",
        "estado": "PR"
    },
    {
        "codigo": "IMP",
        "nome_aeroporto": "Aeroporto Prefeito Renato Moreira",
        "estado": "MA"
    },
    {
        "codigo": "IOS",
        "nome_aeroporto": "Aeroporto de Ilhéus",
        "estado": "BA"
    },
    {
        "codigo": "JDO",
        "nome_aeroporto": "Aeroporto do Cariri",
        "estado": "CE"
    },
    {
        "codigo": "JOI",
        "nome_aeroporto": "Aeroporto de Joinville",
        "estado": "SC"
    },
    {
        "codigo": "JPA",
        "nome_aeroporto": "Aeroporto Pres. Castro Pinto",
        "estado": "PB"
    },
    {
        "codigo": "LDB",
        "nome_aeroporto": "Aeroporto de Londrina",
        "estado": "PR"
    },
    {
        "codigo": "LAJ",
        "nome_aeroporto": "Aeroporto de Lages",
        "estado": "RS"
    },
    {
        "codigo": "MAO",
        "nome_aeroporto": "Aeroporto Eduardo Gomes",
        "estado": "AM"
    },
    {
        "codigo": "MCZ",
        "nome_aeroporto": "Aeroporto Zumbi dos Palmares",
        "estado": "AL"
    },
    {
        "codigo": "MGF",
        "nome_aeroporto": "Aeroporto de Maringá",
        "estado": "PR"
    },
    {
        "codigo": "MVF",
        "nome_aeroporto": "Aeroporto de Mossoró",
        "estado": "RN"
    },
    {
        "codigo": "NAT",
        "nome_aeroporto": "Aeroporto Augusto Severo",
        "estado": "RN"
    },
    {
        "codigo": "OPS",
        "nome_aeroporto": "Aeroporto Municipal de Sinop",
        "estado": "MT"
    },
    {
        "codigo": "PET",
        "nome_aeroporto": "Aeroporto de Pelotas",
        "estado": "RS"
    },
    {
        "codigo": "PLU",
        "nome_aeroporto": "Aeroporto da Pampulha",
        "estado": "MG"
    },
    {
        "codigo": "PHB",
        "nome_aeroporto": "Aeroporto de Parnaíba",
        "estado": "PI"
    },
    {
        "codigo": "PFB",
        "nome_aeroporto": "Aeroporto de Passo Fundo",
        "estado": "RS"
    },
    {
        "codigo": "PMW",
        "nome_aeroporto": "Aeroporto de Palmas",
        "estado": "TO"
    },
    {
        "codigo": "PNZ",
        "nome_aeroporto": "Aeroporto de Petrolina",
        "estado": "PE"
    },
    {
        "codigo": "POA",
        "nome_aeroporto": "Aeroporto Salgado Filho",
        "estado": "RS"
    },
    {
        "codigo": "REC",
        "nome_aeroporto": "Aeroporto dos Guararapes",
        "estado": "PE"
    },
    {
        "codigo": "RIA",
        "nome_aeroporto": "Aeroporto de Santa Maria",
        "estado": "RS"
    },
    {
        "codigo": "SDU",
        "nome_aeroporto": "Aeroporto Santos Dumont",
        "estado": "RJ"
    },
    {
        "codigo": "SLZ",
        "nome_aeroporto": "Aeroporto Marechal Cunha Machado",
        "estado": "MA"
    },
    {
        "codigo": "SOD",
        "nome_aeroporto": "Aeroporto de Sorocaba",
        "estado": "SP"
    },
    {
        "codigo": "SSA",
        "nome_aeroporto": "Aeroporto de Salvador",
        "estado": "BA"
    },
    {
        "codigo": "THE",
        "nome_aeroporto": "Aeroporto Senador Petrônio Portela",
        "estado": "PI"
    },
    {
        "codigo": "VCP",
        "nome_aeroporto": "Aeroporto de Viracopos",
        "estado": "SP"
    },
    {
        "codigo": "UDI",
        "nome_aeroporto": "Aeroporto de Uberlândia",
        "estado": "MG"
    },
    {
        "codigo": "VDC",
        "nome_aeroporto": "Aeroporto de Vitória da Conquista",
        "estado": "BA"
    },
    {
        "codigo": "VIX",
        "nome_aeroporto": "Aeroporto de Vitória",
        "estado": "ES"
    },
    {
        "codigo": "XAP",
        "nome_aeroporto": "Aeroporto de Chapecó",
        "estado": "SC"
    }
]

const cota_parlamentar = [
    {estado :"AC", valor: 50426.26},				
    {estado :"AL", valor: 46737.90},				
    {estado :"AM", valor: 49363.92},				
    {estado :"AP", valor: 49168.58},				
    {estado :"BA", valor: 44804.65},				
    {estado :"CE", valor: 48245.57},				
    {estado :"DF", valor: 36582.46},
    {estado :"ES", valor: 43217.71},
    {estado :"GO", valor: 41300.86},
    {estado :"MA", valor: 47945.49},
    {estado :"MG", valor: 41886.51},
    {estado :"MS", valor: 46336.64},
    {estado :"MT", valor: 45221.83},
    {estado :"PA", valor: 48021.25},
    {estado :"PB", valor: 47826.36},
    {estado :"PE", valor: 47470.60},
    {estado :"PI", valor: 46765.57},
    {estado :"PR", valor: 44665.66},
    {estado :"RJ", valor: 41553.77},
    {estado :"RN", valor: 48525.79},
    {estado :"RO", valor: 49466.29},
    {estado :"RR", valor: 51406.33},
    {estado :"RS", valor: 46669.70},
    {estado :"SC", valor: 45671.58},
    {estado :"SE", valor: 45933.06},
    {estado :"SP", valor: 42837.33},
    {estado :"TO", valor: 45297.41}
]
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Array para armazenar os resultados
let valor = [];
let beneficiados = [];

function fetchBolsaFamiliaData(mesAno,codigoIBGE, retryCount = 0) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.portaldatransparencia.gov.br',
            port: 443,
            path: `/api-de-dados/bolsa-familia-por-municipio?mesAno=${mesAno}&codigoIbge=${codigoIBGE}&pagina=1`,
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'chave-api-dados': '792df442a9bda7e180cf683845a7ceb3'
            },
            timeout: 10000
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json && json.length > 0) {
                        valor.push(json[0].valor);
                        beneficiados.push(json[0].quantidadeBeneficiados);
                       
                        resolve();
                    }else{
                        resolve();
                    } 
                } catch (error) {
                    if (retryCount < 200) {
                        fetchBolsaFamiliaData(mesAno,codigoIBGE, retryCount + 1).then(resolve)
                        .catch(reject)   
                } 
                }
            });
        });

        req.on('error', error => {
            if (retryCount < 200) {
                    fetchBolsaFamiliaData(mesAno,codigoIBGE, retryCount + 1).then(resolve)
                    .catch(reject)   
            } 
        });


        req.end();
    });
}

async function pegas_gastos_deputado(id,ano){
    let aux = ''
   
    //console.log(ano)
        for(let j = 0 ; j < 12 ; j++){  

            let gastos = JSON.parse(await fetch_gastos_deputado(id,ano,j+1))
           
                for(let i=0;i < gastos.dados.length;i++){
                    if( gastos.dados[i].tipoDespesa){
                        aux = aux + gastos.dados[i].tipoDespesa + '/' + Math.abs(gastos.dados[i].valorLiquido) + '!'
                    }
                        
                }
        }
    
    return aux
}

function fetch_gastos_deputado(id,ano,mes) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'dadosabertos.camara.leg.br',
            port: 443,
            path: `/api/v2/deputados/${id}/despesas?ano=${ano}&mes=${mes}&itens=100&ordem=ASC&ordenarPor=ano`,
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'chave-api-dados': '792df442a9bda7e180cf683845a7ceb3'
            },
            timeout: 10000
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(data)
                } catch (error) {
                  
                }
            });
        });
        req.end();
    });
}

function fetchlistadeputados(retryCount = 0) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'dadosabertos.camara.leg.br',
            port: 443,
            path: `/api/v2/deputados?ordem=ASC&ordenarPor=nome`,
            method: 'GET',
            headers: {
                "Accept": "application/json"
                
            },
            timeout: 10000
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (error) {
                    if (retryCount < 200) {
                        fetchlistadeputados(retryCount + 1).then(resolve)
                        .catch(reject)   
                } 
                }
            });
        });

        req.on('error', error => {
            if (retryCount < 200) {
                    fetchlistadeputados(retryCount + 1).then(resolve)
                    .catch(reject)   
            } 
        });


        req.end();
    });
}


// Gerar requisições para todos os meses do ano 2020
async function geraAno(ano,codigoIBGE){
    
    for (let month = 1; month <= 12; month++) {
        const mesAno = `${ano}${month.toString().padStart(2, '0')}`;
        await fetchBolsaFamiliaData(mesAno,codigoIBGE);
    }
}


    async function lista_deputados(){

    const resultados = await fetchlistadeputados()
    let deputados = ''

    for(let i = 0 ; i < resultados.dados.length ; i++){
        deputados = deputados + resultados.dados[i].id + '/' + resultados.dados[i].nome + '/' + resultados.dados[i].siglaPartido + '/' +  resultados.dados[i].siglaUf + ','
    }

    return deputados
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

      async function extractData(ano,mes,vereador) {
        let url = "https://remuneracao.campinas.sp.leg.br/gastos/"+ ano +"/"+ mes + "/"+ vereador + "" // substitua pela URL que deseja fazer o scraping
        const htmlData = await fetchData(url);

        if (htmlData) {
            const $ = cheerio.load(htmlData);
            const data = []; // Array para armazenar os dados de cada tabela com seu título
    
            // Itera sobre cada elemento <h4> e a <div class="row"> subsequente
            $('h4').each((index, element) => {
                const titulo = $(element).text().trim(); // Extrai o texto do título
                const tabela = $(element).next('.row').find('.table'); // Encontra a tabela na próxima div .row
    
                const linhasDaTabela = []; // Array para armazenar as linhas de dados da tabela
                tabela.find('tr').each((idx, row) => {
                    if (idx === 0) return; // Pula o cabeçalho da tabela
                    const cols = $(row).find('td');
                    const descricao = $(cols[0]).text().trim();
                    const data = $(cols[1]).text().trim();
                    const quantidade = $(cols[2]).text().trim().replace(/\s+/g, '');  // Remove espaços extra
                    const unidade = $(cols[3]).text().trim();
                    const valorTotal = $(cols[4]).text().trim();
    
                    linhasDaTabela.push({ descricao, data, quantidade, unidade , valorTotal});
                });
    
                data.push({ titulo, linhasDaTabela });
            });
            
           
            let aux 
            let aux1 = 0
            for(let i = 0 ; i < data[1].linhasDaTabela.length ; i++){
                if(data[1].linhasDaTabela[i]){
                    aux = data[1].linhasDaTabela[i].valorTotal
                    aux = aux.substring(3)
                    aux = aux.replace(',','.')
                    aux1 = aux1 + parseFloat(aux)
                    
                }
                
            }
           return aux1
            
        }   
    }

   async function pegasGastos(nome_vereador) {
    let gastosAnos = []; // Array para armazenar os gastos de cada ano

    // Loop para iterar sobre os anos de 2021 a 2024
    for (let ano = 2021; ano <= 2024; ano++) {
        let combustivel_mes = [];

        // Loop para iterar sobre os meses de 1 a 12
        for (let mes = 1; mes <= 12; mes++) {
            combustivel_mes.push(await extractData(ano, mes, nome_vereador));
        }
        gastosAnos.push(combustivel_mes); // Adiciona os gastos do ano ao array principal
    }

    return gastosAnos;
}
    



async function lerarquivo(){
    try {
        const data =  fs.readFileSync('./arquivos/lista_deputados.txt', 'utf8');
        return data ;
    } catch (err) {
        console.error(err);
    }
     
}
await ordenar_deputados()

async function ordenar_deputados() {
    let dados = await lerarquivo();
    let gasto_total = 0
    if (!dados) {
        console.log("Não foi possível ler os dados.");
        return;
    }
    
    // Dividir os dados em registros individuais, assumindo que '!' é o delimitador
    let registros = dados.split('!');
    let deputados = registros.map(registro => {
        let [nome, gasto] = registro.split(','); // Ajuste o delimitador conforme necessário
        gasto_total = gasto_total + gasto
        return { nome, gasto: parseFloat(gasto) };
    });

    // Ordenar deputados por gasto em ordem decrescente
    deputados.sort((a, b) => b.gasto - a.gasto);

    //console.log(gasto_total)
    return deputados;
}

async function gastos_totais(){
       let deputados = await lista_deputados()
       deputados = deputados.split(',')
        let teste = ""
       for(let i=0 ; i < deputados.length; i++){
        const aux = deputados[i].split('/')
        teste = teste +
        aux[1] + ',' + await pegas_gastos_deputado_int(aux[0],2023) + "!"
       }
       fs.writeFile('lista_deputados.txt', teste, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
      });
}



    async function extrairGastosDeputado(deputadoId) {
        // Carregar o arquivo Excel
        const workbook = XLSX.readFile("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/tabelas/Ano-2023.xlsx");
        // Suponha que os dados estão na primeira aba da planilha
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // Converter dados da planilha para JSON
        const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        let voos = []
    
        let gastos = [];
        
        // Iterar sobre os dados começando do índice 1 para ignorar o cabeçalho
        for (let i = 1; i < dados.length; i++) {
            let linha = dados[i];
            

            // Checar se o ID do deputado na coluna C (índice 2) é igual ao fornecido
            if (linha[2] == parseInt(deputadoId)) {
               if(parseFloat(linha[19] ) > 0 ){
                gastos.push({
                    data: linha[16], // Coluna Q é índice 16
                    descricao: linha[9]  // Coluna J é índice 9
                    
                });
                
                if (linha[9].includes("PASSAGEM AÉREA")) {
                    voos.push(linha[24])
                }
               }
               
            }
        }
        return voos;
    }

    async function nome_aeroportos(voos){

        let aux,aux1,aux2 = ""
        let itinerario = []
        for (let i = 0 ; i < voos.length ; i++){
            if(voos[i]){
                let auxiliar = voos[i].split('/')
                for(let j = 0 ; j <lista_aeroportos.length ; j++){
                    
                    if(auxiliar[0].replace(/\s/g, '') == lista_aeroportos[j].codigo){
                        aux = lista_aeroportos[j].nome_aeroporto
                    }
                    if(auxiliar[1].replace(/\s/g, '') == lista_aeroportos[j].codigo){
                        aux1 = lista_aeroportos[j].nome_aeroporto
                    }
                    if(auxiliar[2] && auxiliar[2].replace(/\s/g, '') == lista_aeroportos[j].codigo){
                        aux2 = lista_aeroportos[j].nome_aeroporto
                    }
                }
                if(auxiliar[2]){
                    itinerario.push(aux + "/" +  aux1 + '/' + aux2)
                }else{
                    itinerario.push(aux + "/" +  aux1)
                }
                
            }
        }
        return itinerario
    }

async function deputado(idDoDeputado){
const voos = await nome_aeroportos(await extrairGastosDeputado(idDoDeputado))
return contarRotas(voos)
}

function contarRotas(rotas) {
    const contadorDeRotas = {};
  
    rotas.forEach(rota => {
      if (contadorDeRotas[rota]) {
        contadorDeRotas[rota]++;
      } else {
        contadorDeRotas[rota] = 1;
      }
    });
  
    return contadorDeRotas;
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ROTAS
app.get('/lista_vereadores',async (req, res) => { 
    let vereadores = ""
    for(let i=0;i<lista_vereadores.length;i++){
        vereadores = vereadores + lista_vereadores[i].nome + ','
    }

    res.render('pages/lista_vereadores.ejs',{numero:34,vereadores:vereadores});
  })

  app.post('/lista_vereadores', async (req, res) => {
    const nomeVereador = req.body.botaoClicado; // Captura o nome do botão clicado enviado pelo formulário
    const idVereador =   nomeVereador.toLowerCase().replace(/\s+/g,'-')
    res.redirect(`/gastos_vereador?vereador=${encodeURIComponent(nomeVereador)}&id=${encodeURIComponent(idVereador)}`);
})

app.get('/senadores_home',async (req, res) => { 
    res.render('pages/lista_senadores.ejs',{dados:await senador.senadores_formatado()});
})

app.post('/senadores_home',async (req, res) => { 
    res.redirect(`/gastos_senador?nome=${encodeURIComponent(req.body.senador_nome)}`);
})

app.get('/gastos_senador',async (req, res) => { 

    const gastos = await senador.main(req.query.nome)
    let dados = []
    let total = 0
    for(let i=0;i<gastos.length;i++){
        if(i<15){
            let numero_formatado = formata_numero(gastos[i].valor)
            total+= parseFloat(numero_formatado)
            dados.push(retira_virgula(gastos[i].recurso) + "/" + numero_formatado)

        }
    }

    res.render('pages/gastos_senador.ejs',{nome:req.query.nome,dados:dados,total:total.toFixed(2)});
})

function formata_numero(inputString) {
    // Troca todas as vírgulas por pontos
    let replacedString = inputString.replace(/\./g, '');
    // Remove todos os pontos
    let finalString = replacedString.replace(/,/g, '.'); 
    return finalString;
}

function retira_virgula(inputString) {
    let finalString = inputString.replace(/,/g, ''); 
    return finalString;
}

app.get('/gastos_vereador', async (req, res) => {
    const nomeVereador = req.query.vereador; // Captura o nome do vereador a partir da query string
    const idVereador = req.query.id; // Captura o id do vereador a partir da query string
    const gastos_combustivel = await pegasGastos(idVereador)
    res.render('pages/gastos_vereador.ejs',{nome_vereador:nomeVereador,combustivel:gastos_combustivel});
})
app.get('/',async (req, res) => { 
    //const imagem = await funções.teste()
    res.render('pages/home.ejs');
   // res.render('pages/teste.ejs',{imagem: imagem});
  })

  app.post('/', async (req, res) => {
    if(req.body.hasOwnProperty("deputados")){
        return res.redirect("/lista_deputados")
       }else if(req.body.hasOwnProperty("vereadores")){
        return res.redirect("/lista_vereadores")
       }else if(req.body.hasOwnProperty("cidades")){
        return res.redirect("/home_cidades")
       }else if(req.body.hasOwnProperty("orcamento")){
        return res.redirect("/orcamento")
       }else if(req.body.hasOwnProperty("senado")){
        return res.redirect("/senadores_home")
       }
})

app.get('/lista_deputados',async (req, res) => {
    const deputados = await lista_deputados()
    res.render('pages/lista_deputados.ejs',{deputados:deputados});
    
  })

  app.post('/lista_deputados', async (req, res) => {
   res.redirect(`/gastos_deputados?deputado=${encodeURIComponent(req.body.deputado_selecionado_nome)}&id=${encodeURIComponent(req.body.deputado_selecionado_id)}`);
})

app.get('/gastos_deputados', async (req, res) => {
    
   
    const nomedeputado = req.query.deputado; // Captura o nome do deputado a partir da query string
    const iddeputado = req.query.id; // Captura o nome do deputado a partir da query string
    const gastos_2023 =  await pegas_gastos_deputado(iddeputado,2023)
    const gastos_2024 =  await pegas_gastos_deputado(iddeputado,2024)
    //let voos = await deputado(iddeputado)
    
    //res.render('pages/gastos_deputado.ejs',{nome_deputado:nomedeputado,gastos2023:gastos_2023,gastos2024:gastos_2024,lista_voos:voos});
    res.render('pages/gastos_deputado.ejs',{nome_deputado:nomedeputado,gastos2023:gastos_2023,gastos2024:gastos_2024});
})

app.get('/home_cidades',async (req, res) => {
    res.render('pages/home_cidades.ejs');
  })

  app.post('/home_cidades', async (req, res) => {
    const cidade = removerAcentos(req.body.cidade)
    const sigla = req.body.estado
    const cidade_formatada = cidade.toLocaleUpperCase() + " " + "(" + sigla + ")" 
    let dados_população = await população_cidade(cidade_formatada) 
    let dados_pib = await PIB_cidade(cidade_formatada) 
    let nome = dados_população.shift()
    dados_pib.shift()
    let crescimento_cidade_po = ((dados_população[18] -   dados_população[0]) / dados_população[0])*100
    let crescimento_cidade_pib = ((dados_pib[19] -   dados_pib[0]) / dados_pib[0])*100
    const população = await comparações_população(crescimento_cidade_po,sigla) 
    const pib = await comparações_pib(crescimento_cidade_pib,sigla) 
    res.render('pages/cidade.ejs',
        {nome:nome,
        dados_pib:dados_pib,
        crescimento_cidade_pib:crescimento_cidade_pib.toFixed(2),
        comparacao_pais_p:pib[0],
        comparacao_regiao_p:pib[1],
        comparacao_estado_p:pib[2],
        dados:dados_população,
        crescimento_cidade_po:crescimento_cidade_po.toFixed(2),
        comparacao_pais:população[0],
        comparacao_regiao:população[1],
        comparacao_estado:população[2]
    });

})

app.get('/orcamento', async (req, res) => {
    let renda = await funções_orçamento_campinas.receitas_campinas()
    let gasto = await funções_orçamento_campinas.gastos_campinas(1,"")
    res.render('pages/orçamento.ejs',{renda:renda,gasto:gasto})
})

app.post('/orcamento', async (req, res) => {
    res.redirect("/gastos_detalhados")
})

app.get('/gastos_detalhados', async (req, res) => {
    let gasto = await funções_orçamento_campinas.gastos_campinas(1,"")
    let titulo = ''

    for(let i=0; i<gasto.length; i++){
        titulo = titulo + '/' + gasto[i][0]
    }

    res.render('pages/gastos_detalhados_home.ejs',{dados:titulo})
})

app.post('/gastos_detalhados', async (req, res) => {
    let gasto = await funções_orçamento_campinas.gastos_campinas(0,req.body.botaoClicado)
    console.log(gasto)
    res.render("pages/mostrar_gastos_detalhados.ejs",{titulo:req.body.botaoClicado,dados:gasto})
})



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//AREA DE TESTES
async function comparações_população(crescimento_cidade,sigla){
    let crescimentos = []
    let comparações = await população_comparação(sigla)
    const crescimento_pais = ((comparações[0][19] - comparações[0][1] )/ comparações[0][1] ) * 100
    const crescimento_região= ((comparações[1][19] - comparações[1][1] )/ comparações[1][1] ) * 100
    const crescimento_estado= ((comparações[2][19] - comparações[2][1] )/ comparações[2][1] ) * 100
    crescimentos.push(calcularDiferencaPercentual(crescimento_cidade,crescimento_pais).toFixed(2))
    crescimentos.push(comparações[1][0] + ":" + (calcularDiferencaPercentual(crescimento_cidade, crescimento_região).toFixed(2)) )
    crescimentos.push(comparações[2][0] + ":" +  (calcularDiferencaPercentual(crescimento_cidade, crescimento_estado).toFixed(2)) )
    return crescimentos
}

async function comparações_pib(crescimento_cidade,sigla){
    let crescimentos = []
    const comparações = await PIB_comparação(sigla)
    const crescimento_pais = ((comparações[0][20] - comparações[0][1] )/ comparações[0][1] ) * 100
    const crescimento_região= ((comparações[1][20] - comparações[1][1] )/ comparações[1][1] ) * 100
    const crescimento_estado= ((comparações[2][20] - comparações[2][1] )/ comparações[2][1] ) * 100
    crescimentos.push(calcularDiferencaPercentual(crescimento_cidade,crescimento_pais).toFixed(2))
    crescimentos.push(comparações[1][0] + ":" + (calcularDiferencaPercentual(crescimento_cidade, crescimento_região).toFixed(2)) )
    crescimentos.push(comparações[2][0] + ":" +  (calcularDiferencaPercentual(crescimento_cidade, crescimento_estado).toFixed(2)) )
    return crescimentos
}
function calcularDiferencaPercentual(cidade, outro) {
    return (cidade - outro)
}

//Remove os acentos de qualquer string recebida
function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function sigla_nome_estados(nome){
    const nome_formatado = removerAcentos(nome.toLocaleUpperCase())
    for(let i=0; i<estados.length ; i++){
        let aux = removerAcentos(estados[i].nome_estado.toLocaleUpperCase())
        if(nome_formatado == aux){
            return estados[i].sigla
        }
    }
}
async function população_cidade(cidade) {
    // Carregar o arquivo Excel
    const workbook = XLSX.readFile("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/tabelas/população.csv");
    // Suponha que os dados estão na primeira aba da planilha
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // Converter dados da planilha para JSON
    const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    for (let i = 1; i < dados.length; i++) {
        
        if(dados[i][0]){
            let aux = removerAcentos(dados[i][0].toLocaleUpperCase()) 
           if(cidade == aux){
            return dados[i]
           }
        }
                
    }
}
async function população_comparação(estado) {
    // Carregar o arquivo Excel
    const workbook = XLSX.readFile("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/tabelas/população.csv");
    // Suponha que os dados estão na primeira aba da planilha
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // Converter dados da planilha para JSON
    const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const estado_formatado = await nome_estados_sigla(estado)
    const região = await descobrirRegiao(estado).toLocaleUpperCase()
    let vetor = [] 
    for (let i = 1; i < dados.length; i++) {
        
        if(dados[i][0]){
            let aux = removerAcentos(dados[i][0].toLocaleUpperCase()) 
           if("BRASIL" == aux){
            vetor.push(dados[i])
           }else if(estado_formatado == aux){
            vetor.push(dados[i])
           }else if(região == aux){
            vetor.push(dados[i])
           }
        }
                
    }
    return vetor
}

async function nome_estados_sigla(sigla){
    for(let i=0; i<estados.length ; i++){
        if(sigla == estados[i].sigla){
            return removerAcentos(estados[i].nome_estado.toLocaleUpperCase())
        }
    }
}

function descobrirRegiao(siglaEstado) {
    for (const [regiao, estados] of Object.entries(estadosPorRegiao)) {
      if (estados.includes(siglaEstado)) {
        if(regiao == "centroOeste"){
            return "Centro-Oeste"
        }
        return regiao;
      }
    }
    return 'Estado não encontrado';
  }

  async function PIB_cidade(cidade) {
    // Carregar o arquivo Excel
    const workbook = XLSX.readFile("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/tabelas/PIB.csv");
    // Suponha que os dados estão na primeira aba da planilha
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // Converter dados da planilha para JSON
    const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    for (let i = 1; i < dados.length; i++) {
        
        if(dados[i][0]){
            let aux = removerAcentos(dados[i][0].toLocaleUpperCase()) 
           if(cidade == aux){
            return dados[i]
           }
        }
                
    }
}

async function PIB_comparação(estado) {
    // Carregar o arquivo Excel
    const workbook = XLSX.readFile("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/tabelas/PIB.csv");
    // Suponha que os dados estão na primeira aba da planilha
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // Converter dados da planilha para JSON
    const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const estado_formatado = await nome_estados_sigla(estado)
    const região = await descobrirRegiao(estado).toLocaleUpperCase()
    let vetor = [] 
    for (let i = 1; i < dados.length; i++) {
        
        if(dados[i][0]){
            let aux = removerAcentos(dados[i][0].toLocaleUpperCase()) 
           if("BRASIL" == aux){
            vetor.push(dados[i])
           }else if(estado_formatado == aux){
            vetor.push(dados[i])
           }else if(região == aux){
            vetor.push(dados[i])
           }
        }
                
    }
    return vetor
}
//PIB municipios: https://sidra.ibge.gov.br/tabela/5938
