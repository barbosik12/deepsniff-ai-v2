import { supabase, supabaseHelpers } from './supabase';

// Demo functions to test Supabase integration
export async function testSupabaseConnection() {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
    return false;
  }
}

// Demo: Create a sample analysis
export async function createSampleAnalysis(userId: string = 'demo-user-123') {
  try {
    const analysisData = {
      user_id: userId,
      file_name: 'sample_video.mp4',
      file_type: 'video/mp4',
      is_deepfake: Math.random() > 0.5,
      confidence: Math.random() * 0.4 + 0.6, // 60-100%
      analysis_time: Math.floor(Math.random() * 3000) + 1000 // 1-4 seconds
    };

    const result = await supabaseHelpers.createAnalysis(analysisData);
    console.log('✅ Sample analysis created:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to create sample analysis:', error);
    throw error;
  }
}

// Demo: Get user statistics
export async function getDemoUserStats(userId: string = 'demo-user-123') {
  try {
    const stats = await supabaseHelpers.getUserStats(userId);
    console.log('📊 User statistics:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Failed to get user stats:', error);
    throw error;
  }
}

// Demo: Real-time subscription
export function setupRealtimeDemo(userId: string = 'demo-user-123') {
  console.log('🔄 Setting up real-time subscription...');
  
  const subscription = supabase
    .channel('demo-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'analyses',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('🔔 Real-time update received:', payload);
      }
    )
    .subscribe();

  console.log('✅ Real-time subscription active');
  return subscription;
}

// Demo: File upload simulation
export async function simulateFileUpload() {
  try {
    // Create a dummy file for testing
    const dummyFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    
    // Upload to Supabase Storage (you'll need to create a bucket first)
    const uploadPath = `uploads/${Date.now()}_${dummyFile.name}`;
    
    // Note: This will fail if the bucket doesn't exist
    // You need to create a bucket in your Supabase dashboard first
    const result = await supabase.storage
      .from('deepfake-uploads')
      .upload(uploadPath, dummyFile);
    
    if (result.error) {
      console.log('ℹ️ Storage upload failed (bucket may not exist):', result.error.message);
      return null;
    }
    
    console.log('✅ File uploaded successfully:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ File upload simulation failed:', error);
    return null;
  }
}

// Run all demos
export async function runAllDemos() {
  console.log('🚀 Running Supabase integration demos...\n');
  
  // Test connection
  const isConnected = await testSupabaseConnection();
  if (!isConnected) {
    console.log('❌ Cannot proceed with demos - connection failed');
    return;
  }
  
  // Create sample data
  try {
    await createSampleAnalysis();
  } catch (error) {
    console.log('ℹ️ Sample analysis creation failed (table may not exist)');
  }
  
  // Get stats
  try {
    await getDemoUserStats();
  } catch (error) {
    console.log('ℹ️ Stats retrieval failed (table may not exist)');
  }
  
  // Setup real-time
  const subscription = setupRealtimeDemo();
  
  // Test file upload
  await simulateFileUpload();
  
  console.log('\n✅ All demos completed!');
  console.log('📝 Note: Some features may require database tables to be created first.');
  
  // Cleanup
  setTimeout(() => {
    subscription.unsubscribe();
    console.log('🧹 Real-time subscription cleaned up');
  }, 5000);
}