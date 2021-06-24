import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

function RegisterComplete({ history }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const { user } = useSelector(state => ({ ...state }));

    const dispatch = useDispatch();
    // useEffect(() => {
    //     if (user && user.token) history.push("/");
    // }, [user, history])

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'));
    }, [history])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !email.includes('@')) {
            toast.error('Email and Password is required');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 character long');
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(
                email,
                window.location.href
            )

            if (result.user.emailVerified) {
                // remove user email from local storage
                window.localStorage.removeItem('emailForRegistration');

                // get user id token
                let user = auth.currentUser;

                await user.updatePassword(password);

                const idTokenResult = await user.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: "LOGGED_IN_USER",
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            },
                        });
                    })
                    .catch(err => { });

                history.push('/');
            }

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
                            disabled
                        />

                        <br />

                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="password"
                            autoFocus
                        />

                        <br />

                        <button type="submit" className="mt-3 btn btn-raised">Complete Registration</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterComplete;
