-- AI Chatbot Database Migration
-- This migration creates the necessary tables and policies for the AI chatbot application
-- Uses JWT claims from Nhost authentication for Row Level Security (RLS)

-- ============================================================================
-- STEP 1: Create Functions (must be created before they can be used in policies)
-- ============================================================================

-- Create function to extract user ID from JWT claims
-- This function extracts the user ID from the JWT token claims
-- The 'sub' field contains the user ID from Nhost authentication
-- Returns NULL if JWT claims are not available or invalid
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN current_setting('request.jwt.claims', true)::json->>'sub';
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to automatically update updated_at timestamp
-- This function is used by the trigger to keep the updated_at field current
-- It sets the updated_at field to the current timestamp before any UPDATE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- STEP 2: Create Tables
-- ============================================================================

-- Create chats table
-- This table stores chat conversations for each user
-- Each chat belongs to a specific user and can contain multiple messages
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Nhost auth.users table, cascade delete if user is deleted
    created_at TIMESTAMPTZ DEFAULT NOW(), -- When the chat was created
    updated_at TIMESTAMPTZ DEFAULT NOW()  -- When the chat was last modified (auto-updated by trigger)
);

-- Create messages table
-- This table stores individual messages within each chat
-- Messages can be from users or AI assistants
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')), -- Only allow 'user' or 'assistant' roles for message classification
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE, -- Link to chats table, cascade delete if chat is deleted
    created_at TIMESTAMPTZ DEFAULT NOW() -- When the message was sent
);

-- ============================================================================
-- STEP 3: Create Indexes for Performance
-- ============================================================================

-- Create indexes for better performance
-- These indexes improve query performance for common operations
-- user_id index: Fast user-specific queries (e.g., "show my chats")
-- updated_at index: Fast sorting by last activity (e.g., "show recent chats")
-- chat_id index: Fast message retrieval for a specific chat
-- created_at index: Fast chronological message ordering
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON public.chats(updated_at);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- ============================================================================
-- STEP 4: Enable Row Level Security
-- ============================================================================

-- Enable Row Level Security
-- This ensures users can only access their own data
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: Create RLS Policies (functions are now available)
-- ============================================================================

-- Create RLS policies for chats table
-- These policies ensure users can only access their own chat data
-- SELECT: Users can only view chats they created
CREATE POLICY "Users can view their own chats" ON public.chats
    FOR SELECT USING (user_id = get_user_id());

-- INSERT: Users can only create chats for themselves
CREATE POLICY "Users can insert their own chats" ON public.chats
    FOR INSERT WITH CHECK (user_id = get_user_id());

-- UPDATE: Users can only modify their own chats
CREATE POLICY "Users can update their own chats" ON public.chats
    FOR UPDATE USING (user_id = get_user_id());

-- DELETE: Users can only delete their own chats
CREATE POLICY "Users can delete their own chats" ON public.chats
    FOR DELETE USING (user_id = get_user_id());

-- Create RLS policies for messages table
-- These policies ensure users can only access messages from chats they own
-- SELECT: Users can only view messages from chats they own
CREATE POLICY "Users can view messages from their chats" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE id = chat_id AND user_id = get_user_id()
        )
    );

-- INSERT: Users can only add messages to chats they own
CREATE POLICY "Users can insert messages to their chats" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE id = chat_id AND user_id = get_user_id()
        )
    );

-- UPDATE: Users can only modify messages from chats they own
CREATE POLICY "Users can update messages from their chats" ON public.messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE id = chat_id AND user_id = get_user_id()
        )
    );

-- DELETE: Users can only delete messages from chats they own
CREATE POLICY "Users can delete messages from their chats" ON public.messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE id = chat_id AND user_id = get_user_id()
        )
    );

-- ============================================================================
-- STEP 6: Create Triggers (functions are now available)
-- ============================================================================

-- Create trigger to automatically update updated_at
-- This ensures the updated_at timestamp is always current when a chat is modified
-- The trigger fires before any UPDATE operation on the chats table
-- It automatically calls the update_updated_at_column() function
CREATE TRIGGER update_chats_updated_at 
    BEFORE UPDATE ON public.chats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- 
-- This migration creates:
-- - 2 functions: get_user_id() and update_updated_at_column()
-- - 2 tables: chats and messages
-- - 4 indexes for performance optimization
-- - 8 RLS policies for data security
-- - 1 trigger for automatic timestamp updates
-- 
-- All components are created in the correct dependency order.
