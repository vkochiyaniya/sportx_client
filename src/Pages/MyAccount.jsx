// src/Pages/MyAccount.jsx
import React, { useState, useEffect } from 'react'; // Added useState import
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, updateUserProfile } from '../redux/AuthReducer/action.js';
import { FormControl, FormLabel, Input, Button, Stack } from '@chakra-ui/react';

const MyAccount = () => {
  const dispatch = useDispatch();
  const { user, userId } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (userId && !user) {
      dispatch(loadUser(userId));
    }
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [userId, user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(userId, formData)).unwrap();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <Stack spacing={4}>
      <h1>My Account</h1>
      {user && (
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </FormControl>

          <Button type="submit" mt={4}>
            Update Profile
          </Button>
        </form>
      )}
    </Stack>
  );
};

export default MyAccount;