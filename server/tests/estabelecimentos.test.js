const request = require('supertest');
const app = require('../src/app');
const Estabelecimento = require('../src/model/estabelecimento');

beforeAll(() => new Estabelecimento().deleteAll());

let insertedId = null;

test('Buscar registros com tabela vazia', async () => {
    const response = await request(app).get('/estabelecimentos').expect(204);

    expect(response.body.length).toBeUndefined();
});

test('Criar estabelecimento', async () => {
    const response = await request(app)
        .post('/estabelecimentos')
        .send({
            razao_social: 'Ryan e Isis Assessoria Jurídica Ltda',
            nome_fantasia: 'Ryan e Isis',
            cnpj: '52998350000192',
            email: 'atendimento@ryaneisis.com.br',
            endereco: 'Rua Teotônio Vilela, 836, Jardim Itamaracá',
            cidade: 'Indaiatuba',
            estado: 'SP',
            telefone: '1927130639',
            data_cadastro: '09/25/2011',
            categoria: 2,
            status: true,
            agencia: '2964',
            conta: '574684'
        })
        .expect(201);

    insertedId = response.body.insertedId;
    expect(insertedId).not.toBeNull();
});

test('Não inserir registro duplicado', async () => {
    await request(app)
        .post('/estabelecimentos')
        .send({
            razao_social: 'Ryan e Isis Assessoria Jurídica Ltda',
            cnpj: '52998350000192',
        })
        .expect(400);
});

test('Não inserir com valores inválidos', async () => {
    await request(app)
        .post('/estabelecimentos')
        .send({
            razao_social: 'Ryan e Isis Assessoria Jurídica Ltda',
            cnpj: '52998350000192874543',
        })
        .expect(400);
});

test('Buscar estabelecimento por ID', async () => {
    const response = await request(app).get(`/estabelecimentos/${insertedId}`).expect(200);
    const estabelecimento = response.body;

    expect(estabelecimento.id).toBe(insertedId);
    expect(estabelecimento.razao_social).toEqual('Ryan e Isis Assessoria Jurídica Ltda');
    expect(estabelecimento.nome_fantasia).toBe('Ryan e Isis');
    expect(estabelecimento.cnpj).toBe('52998350000192');
    expect(estabelecimento.email).toBe('atendimento@ryaneisis.com.br');
    expect(estabelecimento.endereco).toBe('Rua Teotônio Vilela, 836, Jardim Itamaracá');
    expect(estabelecimento.cidade).toBe('Indaiatuba');
    expect(estabelecimento.estado).toBe('SP');
    expect(estabelecimento.telefone).toBe('1927130639');
    expect(new Date(estabelecimento.data_cadastro)).toStrictEqual(new Date('09/25/2011'));
    expect(estabelecimento.categoria).toBe(2);
    expect(estabelecimento.status).toBe(true);
    expect(estabelecimento.agencia).toBe('2964');
    expect(estabelecimento.conta).toBe('574684');
});

test('Buscar registro por ID inexistente', async () => {
    await request(app).get('/estabelecimentos/abc').expect(204);
});

test('Inserir novo estabelecimento apenas com campos obrigatórios', async () => {
    const response = await request(app)
        .post('/estabelecimentos')
        .send({
            razao_social: 'Geraldo e Antonio Ferragens ME',
            cnpj: '61193843000146',
        })
        .expect(201);

    expect(response.body.insertedId).not.toBeNull()
});

test('Buscar todos os registros', async () => {
    const response = await request(app).get('/estabelecimentos').expect(200);

    expect(response.body.length).toBe(2);
});

test('Atualizar registro', async () => {
    const response = await request(app)
        .patch(`/estabelecimentos/${insertedId}`)
        .send({
            razao_social: 'Heloise e Renato Locações de Automóveis Ltda',
            nome_fantasia: 'Heloise e Renato',
            cnpj: '34144768000150',
            email: 'atendimento@heloiseerenato.com.br',
            endereco: 'Rua Moacir Ramalho, 937, São Cristóvão',
            cidade: 'Teófilo Otoni',
            estado: 'MG',
            telefone: '33988528540',
            data_cadastro: '07/13/1983',
            categoria: 4,
            status: false,
            agencia: '9832',
            conta: '752934'
        })
        .expect(200);

    // console.log('insertedId:', insertedId);

    const estabelecimento = response.body;

    console.log(estabelecimento);

    // console.log('estabelecimento.id:', estabelecimento.id);

    expect(estabelecimento.id).toBe(insertedId);
    expect(estabelecimento.razao_social).toEqual('Heloise e Renato Locações de Automóveis Ltda');
    expect(estabelecimento.nome_fantasia).toBe('Heloise e Renato');
    expect(estabelecimento.cnpj).toBe('34144768000150');
    expect(estabelecimento.email).toBe('atendimento@heloiseerenato.com.br');
    expect(estabelecimento.endereco).toBe('Rua Moacir Ramalho, 937, São Cristóvão');
    expect(estabelecimento.cidade).toBe('Teófilo Otoni');
    expect(estabelecimento.estado).toBe('MG');
    expect(estabelecimento.telefone).toBe('33988528540');
    expect(new Date(estabelecimento.data_cadastro)).toStrictEqual(new Date('07/13/1983'));
    expect(estabelecimento.categoria).toBe(4);
    expect(estabelecimento.status).toBe(false);
    expect(estabelecimento.agencia).toBe('9832');
    expect(estabelecimento.conta).toBe('752934');
});

test('Não atualizar registro com valores inválidos', async () => {
    
});

test('Excluír registro', async () => {

});