import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient';

export default function Index() {
<<<<<<< HEAD
  return <Redirect href="/initial" />;
=======
  const router = useRouter();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const decide = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) {
          router.replace('/login');
          return;
        }
        const { data: al } = await supabase
          .from('allergies')
          .select('id')
          .eq('profile_id', user.id)
          .limit(1);
        if (al && al.length > 0) {
          router.replace('/sos');
        } else {
          router.replace('/completeProfile');
        }
      } finally {
        setBooting(false);
      }
    };
    decide();
  }, [router]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
>>>>>>> bc8f473 (mmk)
}