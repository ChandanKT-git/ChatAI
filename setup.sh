#!/bin/bash

echo "🚀 Setting up AI Chatbot Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ .env.local created from env.example"
    echo "⚠️  Please update .env.local with your actual Nhost configuration"
else
    echo "✅ .env.local already exists"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p hasura/metadata/databases/default/tables
mkdir -p hasura/migrations
mkdir -p src/components
mkdir -p src/graphql
mkdir -p src/lib

echo "✅ Directories created"

# Check if all required files exist
echo "🔍 Checking required files..."

REQUIRED_FILES=(
    "package.json"
    "vite.config.js"
    "tailwind.config.js"
    "postcss.config.js"
    "index.html"
    "src/main.jsx"
    "src/App.jsx"
    "src/index.css"
    "src/lib/nhost.js"
    "src/components/Auth.jsx"
    "src/components/Layout.jsx"
    "src/components/ChatList.jsx"
    "src/components/Chat.jsx"
    "src/graphql/queries.js"
    "src/graphql/mutations.js"
    "hasura/metadata/databases/default/tables/public_chats.yaml"
    "hasura/metadata/databases/default/tables/public_messages.yaml"
    "hasura/metadata/actions.yaml"
    "hasura/metadata/custom_types.yaml"
    "hasura/migrations/001_create_tables.sql"
    "n8n-workflow.json"
    "netlify.toml"
    "README.md"
    "DEPLOYMENT.md"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo "✅ All required files are present"
else
    echo "❌ Missing files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file"
    done
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Nhost configuration"
echo "2. Set up your Hasura database with the provided SQL migration"
echo "3. Import the n8n workflow and configure it"
echo "4. Run 'npm run dev' to start development server"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - README.md for general setup"
echo "   - DEPLOYMENT.md for Netlify deployment"
echo ""
echo "🔧 To start development:"
echo "   npm run dev"
echo ""
echo "🚀 To build for production:"
echo "   npm run build"
