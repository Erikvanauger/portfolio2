import { supabase } from "../supabase/supabaseClient";
import { Track } from "./interfaces/track";

export async function getSongs(): Promise<Track[]> {
  try {
    const { data: dbSongs, error: dbError } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('Database error:', dbError);
      return await getSongsFromStorage();
    }

    if (dbSongs && dbSongs.length > 0) {
      const tracks: Track[] = [];

      for (const song of dbSongs) {
        try {
          const { data: urlData } = supabase.storage
            .from("songlist1")
            .getPublicUrl(song.filename);

          tracks.push({
            id: song.id,
            name: song.title || "Unknown Song", 
            url: urlData.publicUrl,
            artist: song.artist || "Unknown Artist", 
            duration: song.duration || undefined, 
            file_path: song.filename,
            description: song.description,
          });
        } catch (error) {
          console.error(`Error processing song ${song.id}:`, error);
        }
      }

      console.log(`Loaded ${tracks.length} tracks from database`);
      return tracks;
    }

    console.log('No songs found in database, trying storage...');
    return await getSongsFromStorage();

  } catch (error) {
    console.error('Error in getSongs:', error);
    return await getSongsFromStorage();
  }
}

async function getSongsFromStorage(): Promise<Track[]> {
  try {
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("songlist1")
      .list("", { limit: 100, offset: 0 });

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
        .from('songlist1')
        .getPublicUrl(file.name);

      // When loading from storage only (no database), format filename for display
      const displayName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      return {
        id: index + 1000, 
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
    console.error('Error getting songs from storage:', error);
    return [];
  }
}

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

      // When loading from bucket only, format filename for display
      const displayName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      return {
        id: index,
        name: displayName, // This will be the formatted filename since no database title is available
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