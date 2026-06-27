const express = require('express');
const mongoMock = require('mongo-mock');

const app = express();
app.use(express.json()); 


mongoMock.max_delay = 0;
const MongoClient = mongoMock.MongoClient;
const url = 'mongodb://localhost:27017/academia_db';

let db, alunosCollection, adminsCollection;


MongoClient.connect(url, {}, (err, client) => {
    if (err) return console.error("Erro ao conectar no banco:", err);
    db = client.db('academia_db');
    alunosCollection = db.collection('alunos'); 
    adminsCollection = db.collection('administradores'); 
    console.log("Banco de dados não-relacional iniciado com sucesso!");
});



app.post('/alunos', (req, res) => {
    const novoAluno = { _id: Date.now().toString(), ...req.body };
    alunosCollection.insert([novoAluno], (err, result) => {
        res.status(201).json({ mensagem: "Aluno inserido com sucesso!", aluno: novoAluno });
    });
});


app.get('/alunos', (req, res) => {
    alunosCollection.find({}).toArray((err, docs) => {
        res.json(docs);
    });
});


app.get('/alunos/:id', (req, res) => {
    alunosCollection.findOne({ _id: req.params.id }, (err, doc) => {
        if (!doc) return res.status(404).json({ erro: "Aluno não encontrado" });
        res.json(doc);
    });
});


app.put('/alunos/:id', (req, res) => {
    alunosCollection.update({ _id: req.params.id }, { $set: req.body }, {}, (err, result) => {
        res.json({ mensagem: "Aluno atualizado com sucesso!" });
    });
});


app.remove = app.delete; 
app.delete('/alunos/:id', (req, res) => {
    alunosCollection.remove({ _id: req.params.id }, {}, (err, result) => {
        res.json({ mensagem: "Aluno removido com sucesso!" });
    });
});


app.post('/admins', (req, res) => {
    const novoAdmin = { _id: Date.now().toString(), ...req.body };
    adminsCollection.insert([novoAdmin], (err, result) => {
        res.status(201).json({ mensagem: "Administrador inserido com sucesso!", admin: novoAdmin });
    });
});


app.get('/admins', (req, res) => {
    adminsCollection.find({}).toArray((err, docs) => {
        res.json(docs);
    });
});


app.get('/admins/:id', (req, res) => {
    adminsCollection.findOne({ _id: req.params.id }, (err, doc) => {
        if (!doc) return res.status(404).json({ erro: "Administrador não encontrado" });
        res.json(doc);
    });
});


app.put('/admins/:id', (req, res) => {
    adminsCollection.update({ _id: req.params.id }, { $set: req.body }, {}, (err, result) => {
        res.json({ gang: "Administrador atualizado com sucesso!" });
    });
});


app.delete('/admins/:id', (req, res) => {
    adminsCollection.remove({ _id: req.params.id }, {}, (err, result) => {
        res.json({ mensagem: "Administrador removido com sucesso!" });
    });
});


app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000!");
});
