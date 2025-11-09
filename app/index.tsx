import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient';

export default function Index() {
  const router = useRouter();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const decide = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) {
          // Sin sesión → mostrar pantalla inicial de bienvenida
          router.replace('/initial');
          return;
        }
        // Con sesión → verificar si tiene alergias
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
}