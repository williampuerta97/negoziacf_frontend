import '../styles/login_page.css';
import { useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import useAuthContext from "../context/useAuth";
import { Input, notification, Space } from 'antd';
import { useEffect } from 'react';
import checkToken from '../helpers/checkToken';
// LOGIN
export const LoginPage = () => {
	const navigate = useNavigate();
	const { _login, setIsAuthenticated, setUser } = useAuthContext();
	const { register, handleSubmit, setValue, formState: { errors } } = useForm();

	const handleLogin = async (data: any) => {
		const { username, password } = data;
		_login(username, password).then(({ data, status }) => {
			if (status === 200 && data.ok) {
				return navigate('/');
			}else if(status === 400 && !data.ok){
				notification.open({
					message: 'Error',
					description: 'Usuario o contraseña incorrectos',
					duration: 2,
				})
				return;
			}
		}).catch ((err) => {
			if (err.response.status === 400 && err.response.data.message) {
				notification.open({
					message: 'Error',
					description: err.response.data.message,
					duration: 2,
				})
			} else {
				notification.open({
					message: 'Error',
					description: 'Ha ocurrido un error al iniciar sesión',
					duration: 2,
				})
			}
		});
}

const validateToken = async () => {
	const { valid, status, user } = await checkToken();
	if (valid && status === 200 && user) {
		setIsAuthenticated(true);
		setUser(user);
		navigate('/');
	} else {
		console.log('No hay token');
		setIsAuthenticated(false);
		setUser(null);
		navigate('/login');
		return;
	}
	return;
}

useEffect(() => {
	validateToken();
	register('username', { required: true });
	register('password', { required: true });
}, []);

return (
	<div className="form_container">
		<h1>Sign In</h1>
		<form onSubmit={handleSubmit((data) => handleLogin(data))}>
			<Space direction='vertical'>
				<label>
					Username:
					<Input type="text" placeholder="E-mail or Username" onChange={e => setValue('username', e.target.value)} />
				</label>
				{errors.username && <p className='text-error'>El usuario es requerido</p>}
				<label>
					Password:
					<Input.Password type="text" placeholder="***********" onChange={e => setValue('password', e.target.value)} />
				</label>
				{errors.password && <p className='text-error'>No se ha introducido una contraseña</p>}
				<Input className='form_container-button' type="submit" value="Login" />
			</Space>
		</form>
	</div>
)
}
