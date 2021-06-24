import React, { useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AdminNav from "../../components/nav/AdminNav";

const Password = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector(state => ({ ...state }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(false);
        setPassword("")
        toast.success("Password updated")
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  const passwordUpdateForm = () =>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter new Password"
          value={password}
          disabled={loading}
        />
        <br />
        <button className="btn btn-primary" disabled={!password || password.length < 6 || loading}> Submit</button>
      </div>
    </form>
  return (
    <div className="container-fluid">
      <div className="row">
        {user.role === "admin" ? (
          <div className="col-md-2">
            <AdminNav />
          </div>
        ) : (
          <div className="col-md-2">
            <UserNav />
          </div>
        )}
        <div className="col">
          {loading ? (<h4 className="text-danger">loading...</h4>)
            : (<h4 className="mt-4 mb-4">Password Update</h4>
            )}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
