
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FormData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Notifications {
  [key: string]: boolean;
  email: boolean;
  push: boolean;
  marketing: boolean;
}

interface AccountState {
  activeTab: string;
  profileUrl: string | null;
  formData: FormData;
  passwordData: PasswordData;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  deleteConfirm: string;
  theme: string;
  notifications: Notifications;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AccountState = {
    activeTab: 'profile',
    profileUrl: null,
    formData: {
      name: '',
      email: ''
    },
    passwordData: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    deleteConfirm: '',
    theme: 'dark',
    notifications: {
      email: true,
      push: false,
      marketing: false
    },
    isLoading: false,
    error: null,
    successMessage: null
  };

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setProfileUrl: (state, action: PayloadAction<string | null>) => {
      state.profileUrl = action.payload;
    },
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setPasswordData: (state, action: PayloadAction<Partial<PasswordData>>) => {
      state.passwordData = { ...state.passwordData, ...action.payload };
    },
    togglePasswordVisibility: (state, action: PayloadAction<string>) => {
      const field = action.payload as keyof AccountState;
      if (typeof state[field] === 'boolean') {
        state[field] = !state[field];
      }
    },
    setDeleteConfirm: (state, action: PayloadAction<string>) => {
      state.deleteConfirm = action.payload;
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    toggleNotification: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      state.notifications[key] = !state.notifications[key];
    },
    clearPasswordData: (state) => {
      state.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    initializeUserData: (state, action: PayloadAction<{ profileImage?: string | null; name?: string; email?: string }>) => {
      state.profileUrl = action.payload.profileImage || null;
      state.formData.name = action.payload.name || '';
      state.formData.email = action.payload.email || '';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    }
  }
});

export const {
  setActiveTab,
  setProfileUrl,
  setFormData,
  setPasswordData,
  togglePasswordVisibility,
  setDeleteConfirm,
  setTheme,
  toggleNotification,
  clearPasswordData,
  clearError,
  clearSuccessMessage,
  initializeUserData,
  setLoading,
  setError,
  setSuccessMessage
} = accountSlice.actions;


// Regular async functions
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload/profile', {
    method: 'POST',
    body: formData,
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Upload failed');
  }
  
  // Update user profile with new image URL
  const updateResponse = await fetch('/api/user/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileUrl: result.url })
  });
  
  if (!updateResponse.ok) {
    throw new Error('Failed to update profile');
  }
  
  return result.url;
};

export const updateProfile = async (profileData) => {
  const response = await fetch('/api/user/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Update failed');
  }
  
  return profileData;
};

export const changePassword = async (passwordData) => {
  const response = await fetch('/api/user/password', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Password change failed');
  }
  
  return true;
};

export const deleteAccount = async () => {
  const response = await fetch('/api/user/delete', {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || 'Account deletion failed');
  }
  
  return true;
};

export default accountSlice.reducer;
