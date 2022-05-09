import { ArrowLeftOutlined } from "@ant-design/icons";
import { Input, notification, Space } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useAuthContext from "../context/useAuth";
import checkToken from "../helpers/checkToken";
import { getUser, updateUser } from "../services";


export const EditUserPage = () => {
    const _id = useParams().id;
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useAuthContext();
    const { handleSubmit, register, formState: { errors }, setValue} = useForm();

    const handleEditSubmit = (data: any) => {
        updateUser(data, _id).then(({ data, status }) => {
            if(status === 201 && data.user) {
                notification.open({
                    message: 'Usuario actualizado',
                    description: 'El usuario ha sido actualizado correctamente',
                    duration: 2,
                })
                navigate('/');
            }
        }).catch((err) => {
            notification.open({
                message: 'Error',
                description: 'Ha ocurrido un error al actualizar el usuario',
                duration: 2,
            })
        });
    }

    const _getUser = () => {
        getUser(_id).then(({ data }) => {
            const fields = ['name', 'lastName', 'document_number', 'phone'];
            //@ts-ignore
            fields.forEach(field => setValue(field, data.user[field]));
        }).catch((err) => {
            notification.open({
                message: 'Error',
                description: 'Ha ocurrido un error al obtener el usuario',
                duration: 2,
            })
            navigate('/');
        });
    }

    const validateToken = async () => {
        const { valid, status, user } = await checkToken();
        if (valid && status === 200 && user) {
            setIsAuthenticated(true);
            setUser(user);
        } else {
            setIsAuthenticated(false);
            setUser(null);
            navigate('/login');
        }
        return;
    }


    useEffect(() => {
        validateToken();
        if(!_id) navigate('/');
        _getUser();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '90%' }}>
                <ArrowLeftOutlined style={{marginTop:30}} onClick={()=> navigate('/')}/>
                <h1 style={{ textAlign: 'center' }}>Edit User</h1>
                <form
                    onSubmit={handleSubmit(handleEditSubmit)}
                    style={{ display: 'flex', justifyContent: 'center' }}
                    name='createUserForm'
                >
                    <Space direction='vertical' style={{ width: '100%' }}>
                        <label>Nombres
                            <input className="ant-input" type="text" placeholder="Nombres" {...register('name', {required: true})} />
                        </label>
                        {errors?.name && <span className='text-error'>Nombres es requerido</span>}
                        <label>Apellidos
                            <input className="ant-input" type="text" placeholder="Apellidos" {...register('lastName', { required: true })} />
                        </label>
                        {errors?.lastName && <span className='text-error'>Apellidos es requerido</span>}
                        <label>Documento
                            <input className="ant-input" type="number" placeholder="Documento" {...register('document_number', { required: true, pattern: /^[0-9]*$/ })} />
                        </label>
                        {errors?.document_number?.type == 'required' && <span className='text-error'>Número de documento es requerido</span>}
                        {errors?.document_number?.type == 'pattern' && <span className='text-error'>Número de documento no es válido</span>}
                        <label>Teléfono
                            <input className="ant-input" type="tel" placeholder="Teléfono" {...register('phone', { required: true, pattern: /^[0-9]*$/ })} />
                        </label>
                        {errors?.phone?.type == 'required' && <span className='text-error'>Teléfono es requerido</span>}
                        {errors?.phone?.type == 'pattern' && <span className='text-error'>Teléfono no es válido</span>}
                        <Input type="submit" className='form_container-button' value='Actualizar' />
                    </Space>
                </form>
            </div>
        </div>
    )
}
