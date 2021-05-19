const mongoose = require("mongoose");
const produto = require("../models/produto");

const Categoria = mongoose.model("Categoria");
const Produto = mongoose.model("Produto");

class CategoriaController {

    //Get Index


    
    async index(req,res,next){
        try{
             const categorias = await Categoria.find({ loja: req.query.loja});
             return res.send({categorias});
        }catch(e){
            next(e);
        }
    }

    //Get /disponiveis
    indexDisponiveis(req,res,next){
        Categoria
        .find({ loja: req.query.loja, disponibilidade: true })
        .select("_id produtos nome codigo disponibilidade loja")
        .then((categorias) => res.send({ categorias }))
        .catch(next);
    }

    // /:Id show

    show(req,res,next){
        Categoria.findOne({ loja: req.query.loja, _id: req.params.id })
        .select("_id produtos nome codigo disponibilidade loja")
        .then(categoria => res.send({ categoria }))
        .catch(next);
    }

    /*Funcoes do Admin Admin*/

    //Post 
    store(req, res, next) {
        const { nome, codigo } = req.body;
        const { loja } = req.query;
        const categoria = new Categoria({ nome, codigo, loja, disponibilidade: true });
        categoria.save()
            .then(() => res.send({ categoria }))
            .catch(next);
    }

    //PUT /:id update

    async update(req,res,next){
        const { nome, codigo, disponibilidade, produtos } = req.body;
        try {
            const categoria = await Categoria.findById(req.params.id);

            if(nome) categoria.nome = nome;
            if(disponibilidade !== undefined) categoria.disponibilidade = disponibilidade;
            if(codigo) categoria.codigo = codigo;
            if(produtos) categoria.produtos = produtos;

            await categoria.save();
            return res.send({ categoria });
        } catch(e){
            next(e);
        }
    }


    //Remove /:id /Delete 
    async remove(req,res,next){
        try{
            const categoria = await Categoria.findById(req.params.id);
            await categoria.remove();
            return res.send({ deletado: true });
        }catch(e){
            next(e);
        }
    }

    

    /** Produtos */
    //GET /:id/produtos -showProdutos  //mostra todos os produtos de uma categoria
    async showProdutos(req,res,next){
        const {offset, limit} = req.query
        try{
            const produtos = await Produto.paginate(
                { categoria: req.params.id},
                {offset: Number(offset) || 0 , limit: Number(limit) || 30}
                );

                return res.send({produtos});
        }catch(e){
            next(e);
        }
    }

    

    //put //:Id/produtos  Atualiza array de produtos

    async updateProdutos(req,res,next){
        try {
            const categoria = await Categoria.findById(req.params.id);
            const { produtos } = req.body;
            if(produtos) categoria.produtos = produtos;
            await categoria.save();

            let _produtos = await Produto.find({
                $or: [
                    { categoria: req.params.id },
                    { _id: { $in: produtos } }
                ]
            });
            _produtos = await Promise.all(_produtos.map(async (produto) => {
                if(!produtos.includes(produto._id.toString())){
                    produto.categoria = null;
                } else {
                    produto.categoria = req.params.id;
                }
                await produto.save();
                return produto;
            }));

            const resultado = await Produto.paginate({ categoria: req.params.id }, { offset: 0, limit: 30 });
            return res.send({ produtos: resultado });
        }catch(e){
            next(e);
        }
    }
}

module.exports = CategoriaController;