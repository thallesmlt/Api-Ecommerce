const mongoose = require("mongoose");
const Variacao = mongoose.model("Variacao");
const Produto = mongoose.model("Produto");

class VariacaoController{

    //GET /- Index 
    async index(req, res,next){
        const {loja, produto} = req.query;
        try{
        const variacoes = await Variacao.find({loja, produto});
        return res.send({variacoes}); 
        }catch(e){
            next(e);
        }
    }
    
    //GET/:id - show 
    async show(req, res, next){
        const {loja, produto} = req.query;
        const {id: _id} = req.params;
        try{
            const variacao = await Variacao.findOne({loja, produto, _id});
            return res.send({variacao});
        }catch(e){
            next(e);
        }
    }

    //POST /- store 
    async store(req, res, next){
        const {codigo,nome,preco,promocao,fotos,entrega,quantidade} = req.body;
        const {loja, produto} = req.query;
        try{
            const variacao = new Variacao({  
                codigo,nome,preco,promocao,fotos,entrega,quantidade,loja,produto
            });

            const _produto = await Produto.findById(produto);
            if(!_produto) return res.status(400).send({error: "Produto não existe!!"});
            _produto.variacoes.push(variacao._id);

            await _produto.save();
            await variacao.save();
            return res.send({variacao});
        }catch(e){
            next(e);
        }
    }

//PUT /:id - update 
async update(req, res, next){
    const {codigo,nome,preco,promocao,fotos,entrega,quantidade,disponibilidade} = req.body;
    const {loja, produto} = req.query;
    const {id: _id} = req.params;
    try{
        const variacao = await Variacao.findOne({loja,produto, _id});
        if(!variacao) return res.status(400).send({error: "Variação não encontrada"});

        if(codigo) variacao.codigo = codigo;
        if(nome) variacao.nome = nome;
        if(preco) variacao.preco = preco;
        if(promocao) variacao.promocao = promocao;
        if(entrega) variacao.entrega = entrega;
        if(quantidade) variacao.quantidade = quantidade;
        if(disponibilidade !== undefined) variacao.disponibilidade = disponibilidade;
        
        await variacao.save();
        return res.send({variacao});
    
    }catch(e){
        next(e);
    }
}
    
    //PUT /images/:id - updateImages
    async updateImages(req, res, next){
        const {loja,produto} = req.query;
        const {id: _id} = req.params;
        try{
            const variacao = await Variacao.findOne({loja,produto, _id});
            if(!variacao) return res.status(400).send({error: "Variação não encontrada"});

            const novasImages = req.files.map(item => item.filename);
            variacao.fotos = variacao.fotos.filter(item => item).concat(novasImages);
            await variacao.save();
            return res.send({variacao});
        }catch(e){
            next(e);
        }
    }

    //DELTE /:id - remove
    async remove(req, res, next){
        const {loja, produto} = req.query;
        const {id: _id} = req.params;
        try{
            const variacao = await Variacao.findOne({loja,produto, _id});
            if(!variacao) return res.status(400).send({error: "Variação não encontrada"});

            const _produto = await Produto.findById(variacao.produto);
            _produto.variacoes = _produto.variacoes.filter(item => item.toString() !== variacao._id.toString());
            
            await _produto.save();
            await variacao.remove();
            return res.send({deletado: true});
        }catch(e){
            next(e);
        }
    }
}

module.exports = VariacaoController;