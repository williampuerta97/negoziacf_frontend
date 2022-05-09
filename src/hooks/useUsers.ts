import { useState, useEffect } from 'react';
import { IUser } from '../interfaces';
import { getUsers } from '../services/user.service';

export const useUsers = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchUsers = () => {
        setLoading(true);
        getUsers().then(({data}) => {
        setUsers(data.users);
        setLoading(false);
        }).catch(() => {
            setLoading(false);
            setError('Error fetching users');
        });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers
    }
}
