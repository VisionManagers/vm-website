import { supabase } from './supabase';
import type { InsightPost } from '../types';

export async function getPublishedPosts(): Promise<InsightPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data as InsightPost[];
}

export async function getPostBySlug(slug: string): Promise<InsightPost | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data as InsightPost;
}
