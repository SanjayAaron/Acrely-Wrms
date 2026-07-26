import React, { useState, useEffect } from 'react';
import { StaffMember, StaffRole, StaffStatus, StaffPermissions } from '../../types';
import { PasswordInput } from './PasswordInput';
import { RoleSelector } from './RoleSelector';
import { PermissionMatrix, getDefaultPermissionsForRole } from './PermissionMatrix';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { User, Lock, ShieldCheck, Settings, Upload, CheckCircle2, Camera } from 'lucide-react';

interface StaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Partial<StaffMember>) => void;
  initialData?: StaffMember | null;
}

/**
 * Large Professional Modal Form for Creating/Editing Staff Accounts.
 * Features 4 structured sections:
 * Section 1: Personal Information
 * Section 2: Login Credentials
 * Section 3: Role & Permissions
 * Section 4: Account Settings
 */
export const StaffForm: React.FC<StaffFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  // Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Login Credentials
  const [username, setUsername] = useState('');
  const [emailLogin, setEmailLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Role & Permissions
  const [role, setRole] = useState<StaffRole>('Staff');
  const [permissions, setPermissions] = useState<StaffPermissions>(() =>
    getDefaultPermissionsForRole('Staff')
  );

  // Account Settings
  const [status, setStatus] = useState<StaffStatus>('Active');
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [formError, setFormError] = useState('');

  // Populate data if editing an existing staff member
  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || '');
      setLastName(initialData.lastName || '');
      setPhone(initialData.phone || '');
      setWhatsappNumber(initialData.whatsappNumber || '');
      setEmail(initialData.email || '');
      setDateOfBirth(initialData.dateOfBirth || '');
      setGender(initialData.gender || 'Male');
      setAddress(initialData.address || '');
      setPhotoUrl(initialData.photoUrl || '');

      setUsername(initialData.username || '');
      setEmailLogin(initialData.emailLogin || initialData.email || '');
      setPassword(initialData.password || '');
      setConfirmPassword(initialData.password || '');

      setRole(initialData.role || 'Staff');
      setPermissions(
        initialData.permissions || getDefaultPermissionsForRole(initialData.role || 'Staff')
      );

      setStatus(initialData.status || 'Active');
      setForcePasswordChange(initialData.forcePasswordChange ?? true);
      setTwoFactorEnabled(initialData.twoFactorEnabled ?? false);
    } else {
      // Reset defaults for new staff creation
      setFirstName('');
      setLastName('');
      setPhone('');
      setWhatsappNumber('');
      setEmail('');
      setDateOfBirth('');
      setGender('Male');
      setAddress('');
      setPhotoUrl('');

      setUsername('');
      setEmailLogin('');
      setPassword('');
      setConfirmPassword('');

      setRole('Staff');
      setPermissions(getDefaultPermissionsForRole('Staff'));

      setStatus('Active');
      setForcePasswordChange(true);
      setTwoFactorEnabled(false);
    }
    setFormError('');
  }, [initialData, isOpen]);

  // When role changes, automatically pre-fill permission matrix
  const handleRoleChange = (newRole: StaffRole) => {
    setRole(newRole);
    setPermissions(getDefaultPermissionsForRole(newRole));
  };

  // Profile photo upload simulation / URL generator
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('Please provide First Name and Last Name.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Phone number is required.');
      return;
    }
    if (!email.trim()) {
      setFormError('Email address is required.');
      return;
    }
    if (!username.trim() || !emailLogin.trim()) {
      setFormError('Username and Login Email are required.');
      return;
    }
    if (!initialData && !password) {
      setFormError('Password is required for new accounts.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify both password fields.');
      return;
    }

    const payload: Partial<StaffMember> = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      firstName,
      lastName,
      phone,
      whatsappNumber,
      email,
      dateOfBirth,
      gender,
      address,
      photoUrl,
      username,
      emailLogin,
      password,
      role,
      permissions: role === 'Property Owner' ? getDefaultPermissionsForRole('Property Owner') : permissions,
      status,
      forcePasswordChange,
      twoFactorEnabled,
      lastLogin: initialData?.lastLogin || 'Never'
    };

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Staff Account' : 'Add Staff Account'}
      description="Create a new staff login and assign permissions."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-[10px] text-xs text-rose-700 font-semibold">
            {formError}
          </div>
        )}

        {/* Section 1: Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <User className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Section 1: Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Rahul"
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Sharma"
              required
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
            <Input
              label="WhatsApp Number"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!emailLogin) setEmailLogin(e.target.value);
              }}
              placeholder="rahul@acrely.com"
              required
            />
            <Input
              label="Date of Birth (Optional)"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
                { value: 'Prefer not to say', label: 'Prefer not to say' }
              ]}
            />
            <Input
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Plot 42, Logistics Park, Mumbai, MH"
            />
          </div>

          {/* Profile Photo Upload */}
          <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 border border-[#E5E7EB] overflow-hidden flex items-center justify-center shrink-0">
              {photoUrl ? (
                <img src={photoUrl} alt="Staff profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#111827] mb-0.5">
                Profile Photo Upload
              </label>
              <p className="text-[11px] text-gray-500">
                JPG, PNG or GIF. Maximum file size 2MB.
              </p>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-[8px] text-xs font-semibold text-[#111827] hover:bg-slate-100 cursor-pointer shadow-2xs">
              <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Login Credentials */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <Lock className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Section 2: Login Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rahul.sharma"
              required
            />
            <Input
              label="Email Login"
              type="email"
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value)}
              placeholder="rahul@acrely.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
              showStrengthMeter={true}
              required={!initialData}
              helperText="At least 8 characters with numbers and symbols recommended."
            />
            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              confirmValue={password}
              required={!initialData}
            />
          </div>
        </div>

        {/* Section 3: Role & Permissions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Section 3: Role & Permissions
            </h3>
          </div>

          <RoleSelector value={role} onChange={handleRoleChange} />

          <PermissionMatrix
            permissions={permissions}
            onChange={setPermissions}
            role={role}
          />
        </div>

        {/* Section 4: Account Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <Settings className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Section 4: Account Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Account Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StaffStatus)}
              options={[
                { value: 'Active', label: 'Active (Can login)' },
                { value: 'Inactive', label: 'Inactive (Disabled)' },
                { value: 'Suspended', label: 'Suspended' }
              ]}
            />

            <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] flex items-center gap-3">
              <input
                id="forcePasswordChange"
                type="checkbox"
                checked={forcePasswordChange}
                onChange={(e) => setForcePasswordChange(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
              />
              <label htmlFor="forcePasswordChange" className="text-xs cursor-pointer">
                <span className="font-semibold text-[#111827] block">Temporary Password</span>
                <span className="text-[10px] text-gray-500">Force password change on first login</span>
              </label>
            </div>

            <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-[10px] flex items-center gap-3 opacity-80">
              <input
                id="twoFactor"
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
              />
              <label htmlFor="twoFactor" className="text-xs cursor-pointer">
                <span className="font-semibold text-[#111827] flex items-center gap-1">
                  Two-factor authentication
                  <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-[#2563EB] rounded font-bold">Future</span>
                </span>
                <span className="text-[10px] text-gray-500">Enforce OTP login verification</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<CheckCircle2 className="w-4 h-4" />}>
            {initialData ? 'Save Staff Changes' : 'Create Staff Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
