import { useState } from 'react';
import { Users, Plus, Trash2, Loader2, Lock, AlertCircle } from 'lucide-react';
import { getUsers, createUser, updateUserStatus, deleteUser } from '../../api/systemSettings';
import { toast } from 'sonner';

type Role = 'admin' | 'sales' | 'warehouse' | 'finance';

interface SystemUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  createdAt: string;
}

export function UserManagementTab() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'admin' as Role,
  });
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteForm.email || !inviteForm.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const newUser = await createUser({
        email: inviteForm.email,
        name: inviteForm.name,
        role: inviteForm.role,
        status: 'active',
      });
      setUsers([...users, newUser]);
      setShowInviteModal(false);
      setInviteForm({ email: '', name: '', role: 'admin' });
      toast.success('User invited successfully');
    } catch (error) {
      toast.error('Failed to invite user');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: 'active' | 'suspended' | 'pending') => {
    // Only allow toggling between active and suspended
    if (currentStatus === 'pending') {
      toast.error('Cannot toggle status for pending users');
      return;
    }
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Load users on mount
  useState(() => {
    loadUsers();
  });

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">User Management</h3>
              <p className="text-sm text-white/60">Manage organization users and roles</p>
            </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white font-semibold transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Invite User
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="glass-card rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-white/60 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-white/70 text-sm capitalize">{user.role}</p>
                    <p className={`text-xs ${user.status === 'active' ? 'text-green-400' : user.status === 'suspended' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {user.status}
                    </p>
                  </div>
                  <div className="text-right text-sm text-white/60">
                    <p>Last login: {user.lastLogin}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className="p-2 text-white/60 hover:text-white transition"
                      title={user.status === 'active' ? 'Suspend' : 'Activate'}
                    >
                      {user.status === 'active' ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Roles Section - Coming Soon */}
      <div className="glass-card rounded-xl p-6 opacity-50 pointer-events-none">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Custom Roles</h3>
            <p className="text-sm text-white/60">Create custom roles with granular permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">Coming Soon - Custom role creation will be available in a future update</p>
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Invite New User</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Name *</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Email *</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Role *</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as Role })}
                  className="w-full px-4 py-2 glass-input text-white rounded-lg"
                >
                  <option value="admin" className="bg-gray-800">Administrator</option>
                  <option value="sales" className="bg-gray-800">Sales</option>
                  <option value="warehouse" className="bg-gray-800">Warehouse</option>
                  <option value="finance" className="bg-gray-800">Finance</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteForm({ email: '', name: '', role: 'admin' });
                }}
                className="px-4 py-2 text-white/70 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteUser}
                disabled={saving}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Invite'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
