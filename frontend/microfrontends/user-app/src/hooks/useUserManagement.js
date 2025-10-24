import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from 'sharedComponents/useAuth';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('unknown');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'user',
    isActive: true
  });

  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setApiStatus('loading');
      
      if (!isAuthenticated()) {
        setApiStatus('error');
        setLoading(false);
        if (window.showError) {
          window.showError('Please log in to view users');
        }
        return;
      }

      const response = await makeAuthenticatedRequest('http://localhost:3001/api/users');
      
      if (response.ok) {
        const data = await response.json();
        const usersData = data.users || data || [];
        setUsers(Array.isArray(usersData) ? usersData : []);
        setApiStatus('connected');
      } else {
        setApiStatus('error');
        setUsers([]);
        if (window.showError) {
          window.showError('Failed to fetch users. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setApiStatus('error');
      setUsers([]);
      if (window.showError) {
        window.showError('Error fetching users. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest, isAuthenticated]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = useCallback(() => {
    setModalMode('add');
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'user',
      isActive: true
    });
    setShowModal(true);
  }, []);

  const handleEditUser = useCallback((user) => {
    setModalMode('edit');
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      password: '', // Don't pre-fill password
      role: user.role || 'user',
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setShowModal(true);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      if (!isAuthenticated()) {
        if (modalMode === 'add') {
          const newUser = {
            _id: Date.now().toString(),
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`,
            createdAt: new Date()
          };
          setUsers([...users, newUser]);
          if (window.showSuccess) {
            window.showSuccess('User created successfully (demo mode)!');
          }
        } else {
          setUsers(users.map(user => 
            user._id === editingUser._id 
              ? { ...user, ...formData, name: `${formData.firstName} ${formData.lastName}` }
              : user
          ));
          if (window.showSuccess) {
            window.showSuccess('User updated successfully (demo mode)!');
          }
        }
        setShowModal(false);
        return;
      }

      const url = modalMode === 'add' 
        ? 'http://localhost:3001/api/auth/register'
        : `http://localhost:3001/api/users/${editingUser._id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const response = await makeAuthenticatedRequest(url, {
        method,
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const result = await response.json();
        if (window.showSuccess) {
          window.showSuccess(modalMode === 'add' ? 'User created successfully!' : 'User updated successfully!');
        }
        fetchUsers();
        setShowModal(false);
      } else {
        const errorText = await response.text();
        console.error('Failed to save user:', response.status, errorText);
        if (window.showError) {
          window.showError(`Failed to save user: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }, [formData, modalMode, editingUser, fetchUsers, users, isAuthenticated, makeAuthenticatedRequest]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Memoized calculations
  const userStats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(user => user.isActive).length,
      inactive: users.filter(user => !user.isActive).length,
      admins: users.filter(user => user.role === 'admin').length,
      moderators: users.filter(user => user.role === 'moderator').length
    };
  }, [users]);

  return {
    // State
    users,
    loading,
    apiStatus,
    showModal,
    editingUser,
    modalMode,
    formData,
    userStats,
    
    // Actions
    fetchUsers,
    handleAddUser,
    handleEditUser,
    handleSubmit,
    handleInputChange,
    handleCloseModal
  };
};
