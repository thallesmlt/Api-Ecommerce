module.exports = {
    secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "AHAWWWDhduwd454f5w5fwe5dw56f5fw564f4wf45w4f4weevFE8488%%$",
    api: process.env.NODE_ENV === "production" ? "https://api.loja-teste.amplie.com" : "http://localhost:3000",
    loja: process.env.NODE_ENV === "production" ? "https://loja-teste.amplie.com" : "http://localhost:8000"
     //token para identificação
};

