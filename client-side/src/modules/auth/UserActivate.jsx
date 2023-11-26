import { useEffect } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { userVerify } from "@features/auth/authActions";
import { useDispatch } from "react-redux";

export default function UserActivate() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(userVerify({token}));
    navigate('/login');
  }, [token]);
  return <div></div>;
}
