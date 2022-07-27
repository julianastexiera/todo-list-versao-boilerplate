// signup component similar to login page (except loginWithPassword)
// instead createUser to insert a new user account document

// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '../../../ui/components/SimpleFormFields/TextField/TextField';
import Button from '@mui/material/Button';
import { userprofileApi } from '../../../userprofile/api/UserProfileApi';
import SimpleForm from '/imports/ui/components/SimpleForm/SimpleForm';

import { signupStyle } from './SignupStyle';
import { EmailVerify } from '../EmailVerify/EmailVerify';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', error: '' };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // Using a ref is accessing the DOM directly and not preferred
    // The React way to get the value from an input is using onChange
    handleChange(e, { name, value }) {
        this.setState({ [name]: value });
    }

    handleSubmit(doc) {
        const { username, email, phone, password } = doc;

        //  userprofileApi.insertNewUser({ email, username: email, password }, (err, r) => {
        userprofileApi.insertNewUser(
            { username: username, email: email, phone: phone, password: password },
            (err, r) => {
                console.log(username + ' ' + email + ' ' + phone + ' ' + password);
                if (err) {
                    console.log('Login err', err);
                    this.props.showNotification({
                        type: 'warning',
                        title: 'Problema na criação do usuário!',
                        description: 'Erro ao fazer registro em nossa base de dados!',
                    });
                } else {
                    this.props.showNotification({
                        type: 'sucess',
                        title: 'Cadastrado com sucesso!',
                        description: 'Registro de usuário realizado em nossa base de dados!',
                    });
                }
            }
        );
    }

    render() {
        const { error } = this.state;

        return (
            <Container style={signupStyle.containerSignUp}>
                <h2 style={signupStyle.labelRegisterSystem}>
                    <img
                        src="data:image/png;base64,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"
                        style={signupStyle.imageLogo}
                    />
                    {'Cadastrar no sistema'}
                </h2>
                <SimpleForm
                    schema={{
                        username: {
                            type: String,
                            label: 'Username',
                            optional: false,
                        },
                        email: {
                            type: String,
                            label: 'Email',
                            optional: false,
                        },
                        phone: {
                            type: String,
                            label: 'Telefone',
                            optional: false,
                        },
                        password: {
                            type: String,
                            label: 'Senha',
                            optional: false,
                        },
                    }}
                    onSubmit={this.handleSubmit}
                >
                    <TextField
                        id="Username"
                        label="Username"
                        fullWidth
                        name="username"
                        type="username"
                        placeholder="Digite um username"
                        onChange={this.handleChange}
                    />
                    <TextField
                        id="Email"
                        label="Email"
                        fullWidth
                        name="email"
                        type="email"
                        placeholder="Digite um email"
                        onChange={this.handleChange}
                    />
                    <TextField
                        id="Phone"
                        label="Telefone"
                        fullWidth
                        name="phone"
                        type="phone"
                        placeholder="Digite um email"
                        onChange={this.handleChange}
                    />
                    <TextField
                        id="Senha"
                        label="Senha"
                        fullWidth
                        name="password"
                        placeholder="Digite uma senha"
                        type="password"
                        onChange={this.handleChange}
                    />
                    <div style={signupStyle.containerButtonOptions}>
                        <Button color={'primary'} variant={'outlined'} submit>
                            {'Cadastrar'}
                        </Button>
                    </div>
                </SimpleForm>
                <div style={signupStyle.containerRouterSignIn}>
                    Já tem uma conta? Faça login clicando{' '}
                    <Link to="/signin" color={'secondary'}>
                        aqui
                    </Link>
                </div>
                {/* <EmailVerify/> */}
            </Container>
        );
    }
}
