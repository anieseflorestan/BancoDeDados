import pg from 'pg';
const { Client } = pg;

const client = new Client({
    host:     'localhost',
    port:     5432,
    user:     'postgres',
    password: 'root',
    database: 'escola_db'
});


async function main() {
    try {
        await client.connect();

        const resultado = await client.query(`
            SELECT id, nome, nota
            FROM alunos
            WHERE presente = true
        `);

        if (resultado.rows.length === 0) {
            console.log('Nenhum aluno presente.');
        } else {
            console.log('Alunos presentes:');

            resultado.rows.forEach(aluno => {
                console.log(
                    `ID: ${aluno.id} | Nome: ${aluno.nome} | Nota: ${aluno.nota}`
                );
            });
        }

        const aprovados = await client.query(`
            SELECT id, nome, nota
            FROM alunos
            WHERE nota >= 7
        `);

        console.log('\nAlunos com nota maior ou igual a 7:');

        if (aprovados.rows.length === 0) {
            console.log('Nenhum aluno encontrado.');
        } else {
            aprovados.rows.forEach(aluno => {
                console.log(
                    `ID: ${aluno.id} | Nome: ${aluno.nome} | Nota: ${aluno.nota}`
                );
            });
        }

    } catch (erro) {
        console.error('Erro:', erro.message);
    } finally {
        await client.end();
    }
}

main();