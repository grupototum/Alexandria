import React, { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

export function useAdminRoles() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      const userMap = new Map<string, string[]>();
      rolesData?.forEach((r: { user_id: string; role: string }) => {
        const existing = userMap.get(r.user_id) || [];
        existing.push(r.role);
        userMap.set(r.user_id, existing);
      });

      const userList: UserWithRoles[] = Array.from(userMap.entries()).map(
        ([id, roles]) => ({
          id,
          email: "",
          created_at: "",
          roles,
        })
      );

      setUsers(userList);
    } catch (err: unknown) {
      toast.error("Erro ao carregar usuários: " + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addRole = useCallback(async (userId: string, role: string) => {
    setActionLoading(`${userId}-add-${role}`);
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role as 'admin' | 'moderator' | 'user' });
      if (error) throw error;
      toast.success(`Role "${role}" adicionada com sucesso.`);
      await fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setActionLoading(null);
    }
  }, [fetchUsers]);

  const removeRole = useCallback(async (userId: string, role: string) => {
    setActionLoading(`${userId}-rm-${role}`);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as 'admin' | 'moderator' | 'user');
      if (error) throw error;
      toast.success(`Role "${role}" removida.`);
      await fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setActionLoading(null);
    }
  }, [fetchUsers]);

  return React.useMemo(() => ({
    users,
    loading,
    actionLoading,
    fetchUsers,
    addRole,
    removeRole
  }), [users, loading, actionLoading, fetchUsers, addRole, removeRole]);
}
