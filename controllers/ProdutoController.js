const mongoose = require('mongoose');
const Produto = mongoose.model("Produto");
const Categoria = mongoose.model("Categoria");
const Avaliacao = mongoose.model("Avaliacao");
const Variacao = mongoose.model("Variacao");

const getSort = (sortType) =>{
    switch(sortType){
        case "alfabetica_a-z":
            return {titulo: 1};
        case "alfabetica_z-a":
            return {titulo: -1};
        case "preco-crescente":
            return {preco: 1};    
        case "preco-decrescente":
            return {preco: -1};
        default:
            return{};    
    }
};

class ProdutoController {
    //Admin 

    //Post /- Store
    async store(req,res,next){
        const {titulo, descricao, categoria: categoriaId, preco, promocao, sku} = req.body;
        const {loja} = req.query;
        try{
            const produto = new Produto({ 
                titulo, 
                disponibilidade: true, 
                descricao, 
                categoria: categoriaId, 
                preco, 
                promocao, 
                sku, 
                loja
            });

            const categoria = await Categoria.findById(categoriaId);
            categoria.produtos.push(produto._id);

            await produto.save();
            await categoria.save();

            return res.send({produto});
        }catch(e){
            next(e);
        }
    }

    async update(req,res,next){
        const { titulo, descricao, disponibilidade, fotos, categoria, preco, promocao, sku } = req.body;
        const { loja } = req.query;

        try {

            const produto = await Produto.findById(req.params.id);
            if(!produto) return res.status(400).send({ error: "Produto não encontrado." });

            if( titulo ) produto.titulo = titulo;
            if( descricao ) produto.descricao = descricao;
            if( disponibilidade !== undefined ) produto.disponibilidade = disponibilidade;
            if( fotos ) produto.fotos = fotos;
            if( preco ) produto.preco = preco;
            if( promocao ) produto.promocao = promocao;
            if( sku ) produto.sku = sku;

            if( categoria && categoria.toString() !== produto.categoria.toString() ){
                const oldCategoria = await Categoria.findById(produto.categoria);
                const newCategoria = await Categoria.findById(categoria);

                if(oldCategoria && newCategoria){
                    oldCategoria.produtos = oldCategoria.produtos.filter(item => item.toString() !== produto._id.toString());
                    newCategoria.produtos.push(produto._id);
                    produto.categoria = categoria;
                    await oldCategoria.save();
                    await newCategoria.save();
                } else if(newCategoria){
                    newCategoria.produtos.push(produto._id);
                    produto.categoria = categoria;
                    await newCategoria.save();
                }
            }

            await produto.save();

            return res.send({ produto });

        }catch(e){
            next(e);
        }
    }

    //PUT /images/:id
    async updateImages(req, res,next){
        try{
            const {loja} = req.query;
            const produto = await Produto.findOne({_id: req.params.id, loja});
            if(!produto) return res.status(400).send({error: "Produto não encontrado"});

            const novasImages = req.files.map(item => item.filename);
            produto.fotos = produto.fotos.filter(item => item).concat(novasImages);

            await produto.save();

            return res.send({produto});
        }catch(e){
            next(e);
        }
    }

    //Delete /images/:id
    async remove(req, res,next){
        const {loja} = req.query;
        try{
            const produto = await Produto.findOne({_id: req.params.id, loja});
            if(!produto) return res.status(400).send({error: "Produto não encontrado"});

            const categoria = await Categoria.findById(produto.categoria);
            if(categoria){
                categoria.produtos = categoria.produtos.filter(item => item !== produto._id); // filter retorna todos os produtos menos o produto a ser removido
                categoria.save();
            }

            await produto.remove();
            return res.send({ deleted: true });

        }catch(e){
            next(e);
        }
    }

    //Cliente Usuario admin
    async index(req, res,next){
        const offset = Number(req.query.offset) || 0;
        const limit = Number(req.query.limit) || 30;
        try{
            const produtos = await Produto.paginate(
                {loja: req.query.loja},
                {offset, limit, sort: getSort(req.query.sortType)}
            );

            return res.send({produtos});
        }catch(e){
            next(e);
        }  
    }

    //GET DISPONIVEIS
    async indexDisponiveis(req, res,next){
        const offset = Number(req.query.offset) || 0;
        const limit = Number(req.query.limit) || 30;
        try{
            const produtos = await Produto.paginate(
                {loja: req.query.loja, disponibilidade: true},
                {offset, limit, sort: getSort(req.query.sortType)}
            );

            return res.send({produtos});
        }catch(e){
            next(e);
        }  
    }

    //get /search/:search
    async search(req, res, next){
        const offset = Number(req.query.offset) || 0;
        const limit = Number(req.query.limit) || 30;
        const search = new RegExp(req.params.search, "i"); // i case sensitive 
        try{
            const produtos = await Produto.paginate(
                {
                    loja: req.query.loja,
                    $or: [ //em qualquer um que se encaixar os criterios será o retorno
                    {"titulo": {$regex: search}},
                    {"descricao": {$regex: search}},
                    {"sku": {$regex: search}},
                        ]  
                },
                {offset, limit, sort: getSort(req.query.sortType)}
            );
            return res.send({produtos});
        }catch(e){
            next(e);
        }
    }

    //Get /:id
    async show(req, res,next){
        try{
            const produto = await Produto.findById(req.params.id).populate(["avaliacoes", "variacoes", "loja"]); //populate para exibir os dados de outros modelos relacionados ao modelo de produto
            return res.send({produto});
        }catch(e){
            next(e);
        }  
    }

    //Avaliacoes 

    //GET /:id/avaliacoes
    async showAvaliacoes (req, res, next){
        try{
            const avaliacoes = await Avaliacao.find({produto: req.params.id});
            return res.send({avaliacoes});
        }catch(e){
            next(e);
        }
    }

      //Variacoes

    //GET /:id/variacoes
    async showVariacoes (req, res, next){
        try{
            const variacoes = await Variacao.find({produto: req.params.id});
            return res.send({variacoes});
        }catch(e){
            next(e);
        }
    }



}

module.exports = ProdutoController