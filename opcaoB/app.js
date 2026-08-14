import pg from 'pg';
import promptSync from 'prompt-sync';

const { Client } = pg;
const prompt = promptSync();

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'root',
    database: 'escola_db'
});

async function cadastrarJogo() {
    try {

        const titulo = prompt('Título do jogo: ');
        const genero = prompt('Gênero: ');
        const nota = Number(prompt('Nota (0 a 10): '));
        const ano = Number(prompt('Ano de lançamento: '));

        if (titulo.trim() === '') {
            console.log('❌ Erro: o título não pode estar vazio.');
            return;
        }

        if (Number.isNaN(nota) || nota < 0 || nota > 10) {
            console.log('❌ Erro: a nota deve estar entre 0 e 10.');
            return;
        }

        if (Number.isNaN(ano) || ano <= 1970) {
            console.log('❌ Erro: o ano de lançamento deve ser maior que 1970.');
            return;
        }

        await client.connect();

        const query = `
            INSERT INTO jogos (titulo, genero, nota, ano)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const valores = [titulo, genero, nota, ano];

        const resultado = await client.query(query, valores);


        console.log('\n✅ Jogo cadastrado com sucesso!');
        console.log('Dados salvos:');
        console.log(resultado.rows[0]);


        const lista = await client.query(`
            SELECT *
            FROM jogos
            ORDER BY id
        `);

        console.log('\n🎮 LISTA DE JOGOS:\n');

        lista.rows.forEach(jogo => {
            console.log(
                `[${jogo.id}] ${jogo.titulo} — Gênero: ${jogo.genero} — Nota: ${jogo.nota} — Ano: ${jogo.ano}`
            );
        });

    } catch (erro) {

        console.log('❌ Erro:', erro.message);

    } finally {

        await client.end();

    }
}

cadastrarJogo();