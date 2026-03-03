import { supabase } from "@/integrations/supabase/client";
import type { Report } from "@/types";

export async function createReport(
  reporterId: string,
  listingId: string,
  reason: string
): Promise<{ data: Report | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .insert({
        reporter_id: reporterId,
        listing_id: listingId,
        reason: reason,
      })
      .select()
      .single();

    if (error) throw error;
    return { data: data as Report, error: null };
  } catch (error) {
    console.error("Error creating report:", error);
    return { data: null, error: error as Error };
  }
}

export async function getReports(): Promise<{
  data: Report[];
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: (data || []) as Report[], error: null };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { data: [], error: error as Error };
  }
}