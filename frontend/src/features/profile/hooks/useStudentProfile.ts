import { useState, useEffect } from 'react';
import { UserProfile } from '../../../types';
import { supabase } from '../../../services/supabase/supabaseClient';

export const useStudentProfile = (onLogout: () => void) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          setProfile(data);
          setFullName(data.full_name || "");
        } else {
          const placeholder: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || ''
          };
          setProfile(placeholder);
          setFullName(session.user.user_metadata?.full_name || "");
        }
      }
    } catch (err) {
      console.error("Error al obtener perfil", err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (newFullName: string) => {
    setSaving(true);
    setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Upsert the profile
        await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            full_name: newFullName,
            updated_at: new Date().toISOString()
          });
        
        // Update auth metadata
        await supabase.auth.updateUser({
          data: { full_name: newFullName }
        });
        
        setFullName(newFullName);
        setSuccess(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error guardando perfil:", err);
      alert("Hubo un error al guardar el perfil.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return {
    profile,
    fullName,
    setFullName,
    loading,
    saving,
    success,
    setSuccess,
    saveProfile,
    signOut: handleSignOut,
  };
};
export default useStudentProfile;
