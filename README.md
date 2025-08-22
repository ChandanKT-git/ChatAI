# AI Chatbot Application

A full-stack AI chatbot application built with React, Nhost, Hasura, and n8n, featuring real-time messaging and AI-powered responses.

## 🚀 Features

- **Authentication**: Email-based sign-up/sign-in using Nhost Auth
- **Real-time Chat**: GraphQL subscriptions for instant message updates
- **AI Integration**: OpenRouter API integration via n8n workflows
- **Secure**: Row-level security and proper user permissions
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## 🏗️ Architecture

```
Frontend (React) → Hasura GraphQL → n8n Workflow → OpenRouter API
     ↓                    ↓              ↓
  Nhost Auth        PostgreSQL DB    AI Response
```

### Components

1. **Frontend**: React application with GraphQL client
2. **Authentication**: Nhost Auth for user management
3. **Database**: PostgreSQL with Hasura GraphQL engine
4. **Workflow Engine**: n8n for AI integration
5. **AI Provider**: OpenRouter API for chatbot responses

## 📋 Prerequisites

- Node.js 18+ and npm
- Nhost account and project
- n8n instance
- OpenRouter API key
- Netlify account (for deployment)

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
VITE_NHOST_BACKEND_URL=https://your-subdomain.region.nhost.run
VITE_NHOST_SUBDOMAIN=your-subdomain
VITE_NHOST_REGION=your-region
VITE_GRAPHQL_HTTP=https://your-subdomain.graphql.region.nhost.run/v1/
VITE_GRAPHQL_WS=wss://your-subdomain.graphql.region.nhost.run/v1/
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Run SQL Migration

Execute the SQL migration in your Hasura console:

```sql
-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies
-- (See hasura/migrations/001_create_tables.sql for complete setup)
```

#### Apply Hasura Metadata

1. Upload the metadata files from `hasura/metadata/`
2. Apply the metadata in your Hasura console

### 4. n8n Workflow Setup

1. Import the `n8n-workflow.json` file into your n8n instance
2. Set up the required environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
3. Configure the webhook URL in the workflow
4. Update the Hasura GraphQL endpoint URLs

### 5. Hasura Action Configuration

Create the `sendMessage` action in Hasura:

```yaml
name: sendMessage
definition:
  kind: synchronous
  handler: '{{NHOST_BACKEND_URL}}/actions/sendMessage'
  forward_client_headers: true
permissions:
  - role: user
type: mutation
arguments:
  - name: chat_id
    type: uuid!
  - name: message
    type: String!
output_type: MessageResponse
```

### 6. Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🚀 Deployment

### Netlify Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Environment Variables in Netlify**:
   - `VITE_NHOST_BACKEND_URL`
   - `VITE_NHOST_SUBDOMAIN`
   - `VITE_NHOST_REGION`
   - `VITE_GRAPHQL_HTTP`
   - `VITE_GRAPHQL_WS`

### Manual Deployment

1. Build the application: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure environment variables

## 🔐 Security Features

- **Row-Level Security (RLS)**: Users can only access their own data
- **Authentication Required**: All features require valid authentication
- **Input Validation**: Proper validation on all user inputs
- **Secure API Calls**: All external calls go through n8n, never directly from frontend

## 📱 Usage

1. **Sign Up/In**: Create an account or sign in with existing credentials
2. **Create Chat**: Start a new conversation with a custom title
3. **Send Messages**: Type messages and receive AI-powered responses
4. **Real-time Updates**: Messages appear instantly using GraphQL subscriptions

## 🧪 Testing

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Troubleshooting

### Common Issues

1. **GraphQL Connection Error**: Check your Nhost configuration and environment variables
2. **Authentication Issues**: Verify Nhost Auth is properly configured
3. **AI Response Errors**: Check n8n workflow and OpenRouter API key
4. **Permission Denied**: Ensure RLS policies are correctly applied

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## 📚 API Reference

### GraphQL Queries

- `GetChats`: Fetch all user chats
- `GetChat`: Fetch specific chat with messages
- `GetMessages`: Real-time message subscription

### GraphQL Mutations

- `CreateChat`: Create a new chat
- `CreateMessage`: Add a message to a chat
- `UpdateChat`: Update chat title

### Hasura Actions

- `sendMessage`: Trigger AI response workflow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the Hasura and n8n documentation
- Open an issue in the repository

## 🔄 Updates

Stay updated with the latest changes:
- Follow the repository for updates
- Check the changelog for version information
- Review breaking changes in major releases
