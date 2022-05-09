import '../styles/login_page.css';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Skeleton, Space, Table, notification, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuthContext from '../context/useAuth';
import { useUsers } from '../hooks/useUsers'
import { IUser } from '../interfaces';
import { createUser, deleteUser } from '../services';
import { Link } from 'react-router-dom';

export const ListUsers = () => {
    const { Option } = Select;
    const { register, setValue, formState: { errors }, handleSubmit, reset } = useForm();
    const { confirm } = Modal;
    const { isAuthenticated, user } = useAuthContext();
    const { users, loading, error, fetchUsers } = useUsers();
    const [visibleCM, setVisibleCM] = useState(false);
    const columns: any = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Apellido',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Número de documento',
            dataIndex: 'document_number',
            key: 'document_number',
        },
        {
            title: 'Teléfono',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Rol',
            dataIndex: 'rol',
            key: 'rol',
        }
    ];

    if (isAuthenticated && user?.rol === 'ADMIN') {
        columns.push({
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: IUser) => (
                <Space size="middle">
                    <Link className='ant-btn ant-btn-primary' to={`/edit/${record._id}`}>Editar <EditOutlined /></Link>
                    <Button type='primary' danger onClick={() => showPromiseConfirm(record)}>Eliminar <DeleteOutlined /></Button>
                </Space>
            ),
        })
    }

    const handleCreateSubmit = (data: any) => {
        createUser(data).then((res) => {
            setVisibleCM(false);
            notification.open({
                message: 'Usuario creado',
                description: 'El usuario ha sido creado correctamente',
                duration: 2,
            })
            fetchUsers();
        }).catch(({ response }) => {
            notification.open({
                message: 'Error',
                description: response.data.message,
                duration: 2,
            })
            setVisibleCM(false);
        });
    }

    const handleDelete = (id?: string) => {
        if (!id) return;
        deleteUser(id).then(({ data, status }) => {
            if (status === 201 && data.user) {
                notification.open({
                    message: 'Usuario eliminado',
                    description: 'El usuario ha sido eliminado correctamente',
                    duration: 2,
                });
                fetchUsers();
            }
        }).catch(({ response }) => {
            notification.open({
                message: 'Error',
                description: 'Ha ocurrido un error al eliminar el usuario',
                duration: 2,
            })
        });
    }

    useEffect(() => {
        register('password', { required: true });
        register('rol', { required: true });
    }, [])

    useEffect(()=> {
        if(visibleCM) {
            reset();
        }
    }, [visibleCM])

    const showPromiseConfirm = (user: IUser) => {
        confirm({
            title: 'Eliminar usuario',
            icon: <ExclamationCircleOutlined />,
            content: `¿Desea elminar el usuario ${user?.name} ${user?.lastName}?`,
            onOk() { handleDelete(user._id) },
            onCancel() { },
        });
    }


    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {loading ? (
                    <Skeleton />
                ) : (
                    <div style={{ width: '90%' }}>
                        <h1 style={{ marginTop: 20 }}>Listado de usuarios</h1>
                        {(isAuthenticated && user?.rol == "ADMIN") && (
                            <Button
                                type='primary'
                                style={{ marginBottom: '10px' }}
                                onClick={() => setVisibleCM(true)}
                            >
                                Nuevo usuario
                                <PlusCircleOutlined />
                            </Button>
                        )}
                        {error && <h4 style={{ color: 'red' }}>{error}</h4>}
                        <Table columns={columns} dataSource={users} key={Math.random()} scroll={{ x: true }} rowKey="_id" />
                    </div>
                )}
            </div>

            <Modal
                title="Crear usuario"
                visible={visibleCM}
                okText='Crear'
                onCancel={() => setVisibleCM(false)}
                width={'40%'}
                footer={(<></>)}
            >
                <form
                    onSubmit={handleSubmit(handleCreateSubmit)}
                    style={{ display: 'flex', justifyContent: 'center' }}
                    name='createUserForm'
                >
                    <Space direction='vertical' style={{ width: '100%' }}>
                        {/* NAME */}
                        <label>Nombres (*)
                            <input className='ant-input' type="text" placeholder="Nombres" {...register('name', { required: true })} />
                        </label>
                        {errors?.name && <span className='text-error'>Nombres es requerido</span>}
                        {/* LASTNAME */}
                        <label>Apellidos (*)
                            <input className='ant-input' type="text" placeholder="Apellidos" {...register('lastName', { required: true })} />
                        </label>
                        {errors?.lastName && <span className='text-error'>Apellidos es requerido</span>}
                        {/* DOCUMENT */}
                        <label>Documento (*)
                            <input className='ant-input' type="number" placeholder="Documento" {...register('document_number', { required: true, pattern: /^[0-9]*$/ })} />
                        </label>
                        {errors?.document_number?.type == 'required' && <span className='text-error'>Número de documento es requerido</span>}
                        {errors?.document_number?.type == 'pattern' && <span className='text-error'>Número de documento no es válido</span>}
                        {/* PHONE */}
                        <label>Teléfono (*)
                            <input className='ant-input' type="number" placeholder="Teléfono" {...register('phone', { required: true, pattern: /^[0-9]*$/ })} />
                        </label>
                        {errors?.phone?.type == 'required' && <span className='text-error'>Teléfono es requerido</span>}
                        {errors?.phone?.type == 'pattern' && <span className='text-error'>Teléfono no es válido</span>}
                        {/* EMAIL */}
                        <label>Correo electrónico (*)
                            <input className='ant-input' type="email" placeholder="Correo electrónico" {...register('email', { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i })} />
                        </label>
                        {errors?.email?.type == 'required' && <span className='text-error'>Correo electrónico es requerido</span>}
                        {errors?.email?.type == 'pattern' && <span className='text-error'>Correo electrónico no es válido</span>}
                        {/* USERNAME */}
                        <label>Nombre de usuario (*)
                            <input className='ant-input' type="text" placeholder="Nombre de usuario" {...register('username', { required: true })} />
                        </label>
                        {errors?.username && <span className='text-error'>Nombre de usuario es requerido</span>}
                        {/* PASSWORD */}
                        <label>Contraseña (*)
                            <Input.Password type="password" placeholder="Contraseña" onChange={e => setValue('password', e.target.value)} autoComplete='none'/>
                        </label>
                        {errors?.password && <span className='text-error'>Contraseña es requerido</span>}
                        {/* ROL */}
                        <label>Rol (*)
                            <Select defaultValue="GUEST" style={{ width: '100%' }} onChange={value => setValue('rol', value)}>
                                <Option value="GUEST">Invitado</Option>
                                <Option value="ADMIN">Administrador</Option>
                            </Select>
                        </label>
                        {errors?.password && <span className='text-error'>Rol es requerido</span>}
                        <Input type="submit" className='form_container-button' value='Crear' />
                    </Space>
                </form>
            </Modal>
        </>
    )
}
