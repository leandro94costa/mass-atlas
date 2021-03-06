import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import cnpjUtils from 'node-cnpj';

import validation from '../../../utils/validation';
import date from '../../../utils/date';
import mask from '../../../utils/mask';
import unMask from '../../../utils/unMask';
import Input from '../../fragments/Inputs/Input';
import InputCNPJ from '../../fragments/Inputs/InputCNPJ';
import InputTelefone from '../../fragments/Inputs/InputTelefone';
import SelectEstado from '../../fragments/Selects/SelectEstado';
import InputDataCadastro from '../../fragments/Inputs/InputDataCadastro';
import SelectCategoria from '../../fragments/Selects/SelectCategoria';
import InputAgencia from '../../fragments/Inputs/InputAgencia';
import InputConta from '../../fragments/Inputs/InputConta';
import FeedbackMessage from '../../fragments/Modals/FeedbackMessage';

const Estabelecimento = props => {
    const { id } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState('Estabelecimento');
    const [status, setStatus] = useState(false);
    const [fantasia, setFantasia] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cadastro, setCadastro] = useState(null);
    const [categoria, setCategoria] = useState(0);
    const [agencia, setAgencia] = useState('');
    const [conta, setConta] = useState('');
    const [cnpjValidationMsg, setCnpjValidationMsg] = useState('');
    const [emailValidationMsg, setEmailValidationMsg] = useState('');
    const [telefoneValidationMsg, setTelefoneValidationMsg] = useState('');
    const [cadastroValidationMsg, setCadastroValidationMsg] = useState('');
    const [agenciaValidationMsg, setAgenciaValidationMsg] = useState('');
    const [contaValidationMsg, setContaValidationMsg] = useState('');
    const [showSuccessMessage, setShowSucessMessage] = useState(false);
    const [showFailureMessage, setShowFailureMessage] = useState(false);

    useEffect(() => {
        if (id) {
            axios.get(`/estabelecimentos/${id}`)
            .then(response => {
                const { data } = response;

                if (data.id) {
                    setTitle(data.nome_fantasia ? data.nome_fantasia : data.razao_social);
                    setFantasia(data.nome_fantasia);
                    setRazaoSocial(data.razao_social);
                    setCnpj(cnpjUtils.mask(data.cnpj));
                    setEmail(data.email);
                    setTelefone(mask.telefone(data.telefone));
                    setEndereco(data.endereco);
                    setCidade(data.cidade);
                    setEstado(data.estado);
                    setCadastro(mask.data(data.data_cadastro));
                    setCategoria(data.categoria);
                    setStatus(data.status);
                    setAgencia(mask.agencia(data.agencia));
                    setConta(mask.conta(data.conta));
                }
            })
            .catch(error => {
                setTitle('Estabelecimento não encontrado');
                console.log(error);
            });
        }
    }, [id]);

    const save = () => {
        const estabelecimento = createObject();

        if (id) {   // edit

            axios.patch(`/estabelecimentos/${id}`, estabelecimento)
            .then(response => {
                setShowSucessMessage(true);
            })
            .catch(error => {
                setShowFailureMessage(true);
                console.log(error);
            })
        } else {    // insert

            axios.post('/estabelecimentos', estabelecimento)
            .then(response => {
                setShowSucessMessage(true);
            })
            .catch(error => {
                setShowFailureMessage(true);
                console.log(error);
            })
        }
    }

    const createObject = () => {
        const estabelecimento = {
            razao_social: razaoSocial,
            nome_fantasia: fantasia,
            cnpj: unMask(cnpj),
            email,
            endereco,
            cidade,
            estado,
            telefone: unMask(telefone),
            data_cadastro: date.format(cadastro),
            categoria: categoria !== 0 ? categoria : null,
            status,
            agencia: unMask(agencia),
            conta: unMask(conta)
        }
        for (let propName in estabelecimento) { 
            if (estabelecimento[propName] === null || estabelecimento[propName] === undefined || estabelecimento[propName] === '') {
                delete estabelecimento[propName];
            }
        }
        return estabelecimento;
    }

    const handleSubmit = event => {
        event.preventDefault();

        const validationRes = validation.preSave({ 
            cnpj: unMask(cnpj), 
            email, 
            telefone: unMask(telefone), 
            cadastro: date.format(cadastro), 
            categoria, 
            agencia: unMask(agencia), 
            conta: unMask(conta)
        });

        if (validationRes.length === 0) {
            save();
        } else {
            validationRes.forEach(val => {
                if (val.field === 'cnpj') {
                    setCnpjValidationMsg(val.message);
                }
                if (val.field === 'email') {
                    setEmailValidationMsg(val.message);
                }
                if (val.field === 'telefone') {
                    setTelefoneValidationMsg(val.message);
                }
                if (val.field === 'cadastro') {
                    setCadastroValidationMsg(val.message);
                }
                if (val.field === 'agencia') {
                    setAgenciaValidationMsg(val.message);
                }
                if (val.field === 'conta') {
                    setContaValidationMsg(val.message);
                }
            });
        }
    }

    const handleCancelarClick = () => {
        history.push('/estabelecimentos');
    }

    const handleSuccessMessageClose = () => {
        setShowSucessMessage(false);
        history.push('/estabelecimentos');
    }

    const handleFailureMessageClose = () => {
        setShowFailureMessage(false);
    }

    return (
        <div>
            <h2 className="text-center">
                { !id ? 
                    <span className="badge badge-primary">Novo</span> 
                : '' } {title}
            </h2>
            <form className="container needs-validation mt-4" onSubmit={event => handleSubmit(event)}>
                <div className="row-c mb-4">
                    <div className="custom-control custom-switch">
                        <input 
                            type="checkbox" 
                            className="custom-control-input" 
                            id="switchAtivo"
                            checked={status ? 'checked' : ''}
                            onChange={() => setStatus(!status)}
                        />
                        <label className="custom-control-label" htmlFor="switchAtivo">Ativo</label>
                    </div>
                </div>
                <div className="row-c">
                    <Input
                        span="span2of2"
                        inputId="inputNomeFantasia"
                        label="Nome fantasia"
                        type="text"
                        maxLength={60}
                        required={false}
                        value={fantasia}
                        onChange={value => setFantasia(value)}
                    />
                </div>
                <div className="row-c">
                    <Input
                        span="span2of2"
                        inputId="inputRazaoSocial"
                        label="Razão social"
                        type="text"
                        maxLength={80}
                        required={true}
                        value={razaoSocial}
                        onChange={value => setRazaoSocial(value)}
                    />
                </div>
                <div className="row-c">
                    <InputCNPJ
                        span="span1of3"
                        inputId="inputCnpj"
                        label="CNPJ"Telefone
                        maxLength={18}
                        invalidMessage={cnpjValidationMsg}
                        required={true}
                        value={cnpj}
                        onChange={value => setCnpj(value)}
                    />
                    <Input
                        span="span1of3"
                        inputId="inputEmail"
                        label="E-mail"
                        type="email"
                        maxLength={45}
                        invalidMessage={emailValidationMsg}
                        required={false}
                        value={email}
                        onChange={value => setEmail(value)}
                    />
                    <InputTelefone
                        span="span1of3"
                        inputId="inputTelefone"
                        label="Telefone"
                        type="text"
                        invalidMessage={telefoneValidationMsg}
                        required={categoria === 1}  // Categoria 1 - Supermercado = telefone obrigatório
                        value={telefone}
                        onChange={value => setTelefone(value)}
                    />
                </div>
                <div className="row-c">
                    <Input
                        span="span2of4"
                        inputId="inputEndereco"
                        label="Endereço"
                        type="text"
                        maxLength={60}
                        required={false}
                        value={endereco}
                        onChange={value => setEndereco(value)}
                    />
                    <Input
                        span="span1of4"
                        inputId="inputCidade"
                        label="Cidade"
                        type="text"
                        maxLength={32}
                        required={false}
                        value={cidade}
                        onChange={value => setCidade(value)}
                    />
                    <SelectEstado
                        span="span1of4"
                        value={estado}
                        onChange={value => setEstado(value)}
                    />
                </div>
                <div className="row-c">
                    <div className="col-c span1of3">
                        <InputDataCadastro
                            span="span2of2"
                            inputId="dateCadastro"
                            label="Cadastro"
                            type="text"
                            invalidMessage={cadastroValidationMsg}
                            required={false}
                            value={cadastro}
                            onChange={value => setCadastro(value)}
                        />
                    </div>
                    <div className="col-c span1of3">
                        <SelectCategoria
                            span="span2of2"
                            value={categoria}
                            onChange={value => setCategoria(value)}
                        />
                    </div>
                    <div className="col-c span1of3">
                        <InputAgencia
                            span="span1of2"
                            inputId="inputAgencia"
                            label="Agência"
                            type="text"
                            maxLength={4}
                            invalidMessage={agenciaValidationMsg}
                            required={false}
                            value={agencia}
                            onChange={value => setAgencia(value)}
                        />
                        <InputConta
                            span="span1of2"
                            inputId="inputConta"
                            label="Conta"
                            type="text"
                            maxLength={6}
                            invalidMessage={contaValidationMsg}
                            required={false}
                            value={conta}
                            onChange={value => setConta(value)}
                        />
                    </div>
                </div>
                <div className="row-c mt-2">
                    <div className="col-c span1of2">
                        <div className="form-group float-right">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                    <div className="col-c span1of2">
                        <div className="form-group">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => handleCancelarClick()}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            { showSuccessMessage ?
                <FeedbackMessage
                    title="Sucesso"
                    message="Registro salvo com sucesso."
                    success={true}
                    onClose={() => handleSuccessMessageClose(false)}
                />
            : '' }

            { showFailureMessage ?
                <FeedbackMessage
                    title="Erro"
                    message="Erro ao salvar registro, verifique as informações e tente novamente."
                    success={false}
                    onClose={() => handleFailureMessageClose(false)}
                />
            : '' }
       </div>
    );
}

export default Estabelecimento;