import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Users, Plus, X } from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthContext';
import { getSavedUsers, removeSavedUser } from '../../../utils/savedUsers';
export function UserMenu({
  mobile = false
}) {
  const navigate = useNavigate();
  const {
    user,
    signIn,
    signOut
  } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [switchUserOpen, setSwitchUserOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const savedUsers = getSavedUsers();
  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/login');
  };
  const handleSwitchUser = async (email, faydaId) => {
    setSwitching(true);
    void email;
    try {
      await signOut();
      if (faydaId) {
        const {
          error
        } = await signIn(faydaId, '');
        if (error) {
          console.error('Switch user error:', error);
          navigate('/login');
        } else {
          setSwitchUserOpen(false);
          setMenuOpen(false);
          navigate('/');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Switch user error:', error);
      navigate('/login');
    } finally {
      setSwitching(false);
    }
  };
  const handleRemoveUser = (email, e) => {
    e.stopPropagation();
    removeSavedUser(email);
    setSwitchUserOpen(false);
    setMenuOpen(false);
  };
  if (!user) return null;
  if (mobile) {
    return <div className="space-y-2"><button onClick={() => setSwitchUserOpen(true)} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all duration-200"><Users size={18} />Switch User</button><button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"><LogOut size={18} />Logout</button>{switchUserOpen && <><div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSwitchUserOpen(false)} /><div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="bg-neutral-50 rounded-2xl shadow-xl border border-neutral-200 max-w-md w-full max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"><div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50"><h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2"><Users size={24} className="text-blue-600" />Switch User</h2><button onClick={() => setSwitchUserOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><X size={20} /></button></div><div className="overflow-y-auto max-h-[60vh]">{savedUsers.length > 0 ? <div className="p-4 space-y-2">{savedUsers.map(savedUser => {
                  const isCurrentUser = savedUser.email === user?.email;
                  return <button onClick={() => !isCurrentUser && handleSwitchUser(savedUser.email, savedUser.faydaId)} disabled={isCurrentUser || switching} className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${isCurrentUser ? 'border-blue-200 bg-blue-50 cursor-default' : 'border-neutral-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer'} ${switching ? 'opacity-50 cursor-not-allowed' : ''}`} key={savedUser.email}><div className="flex items-start justify-between"><div className="flex-1"><div className="font-semibold text-neutral-800 flex items-center gap-2">{savedUser.name}{isCurrentUser && <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded-full">Current</span>}</div><div className="text-sm text-neutral-600 mt-1">{savedUser.faydaId ? `Fayda ID: ${savedUser.faydaId}` : savedUser.email}</div><div className="text-xs text-neutral-400 mt-1">Last login: {new Date(savedUser.lastLogin).toLocaleDateString()}</div></div>{!isCurrentUser && <button onClick={e => handleRemoveUser(savedUser.email, e)} className="p-2 hover:bg-red-100 rounded-lg text-neutral-400 hover:text-red-600 transition-colors" title="Remove user"><X size={16} /></button>}</div></button>;
                })}</div> : <div className="p-8 text-center text-neutral-500"><Users size={48} className="mx-auto mb-3 text-neutral-300" /><p>No saved users found</p></div>}<div className="p-4 border-t border-neutral-200 bg-neutral-50"><button onClick={() => {
                  setSwitchUserOpen(false);
                  navigate('/login');
                }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"><Plus size={20} />Add New User</button></div></div></div></div></>}</div>;
  }
  return <div className="relative"><button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all duration-300 hover:shadow-sm"><User size={16} /><span className="hidden sm:inline">Account</span></button>{menuOpen && <><div className="fixed inset-0 z-40" onClick={() => {
        setMenuOpen(false);
        setSwitchUserOpen(false);
      }} /><div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"><button onClick={() => setSwitchUserOpen(true)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-3 transition-colors"><Users size={16} />Switch User</button><div className="border-t border-neutral-200 my-1" /><button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"><LogOut size={16} />Logout</button></div></>}{switchUserOpen && <><div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSwitchUserOpen(false)} /><div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="bg-neutral-50 rounded-2xl shadow-xl border border-neutral-200 max-w-md w-full max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"><div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50"><h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2"><Users size={24} className="text-blue-600" />Switch User</h2><button onClick={() => setSwitchUserOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><X size={20} /></button></div><div className="overflow-y-auto max-h-[60vh]">{savedUsers.length > 0 ? <div className="p-4 space-y-2">{savedUsers.map(savedUser => {
                const isCurrentUser = savedUser.email === user?.email;
                return <button onClick={() => !isCurrentUser && handleSwitchUser(savedUser.email, savedUser.faydaId)} disabled={isCurrentUser || switching} className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${isCurrentUser ? 'border-blue-200 bg-blue-50 cursor-default' : 'border-neutral-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer'} ${switching ? 'opacity-50 cursor-not-allowed' : ''}`} key={savedUser.email}><div className="flex items-start justify-between"><div className="flex-1"><div className="font-semibold text-neutral-800 flex items-center gap-2">{savedUser.name}{isCurrentUser && <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded-full">Current</span>}</div><div className="text-sm text-neutral-600 mt-1">{savedUser.faydaId ? `Fayda ID: ${savedUser.faydaId}` : savedUser.email}</div><div className="text-xs text-neutral-400 mt-1">Last login: {new Date(savedUser.lastLogin).toLocaleDateString()}</div></div>{!isCurrentUser && <button onClick={e => handleRemoveUser(savedUser.email, e)} className="p-2 hover:bg-red-100 rounded-lg text-neutral-400 hover:text-red-600 transition-colors" title="Remove user"><X size={16} /></button>}</div></button>;
              })}</div> : <div className="p-8 text-center text-neutral-500"><Users size={48} className="mx-auto mb-3 text-neutral-300" /><p>No saved users found</p></div>}<div className="p-4 border-t border-neutral-200 bg-neutral-50"><button onClick={() => {
                setSwitchUserOpen(false);
                setMenuOpen(false);
                navigate('/login');
              }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"><Plus size={20} />Add New User</button></div></div></div></div></>}</div>;
}
