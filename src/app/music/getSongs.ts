import { supabase } from "../supabase/supabaseClient";

interface Track {
  id: number;
  name: string;
  url: string;
  artist?: string;
  duration?: number;
  file_path?: string;
}

export async function getSongs(): Promise<Track[]> {
  try {
    
    const { data: dbSongs, error: dbError } = await supabase
      .from('songs')
      .select('*');

    if (!dbError && dbSongs && dbSongs.length > 0) {
      const tracks: Track[] = [];

      for (const song of dbSongs) {
        // Get public URL from storage using the filename
        const { data: urlData } = supabase.storage
          .from("songlist1")
          .getPublicUrl(song.filename);

        tracks.push({
          id: song.id,
          name: song.title || "Unknown Song",
          url: urlData.publicUrl,
          artist: "Unknown Artist", 
          duration: undefined, 
          file_path: song.filename,
        });
      }

      console.log(`Loaded ${tracks.length} tracks from database`);
      return tracks;
    }

    // If no songs in db, try to get from storage directly
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("songlist1")
      .list("", { limit: 100, offset: 0 });

    console.log("storageFiles:", storageFiles);
    console.log("storageError:", storageError);

    const { data, error } = await supabase.storage.from('songlist1').list('');
console.log('data:', data);
console.log('error:', error);

    if (storageError) {
      console.error('Error fetching from storage:', storageError);
      return [];
    }

    if (!storageFiles || storageFiles.length === 0) {
      console.log('No files found in storage');
      return [];
    }

    // Filter audio files and create track objects
    const audioFiles = storageFiles.filter(file => {
      if (!file.name) return false;
      const ext = file.name.toLowerCase().split('.').pop();
      return ext && ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(ext);
    });

    const tracks: Track[] = audioFiles.map((file, index) => {
      const { data: urlData } = supabase.storage
        .from('songlist1') //bucket name
        .getPublicUrl(file.name);

      const displayName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      return {
        id: index,
        name: displayName,
        url: urlData.publicUrl,
        artist: 'Unknown Artist',
        file_path: file.name,
        duration: undefined,
      };
    });

    console.log(`Loaded ${tracks.length} tracks from storage`);
    return tracks;

  } catch (error) {
    console.error('Error in getSongs:', error);
    return [];
  }
}

// Alternative function
export async function getSongsFromBucket(bucketName: string): Promise<Track[]> {
  try {
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 100,
        offset: 0,
      });

    if (storageError) {
      console.error(`Error fetching from ${bucketName}:`, storageError);
      return [];
    }

    if (!storageFiles || storageFiles.length === 0) {
      console.log(`No files found in ${bucketName}`);
      return [];
    }

    const audioFiles = storageFiles.filter(file => {
      if (!file.name) return false;
      const ext = file.name.toLowerCase().split('.').pop();
      return ext && ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(ext);
    });

    const tracks: Track[] = audioFiles.map((file, index) => {
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(file.name);

      const displayName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      return {
        id: index,
        name: displayName,
        url: urlData.publicUrl,
        artist: 'Unknown Artist',
        file_path: file.name,
        duration: undefined,
      };
    });

    return tracks;
  } catch (error) {
    console.error(`Error getting songs from ${bucketName}:`, error);
    return [];
  }
}