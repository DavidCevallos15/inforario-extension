import React, { useState } from 'react';
import { User, LogOut, Save, Camera, Loader2, ArrowLeft } from 'lucide-react';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface ProfileFormProps {
  onBack: () => void;
  onLogout: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onBack, onLogout }) => {
  const {
    profile,
    fullName,
    setFullName,
    loading,
    saving,
    success,
    setSuccess,
    saveProfile,
    signOut,
  } = useStudentProfile(onLogout);

  const [inputName, setInputName] = useState(fullName);

  // Sync state once profile is loaded
  React.useEffect(() => {
    if (fullName) {
      setInputName(fullName);
    }
  }, [fullName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile(inputName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 relative z-10">
      <div className="flex items-center gap-4 mb-8 text-left">
        <button 
          onClick={onBack} 
          className="text-on-surface-variant hover:text-primary font-bold text-sm transition-colors flex items-center gap-1.5"
          id="profile-back-btn"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
        <h1 className="text-3xl font-black text-on-surface tracking-tight">Mi Perfil</h1>
      </div>

      <Card className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/15">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <div className="relative w-32 h-32 bg-primary-fixed/20 text-on-primary-fixed-variant rounded-full flex items-center justify-center text-on-primary-container group overflow-hidden border border-outline-variant/10 shadow-sm">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black uppercase text-primary">
                  {inputName.charAt(0) || profile?.email?.charAt(0) || '?'}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant text-center max-w-[150px] uppercase tracking-wider">
              Avatar UTM
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-grow w-full space-y-6 text-left">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Correo Electrónico</label>
              <input 
                type="text" 
                disabled 
                value={profile?.email || ''} 
                className="w-full px-4 py-3 bg-surface-container/50 rounded-xl text-on-surface-variant border border-outline-variant/15 cursor-not-allowed font-medium"
              />
              <p className="text-xs text-on-surface-variant font-medium">El correo está vinculado a tu cuenta institucional de la UTM.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                <input 
                  type="text" 
                  value={inputName}
                  onChange={(e) => {
                    setSuccess(false);
                    setInputName(e.target.value);
                  }}
                  id="profile-fullname-input"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface font-bold"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <p className="text-xs text-on-surface-variant font-medium">Este nombre aparecerá en los reportes o calendarios exportados.</p>
            </div>

            {success && (
              <div className="p-3 bg-primary-fixed/30 text-on-primary-fixed-variant border border-primary/20 rounded-xl text-sm font-bold animate-pulse">
                Perfil actualizado exitosamente.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-outline-variant/15">
              <Button 
                type="submit" 
                isLoading={saving}
                variant="primary"
                id="profile-save-btn"
                className="flex-1 py-3 text-sm font-bold shadow-editorial"
              >
                Guardar Cambios
              </Button>
              
              <button 
                type="button" 
                onClick={signOut}
                id="profile-logout-btn"
                className="flex-1 bg-error-container text-error hover:bg-error/15 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors duration-200 text-sm"
              >
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
            
          </form>
        </div>
      </Card>
    </div>
  );
};
export default ProfileForm;
