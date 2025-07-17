import { supabase } from "../supabase/supabaseClient";

export async function getSongs() {
  const { data, error } = await supabase
    .from('songs')
    .select('*');

  if (error) {
    console.error('Error fetching songs:', error);
    return [];
  }

  return data;
}
