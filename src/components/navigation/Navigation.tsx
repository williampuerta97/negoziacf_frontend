import '../../styles/navigation.css';
import { BrowserRouter as Router, Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Button, Space } from 'antd';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import useAuthContext from '../../context/useAuth';
import { EditUserPage } from '../../pages/EditUserPage';

const Nav = () => {
    const navigation = useNavigate();
    const { isAuthenticated, user, _logout } = useAuthContext();
    const LOGO = '/src/assets/nlogo.png';

    return (
        <nav className='nav_container'>
            <Link to="/" className='nav_container-logo' >
                <img src={LOGO} alt='logo' />
                <span className='nav_container-title'>
                    Negozia CF | Prueba
                </span>
            </Link>
            {isAuthenticated ? (
                <Space>
                    <div className='nav_container-user'>
                        <span className='nav_container-user-name'>
                            {user?.name} {user?.lastName}
                        </span>
                    </div>
                    <Button type='primary' danger onClick={() => {_logout(); navigation('/')}}>
                        <Space>
                            Logout
                            <LogoutOutlined />
                        </Space>
                    </Button>
                </Space>
            ) : (
                <Link to="/login">
                    <span className='nav_container-login'>
                        <Space>
                            Sign In
                            <LoginOutlined />
                        </Space>
                    </span>
                </Link>
            )}
        </nav>
    );
}

const Navigation = () => {
    return (
        <Router>
            <Nav />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="edit/:id" element={<EditUserPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to={'/'} />} />
            </Routes>
        </Router>
    );
}

export default Navigation;