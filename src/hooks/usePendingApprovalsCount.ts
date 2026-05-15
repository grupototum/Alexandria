import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePendingApprovalsCount() {
  const [pendingApprovals, setPendingApprovals] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchPending = async () => {
      const { count } = await (supabase as any)
        .from("user_approvals")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

      if (mounted) {
        setPendingApprovals(count || 0);
      }
    };

    fetchPending();
    const intervalId = window.setInterval(fetchPending, 60000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return pendingApprovals;
}

export default usePendingApprovalsCount;
