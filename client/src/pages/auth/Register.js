import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function Register({ history }) {
    const [email, setEmail] = useState('');
    const { user } = useSelector(state => ({ ...state }));

    useEffect(() => {
        if (user && user.token) history.push("/");
    }, [user, history])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            toast.error('Please provide valid email');
            return;
        }

        try {
            // console.log(process.env.REGISTER_REDIRECT_URL);
            const config = {
                url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
                handleCodeInApp: true
            }

            await auth.sendSignInLinkToEmail(email, config);

            toast.success(`Email is sent to ${email}. Click the link to complete your registration`);

            window.localStorage.setItem('emailForRegistration', email);

            setEmail('');
        } catch (err) {
            // console.log(err.message);
            toast.error(err.message);
        }
    }

    return (
        <div className="container p-5 text-center">
            <div className="row">
                <div className="form-custom-css col-md-6 offset-md-3">
                    <h2 className="mb-4">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                            autoFocus
                        />
                        <button type="submit" className="mt-3 btn btn-raised">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
