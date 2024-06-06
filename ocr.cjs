const fs = require("fs");
const axios = require("axios");
const pdfToPng = require('pdf-to-png-converter').pdfToPng;
const Tesseract = require('tesseract.js')
const natural = require('natural');
const Gemini = require("@google/generative-ai")

const API_KEY = "AIzaSyBSkd2yzt4RXP8oAum6Wd51ar53XPpH4eU";
const genAI = new Gemini.GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-pro";
const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};


const url = ["https://www.camara.leg.br/cota-parlamentar/documentos/publ/1861/2023/7668680.pdf",
'https://www.camara.leg.br/cota-parlamentar/documentos/publ/2812/2023/7514226.pdf',
"https://www.camara.leg.br/cota-parlamentar/nota-fiscal-eletronica?ideDocumentoFiscal=7509632"]
const caminho = "C:/Users/vinim/OneDrive/Área de Trabalho/TCC";


// Increase the maximum number of event listeners
require('events').EventEmitter.defaultMaxListeners = 15;



async function downloadPDF(url) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    return (`Erro na url`)
  }
}

async function pdf_to_image() {

  try{
    const pngPage = await pdfToPng("C:/Users/vinim/OneDrive/Área de Trabalho/TCC/arquivos/document.pdf", {
      disableFontFace: false,
      useSystemFonts: false,
      pagesToProcess: [1],
      viewportScale: 2.0
  });
  return pngPage
  }catch (error){
    return (`Erro no processamento do pdf`)
  }
   
}

async function OCR(imagem){
  try {
    const { data: { text } } = await Tesseract.recognize(imagem, 'por');
    return text;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

async function main() {
  try {
    let dados_formatados = []
    for(let i=0;i<url.length;i++){
        const pdfData = await downloadPDF(url[i]);
        if(pdfData != "Erro na url"){
       
          const pdfPath = `${caminho}/arquivos/document.pdf`;
          fs.writeFileSync(pdfPath, pdfData);
          const imagem = await pdf_to_image();

          if(imagem != "Erro no processamento do pdf"){
              const texto_extraido = await OCR(imagem[0].content)
              dados_formatados.push(await run(texto_extraido))
              console.log(dados_formatados)
          }
        }
      }
   
  } catch (error) {
    console.error(error);
  }
}

async function run(texto) {
 
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = "Organize as informações do texto em forma de lista:" + texto

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text
}



module.exports = {
  pega_imagem:main
};