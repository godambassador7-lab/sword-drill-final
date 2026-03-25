import { isSupabaseConfigured, supabase } from './supabaseClient';

const SHARP_MESSAGES_TABLE = 'sharp_assistant_messages';

export const getRecentSharpMessages = async (userId, limit = 30) => {
  if (!userId || !isSupabaseConfigured || !supabase) {
    return { success: false, messages: [] };
  }

  const { data, error } = await supabase
    .from(SHARP_MESSAGES_TABLE)
    .select('id, role, content, citations, metadata, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[sharpAssistantSupabase] Failed to load messages:', error);
    return { success: false, messages: [] };
  }

  return {
    success: true,
    messages: [...(data || [])].reverse()
  };
};

export const saveSharpConversationTurn = async ({
  userId,
  sessionId,
  userQuestion,
  assistantAnswer,
  citations = [],
  metadata = {}
}) => {
  if (!userId || !isSupabaseConfigured || !supabase) {
    return { success: false };
  }

  const rows = [
    {
      user_id: userId,
      session_id: sessionId,
      role: 'user',
      content: userQuestion,
      citations: [],
      metadata: {}
    },
    {
      user_id: userId,
      session_id: sessionId,
      role: 'assistant',
      content: assistantAnswer,
      citations,
      metadata
    }
  ];

  const { error } = await supabase.from(SHARP_MESSAGES_TABLE).insert(rows);

  if (error) {
    console.error('[sharpAssistantSupabase] Failed to save conversation turn:', error);
    return { success: false };
  }

  return { success: true };
};

