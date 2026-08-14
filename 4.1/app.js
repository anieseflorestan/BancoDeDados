import pg from 'pg';
const { Client } = pg;

const client = new Client({
    host:     'localhost',
    port:     5432,
    user:     'postgres',
    password: 'root',
    database: 'escola_db'
});

client.connect()
    .then(() => {
        console.log('✅ Conectado ao PostgreSQL!');
        client.end();
    })
    .catch(erro => {
        console.log('❌ Erro ao conectar:', erro.message);
    });
