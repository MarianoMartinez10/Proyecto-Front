'use client';
import {useEffect, useState} from 'react';
import {FirebaseApp, initializeApp} from 'firebase/app';
import {Auth, getAuth} from 'firebase/auth';
import {Firestore, getFirestore} from 'firebase/firestore';
import {FirebaseProvider} from './provider';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

export function FirebaseClientProvider({children}: {children: React.ReactNode}) {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (!app) {
        const response = await fetch('/__/firebase/init.json');
        const firebaseConfig = await response.json();
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        firestore = getFirestore(app);
      }
      setServices({app, auth: auth!, firestore: firestore!});
    };

    initialize();
  }, []);

  if (!services) {
    return null;
  }

  return (
    <FirebaseProvider
      app={services.app}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
