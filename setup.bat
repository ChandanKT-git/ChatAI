@echo off
echo 🚀 Setting up AI Chatbot Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create environment file if it doesn't exist
if not exist .env.local (
    echo 🔧 Creating .env.local file...
    copy env.example .env.local >nul
    echo ✅ .env.local created from env.example
    echo ⚠️  Please update .env.local with your actual Nhost configuration
) else (
    echo ✅ .env.local already exists
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist hasura\metadata\databases\default\tables mkdir hasura\metadata\databases\default\tables
if not exist hasura\migrations mkdir hasura\migrations
if not exist src\components mkdir src\components
if not exist src\graphql mkdir src\graphql
if not exist src\lib mkdir src\lib

echo ✅ Directories created

REM Check if all required files exist
echo 🔍 Checking required files...

set REQUIRED_FILES=package.json vite.config.js tailwind.config.js postcss.config.js index.html src\main.jsx src\App.jsx src\index.css src\lib\nhost.js src\components\Auth.jsx src\components\Layout.jsx src\components\ChatList.jsx src\components\Chat.jsx src\graphql\queries.js src\graphql\mutations.js hasura\metadata\databases\default\tables\public_chats.yaml hasura\metadata\databases\default\tables\public_messages.yaml hasura\metadata\actions.yaml hasura\metadata\custom_types.yaml hasura\migrations\001_create_tables.sql n8n-workflow.json netlify.toml README.md DEPLOYMENT.md

set MISSING_COUNT=0
for %%f in (%REQUIRED_FILES%) do (
    if not exist "%%f" (
        echo    - %%f
        set /a MISSING_COUNT+=1
    )
)

if %MISSING_COUNT% equ 0 (
    echo ✅ All required files are present
) else (
    echo ❌ Missing %MISSING_COUNT% files (listed above)
)

echo.
echo 🎉 Setup completed!
echo.
echo 📋 Next steps:
echo 1. Update .env.local with your Nhost configuration
echo 2. Set up your Hasura database with the provided SQL migration
echo 3. Import the n8n workflow and configure it
echo 4. Run 'npm run dev' to start development server
echo.
echo 📚 For detailed instructions, see:
echo    - README.md for general setup
echo    - DEPLOYMENT.md for Netlify deployment
echo.
echo 🔧 To start development:
echo    npm run dev
echo.
echo 🚀 To build for production:
echo    npm run build
echo.
pause
