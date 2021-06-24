import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function ForgotPassword({ history }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useSelector(state => ({ ...state }));

    useEffect(() => {
        if (user && user.token) history.push("/");
    }, [user, history])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !email.includes('@')) {
            toast.error('Please provide valid email');
            return;
        }

        const config = {
            url: process.env.REACT_APP_REGISTER_FORGOT_PASSWORD_REDIRECT,
            handleCodeInApp: true
        }

        await auth
            .sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail("");
                setLoading(false);
                toast.success("Check your email for password reset link");
            })
            .catch((err) => {
                // console.log(err.message);
                toast.error(err.message);
                setLoading(false);
            })

    }

    return (
        <div className="container p-5 text-center">
            <div className="row">
                <div className="form-custom-css col-md-6 offset-md-3">
                    {loading ? (
                        <h2 className="text-danger">Loading...</h2>
                    ) : (
                        <h2>Forgot Password</h2>
                    )}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                            autoFocus
                        />
                        <button type="submit" className="mt-3 btn btn-raised" disabled={!email}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
