import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ListUsers } from "../components/ListUsers"
import useAuthContext from "../context/useAuth";
import checkToken from "../helpers/checkToken";

export const HomePage = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuthContext();

  const validateToken = async () => {
		const { valid, status, user } = await checkToken();
		console.log(valid, status, user);
		if (valid && status === 200 && user) {
			setIsAuthenticated(true);
			setUser(user);
			navigate('/');
		} else {
			setIsAuthenticated(false);
			setUser(null);
		}
		return;
	}

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <>
      <ListUsers />
    </>
  )
}
