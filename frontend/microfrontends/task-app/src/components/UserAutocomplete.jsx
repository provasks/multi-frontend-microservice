import React, { useState, useEffect, useRef } from 'react';
import { apiHelpers, hasCachedUsers, getCachedUsers } from 'sharedComponents/unifiedApiClient';
import { useDebounce } from '../hooks/useDebounce';
import './UserAutocomplete.css';

const UserAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Select user...", 
  className = "",
  disabled = false 
}) => {
  // Initialize with cached data if available
  const initialCachedData = getCachedUsers();
  const initialUsers = initialCachedData ? (initialCachedData.users || initialCachedData || []) : [];
  
  
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(!initialCachedData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSettingValue, setIsSettingValue] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const usersFetchedRef = useRef(false);

  // Debounce search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch users on component mount (only once)
  useEffect(() => {
    const fetchUsers = async () => {
      // Don't fetch if users have already been fetched
      if (usersFetchedRef.current) {
        return;
      }
      
      // If we already have cached data from initialization, we're done
      if (initialCachedData) {
        usersFetchedRef.current = true;
        return;
      }
      
      try {
        // Fetch fresh data if no cache
        const response = await apiHelpers.fetchUsers();
        const usersList = response.users || response || [];
        
        setUsers(usersList);
        setFilteredUsers(usersList);
        setLoading(false);
        usersFetchedRef.current = true;
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [initialCachedData]);

  // Find selected user when value changes or users are loaded
  useEffect(() => {
    setIsSettingValue(true); // Prevent onChange from being triggered
    
    if (value && users.length > 0) {
      const user = users.find(u => u._id === value);
      setSelectedUser(user);
      if (user) {
        const displayName = `${user.firstName} ${user.lastName}`.trim() || user.username;
        setSearchTerm(displayName);
      } else {
        // If user not found, show the user ID as fallback
        setSearchTerm(`User ID: ${value}`);
        setSelectedUser({ _id: value, username: `User ID: ${value}` });
      }
    } else if (!value) {
      // Clear selection when no value
      setSelectedUser(null);
      setSearchTerm('');
    }
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setIsSettingValue(false);
    }, 100);
  }, [value, users]);

  // Handle initial value when component mounts with cached data
  useEffect(() => {
    if (value && initialUsers.length > 0 && !selectedUser) {
      const user = initialUsers.find(u => u._id === value);
      if (user) {
        const displayName = `${user.firstName} ${user.lastName}`.trim() || user.username;
        setSearchTerm(displayName);
        setSelectedUser(user);
      } else {
      }
    }
  }, [value, initialUsers, selectedUser]);

  // Filter users based on debounced search term
  useEffect(() => {
    // Skip filtering if we're in selection mode (showing a selected user)
    if (selectedUser && !isOpen) {
      return;
    }
    
    setIsFiltering(true);
    
    if (!debouncedSearchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.trim().toLowerCase();
        const username = user.username.toLowerCase();
        const email = user.email.toLowerCase();
        const search = debouncedSearchTerm.toLowerCase();
        
        return fullName.includes(search) || 
               username.includes(search) || 
               email.includes(search);
      });
      setFilteredUsers(filtered);
    }
    
    // Reset filtering state after a short delay
    const timer = setTimeout(() => setIsFiltering(false), 100);
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, users, selectedUser, isOpen]);

  const handleInputChange = (e) => {
    // Don't process input changes when we're programmatically setting the value
    if (isSettingValue) {
      return;
    }
    
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);
    
    // If user clears the input, clear the selection
    if (!newSearchTerm.trim()) {
      setSelectedUser(null);
      // Only call onChange if we actually had a selection before
      if (selectedUser) {
        onChange('');
      }
    }
  };


  const handleUserSelect = (user) => {
    setSelectedUser(user);
    const displayName = `${user.firstName} ${user.lastName}`.trim() || user.username;
    setSearchTerm(displayName);
    setIsOpen(false);
    onChange(user._id);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = (e) => {
    // Delay closing to allow click on dropdown items
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setSearchTerm('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`user-autocomplete ${className}`} ref={dropdownRef}>
      <div className="input-group">
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
        {isFiltering && (
          <span className="input-group-text">
            <i className="fas fa-spinner fa-spin text-muted"></i>
          </span>
        )}
      </div>
      
      {isOpen && (
        <div className="autocomplete-dropdown">
          {loading ? (
            <div className="dropdown-item text-center">
              <i className="fas fa-spinner fa-spin me-2"></i>
              Loading users...
            </div>
          ) : isFiltering ? (
            <div className="dropdown-item text-center">
              <i className="fas fa-spinner fa-spin me-2"></i>
              Searching...
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className={`dropdown-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUserSelect(user);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUserSelect(user);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUserSelect(user);
                }}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div className="user-info">
                  <div className="user-name">
                    {`${user.firstName} ${user.lastName}`.trim() || user.username}
                  </div>
                  <div className="user-details">
                    <span className="username">@{user.username}</span>
                    <span className="email">{user.email}</span>
                  </div>
                </div>
                <div className="user-role">
                  <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 
                                   user.role === 'moderator' ? 'bg-warning text-dark' : 
                                   'bg-secondary'}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="dropdown-item text-muted">
              <i className="fas fa-search me-2"></i>
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAutocomplete;
