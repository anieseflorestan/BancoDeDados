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

async function cadastrarAluno() {
    try {
        
        const nome = prompt('Nome do aluno: ');
        const turma = prompt('Turma: ');
        const nota = Number(prompt('Nota (0 a 10): '));

      
        if (nome.trim() === '') {
            console.log('❌ Erro: o nome não pode estar vazio.');
            return;
        }

        if (Number.isNaN(nota) || nota < 0 || nota > 10) {
            console.log('❌ Erro: a nota deve estar entre 0 e 10.');
            return;
        }

        // Só conecta ao banco depois das validações
        await client.connect();

        const query = `
            INSERT INTO alunos (nome, turma, nota)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const valores = [nome, turma, nota];

        const resultado = await client.query(query, valores);

        console.log('\n✅ Aluno cadastrado com sucesso!');
        console.log('Dados salvos:', resultado.rows[0]);

        const lista = await client.query(`
            SELECT *
            FROM alunos
            ORDER BY id
        `);

        console.log('\n🎓 LISTA DE ALUNOS:\n');

        lista.rows.forEach(p => {
            console.log(
                `[${p.id}] ${p.nome} — Turma: ${p.turma} — Nota: ${p.nota}`
            );
        });

    } catch (erro) {
        console.log('❌ Erro:', erro.message);

    } finally {
        await client.end();
    }
}

cadastrarAluno();