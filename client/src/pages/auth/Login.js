import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../functions/auth";

function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return
    } else {
      if (user && user.token) history.push("/");
    }

  }, [user, history]);

  const dispatch = useDispatch();

  const roleBasedRedirect = (res) => {
    // check if intended
    let intended = history.location.state;

    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !email.includes("@")) {
      toast.error("Email and Password is required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 character long");
      return;
    }

    try {
      const result = await auth.signInWithEmailAndPassword(email, password);

      const { user } = result;

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
          roleBasedRedirect(res);
        })
        .catch(err => { });

      setLoading(false);
      //   history.push("/");
    } catch (err) {
      // console.log(err.message);
      toast.error(err.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await auth.signInWithPopup(googleAuthProvider);

      const { user } = result;

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
          roleBasedRedirect(res);
        })
        .catch(err => { });

      //   history.push("/");
    } catch (err) {
      // console.log(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="container p-5 text-center">
      <div className="row">
        <div className="form-custom-css col-md-6 offset-md-3">
          {loading ? (
            <h2 className="text-danger">Loading...</h2>
          ) : (
            <h2 className="mb-4">Login</h2>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoFocus
            />

            <br />

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />

            <br />

            <Button
              onClick={handleSubmit}
              type="primary"
              className="mt-3"
              block
              icon={<MailOutlined />}
              size="large"
              disabled={!email || password.length < 6}
            >
              Login with Email
            </Button>
            <Button
              onClick={googleLogin}
              type="danger"
              className="mt-3"
              block
              icon={<GoogleOutlined />}
              size="large"
            >
              Login with Google
            </Button>

            <Link
              to="/forgot/password"
              className="mt-3 float-end text-dark"
              style={{ fontSize: "1.2em" }}
            >
              Forgot Password?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
