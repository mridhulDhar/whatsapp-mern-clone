import React from 'react';

import FormInput from '../form-input/forminput.component';
import CustomButton from '../custom-button/custom-button.component';
import { auth, signInWithGoogle } from '../../firebase';
import { Button } from '@material-ui/core';
import './signin.styles.css';

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
    }

    handleSubmit = async event => {
        event.preventDefault();
        const { email, password } = this.state;
        try {
            await auth.signInWithEmailAndPassword(email, password);
            this.setState({ email: '', password: '' });
        } catch (error) {
            console.log(error);
        }


    };

    handleChange = event => {
        const { value, name } = event.target;

        this.setState({ [name]: value });
    };

    render() {
        return (
            <div className='sign-in'>
                <form onSubmit={this.handleSubmit}>
                    <FormInput
                        name='email'
                        type='email'
                        handleChange={this.handleChange}
                        value={this.state.email}
                        label='email'
                        required
                    />
                    <FormInput
                        name='password'
                        type='password'
                        value={this.state.password}
                        handleChange={this.handleChange}
                        label='password'
                        required
                    />
                    <div className='buttons'>
                        <CustomButton type='submit'> Sign in </CustomButton>
                        <CustomButton isGoogleSignIn onClick={signInWithGoogle}>Google Sign In</CustomButton>
                    </div>
                </form>
            </div>
        );
    }
}

export default SignIn;