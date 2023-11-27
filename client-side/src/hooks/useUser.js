import {useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function useUser() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (userInfo?.isAdmin) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  return [userInfo];
}
