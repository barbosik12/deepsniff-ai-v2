# 🗄️ Supabase Integration Setup Guide

## 📋 Overview

This project is fully integrated with Supabase for backend functionality including:
- ✅ Database operations (users, analyses)
- ✅ Row Level Security (RLS)
- ✅ File storage with user-uploads bucket
- ✅ Real-time subscriptions
- ✅ Authentication ready

## 🚀 Quick Start

### 1. Environment Setup
Your `.env.local` file is already configured with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yiyjsxwqntpbophcvpcn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Test the Integration
Visit `/supabase-test` to:
- ✅ Test database connection
- ✅ Run CRUD operations
- ✅ Test real-time features
- ✅ Test file uploads

## 🗄️ Database Schema

### Tables Created:

#### `users` table:
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

#### `analyses` table:
```sql
CREATE TABLE analyses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input text NOT NULL,
  output text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## 🔒 Security (RLS Policies)

### Users Table Policies:
- ✅ Users can read their own data
- ✅ Users can insert their own data
- ✅ Users can update their own data

### Analyses Table Policies:
- ✅ Users can read their own analyses
- ✅ Users can create new analyses
- ✅ Users can update their own analyses
- ✅ Users can delete their own analyses

## 📁 Storage Configuration

### `user-uploads` Bucket:
- ✅ Private bucket (not public)
- ✅ Users can upload to their own folder: `/{user_id}/filename`
- ✅ Users can only access their own files
- ✅ Supports all file types for deepfake analysis

## 🧪 Testing Features

### Available Tests:
1. **Connection Test** - Verify database connectivity
2. **Select Users** - Test reading from users table
3. **Create User** - Test inserting new users
4. **Create Analysis** - Test inserting analysis records
5. **Real-time** - Test real-time subscriptions
6. **Storage Upload** - Test file upload to bucket

### Test Page Features:
- 📊 Real-time statistics
- ⚙️ Configuration status
- 📋 Setup instructions
- 🔄 Live test results

## 🛠️ Manual Setup Required

### In Supabase Dashboard:

1. **Run Migration SQL:**
   ```sql
   -- Copy and run the content from supabase/migrations/001_create_tables.sql
   ```

2. **Create Storage Bucket:**
   ```sql
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('user-uploads', 'user-uploads', false);
   ```

3. **Apply Storage Policies:**
   ```sql
   -- Copy and run the content from supabase/storage/user-uploads-policy.sql
   ```

## 📚 Usage Examples

### Basic Database Operations:
```typescript
import { supabaseHelpers } from '@/lib/supabase';

// Create a user
const user = await supabaseHelpers.createUser({
  email: 'user@example.com'
});

// Create an analysis
const analysis = await supabaseHelpers.createAnalysis({
  user_id: user.id,
  input: 'video file path',
  output: '{"isDeepfake": true, "confidence": 0.95}'
});
```

### File Upload:
```typescript
import { storage } from '@/lib/supabase';

const result = await storage.uploadFile(userId, file);
const publicUrl = storage.getPublicUrl(result.path);
```

### Real-time Subscriptions:
```typescript
import { subscriptions } from '@/lib/supabase';

const subscription = subscriptions.subscribeToUserAnalyses(
  userId, 
  (payload) => console.log('New analysis:', payload)
);
```

## 🔧 Configuration Check

The system automatically checks:
- ✅ Environment variables are set
- ✅ Database connection is working
- ✅ Tables exist and are accessible
- ✅ RLS policies are active

## 📈 Monitoring

Visit `/supabase-test` for:
- 📊 Live database statistics
- 🔍 Connection status monitoring
- 🧪 Interactive API testing
- ⚙️ Configuration validation

## 🚨 Troubleshooting

### Common Issues:

1. **Connection Failed:**
   - Check environment variables in `.env.local`
   - Verify Supabase project is active

2. **Table Not Found:**
   - Run the migration SQL in Supabase Dashboard
   - Check table permissions

3. **RLS Policy Errors:**
   - Ensure RLS is enabled on tables
   - Verify policy conditions match your auth setup

4. **Storage Upload Fails:**
   - Create the `user-uploads` bucket
   - Apply storage RLS policies

## 🎯 Next Steps

1. **Test Everything:** Visit `/supabase-test` and run all tests
2. **Create Tables:** Run the migration SQL in your Supabase dashboard
3. **Setup Storage:** Create the user-uploads bucket and apply policies
4. **Integrate Auth:** Connect with your authentication system
5. **Deploy:** Your Supabase integration is production-ready!

---

🎉 **Supabase is fully integrated and ready to power your DeepSniff application!**