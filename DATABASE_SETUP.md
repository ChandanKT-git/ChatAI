# Database Setup Guide for AI Chatbot

## 🗄️ Overview

This guide explains how to set up the PostgreSQL database for your AI chatbot application using the provided SQL migration file.

## 📋 Prerequisites

- **Nhost Project**: A configured Nhost project with PostgreSQL database
- **Database Access**: Access to your Nhost database console or SQL editor
- **Admin Permissions**: Ability to create tables, functions, and policies

## 🚀 Quick Setup

### 1. Access Your Database

1. Go to your Nhost dashboard
2. Navigate to **Database** → **SQL Editor**
3. Or use the **Hasura Console** → **Data** → **SQL**

### 2. Run the Migration

Copy and paste the entire contents of `hasura/migrations/001_create_tables.sql` into your SQL editor and execute it.

## 📊 What the Migration Creates

### Tables

#### `public.chats`
- **Purpose**: Stores chat conversations for each user
- **Fields**:
  - `id`: Unique identifier (UUID)
  - `title`: Chat title/name
  - `user_id`: Reference to Nhost auth.users table
  - `created_at`: When the chat was created
  - `updated_at`: When the chat was last modified (auto-updated)

#### `public.messages`
- **Purpose**: Stores individual messages within chats
- **Fields**:
  - `id`: Unique identifier (UUID)
  - `content`: Message text content
  - `role`: Either 'user' or 'assistant'
  - `chat_id`: Reference to the parent chat
  - `created_at`: When the message was sent

### Functions

#### `get_user_id()`
- **Purpose**: Extracts user ID from JWT claims
- **Returns**: UUID from JWT token's 'sub' field
- **Usage**: Used by RLS policies for user authentication

#### `update_updated_at_column()`
- **Purpose**: Automatically updates the `updated_at` timestamp
- **Usage**: Called by trigger when chats are modified

### Triggers

#### `update_chats_updated_at`
- **Purpose**: Automatically updates `updated_at` when a chat is modified
- **When**: Before any UPDATE operation on the chats table

### Indexes

- `idx_chats_user_id`: Fast user-specific queries
- `idx_chats_updated_at`: Fast sorting by last activity
- `idx_messages_chat_id`: Fast message retrieval for a specific chat
- `idx_messages_created_at`: Fast chronological message ordering

### Row Level Security (RLS)

#### Chat Policies
- **SELECT**: Users can only view their own chats
- **INSERT**: Users can only create chats for themselves
- **UPDATE**: Users can only modify their own chats
- **DELETE**: Users can only delete their own chats

#### Message Policies
- **SELECT**: Users can only view messages from chats they own
- **INSERT**: Users can only add messages to chats they own
- **UPDATE**: Users can only modify messages from chats they own
- **DELETE**: Users can only delete messages from chats they own

## 🔐 Security Features

### JWT-Based Authentication
- Uses Nhost JWT tokens for user identification
- Extracts user ID from JWT claims
- Secure user data isolation

### Data Isolation
- Users can only access their own data
- No cross-user data leakage
- Proper foreign key constraints with cascade deletes

### Input Validation
- Role field restricted to 'user' or 'assistant'
- Required fields properly enforced
- UUID validation for all ID fields

## 🧪 Testing the Setup

### 1. Verify Tables Created
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('chats', 'messages');
```

### 2. Verify Functions Created
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name IN ('get_user_id', 'update_updated_at_column');
```

### 3. Verify Triggers Created
```sql
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_schema = 'public' AND trigger_name = 'update_chats_updated_at';
```

### 4. Verify RLS Enabled
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('chats', 'messages');
```

### 5. Verify Policies Created
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('chats', 'messages');
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Function `get_user_id()` Not Found
- **Cause**: Function wasn't created properly
- **Solution**: Re-run the function creation part of the migration

#### 2. RLS Policies Not Working
- **Cause**: JWT claims not being passed correctly
- **Solution**: Ensure Hasura is configured to forward JWT claims

#### 3. Foreign Key Constraint Errors
- **Cause**: Referenced tables don't exist
- **Solution**: Ensure Nhost auth.users table exists

#### 4. Permission Denied Errors
- **Cause**: RLS policies too restrictive
- **Solution**: Check that JWT claims contain the expected 'sub' field

### Debug Queries

#### Check JWT Claims
```sql
SELECT current_setting('request.jwt.claims', true);
```

#### Test User ID Function
```sql
SELECT get_user_id();
```

#### Check RLS Status
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('chats', 'messages');
```

## 📚 Next Steps

After running this migration:

1. **Configure Hasura Metadata**: Apply the metadata files from `hasura/metadata/`
2. **Set up n8n Workflow**: Import and configure the n8n workflow
3. **Test Authentication**: Verify user sign-up/sign-in works
4. **Test Chat Creation**: Create a new chat and verify RLS works
5. **Test Messaging**: Send messages and verify AI responses

## 🆘 Support

If you encounter issues:

1. Check the Nhost documentation for database setup
2. Verify your JWT configuration in Hasura
3. Check the database logs for error messages
4. Ensure all migration steps completed successfully

## 📝 Notes

- **JWT Claims**: The migration expects JWT tokens with a 'sub' field containing the user ID
- **Nhost Integration**: This setup is specifically designed for Nhost authentication
- **Hasura Compatibility**: The RLS policies work with Hasura's GraphQL engine
- **Performance**: Indexes are created for optimal query performance

---

**Migration File**: `hasura/migrations/001_create_tables.sql`  
**Last Updated**: August 22, 2025  
**Status**: ✅ Ready for Production
