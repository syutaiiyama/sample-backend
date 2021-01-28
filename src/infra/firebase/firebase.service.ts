import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseUserInfo } from './firebase-user-info.interface';
import { checkAndCreateTestUserInfo } from './firebase-user-info.factory';

export enum FirebaseApp {
  SHOP,
  ADMIN,
}

@Injectable()
export class FirebaseService {
  private readonly adminApp: admin.app.App;
  private readonly shopApp: admin.app.App;

  constructor() {
    // Admin 用 Firebase Project の初期化
    if (this.adminApp === undefined)
      this.adminApp = admin.initializeApp(
        {
          credential: admin.credential.cert({
            projectId: process.env.NEST_APP_FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.NEST_APP_FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.NEST_APP_FIREBASE_ADMIN_PRIVATE_KEY.replace(
              /\\n/g,
              '\n',
            ),
          }),
        },
        'admin',
      );
    // Shop 用 Firebase Project の初期化
    if (this.shopApp === undefined)
      this.shopApp = admin.initializeApp(
        {
          credential: admin.credential.cert({
            projectId: process.env.NEST_APP_FIREBASE_SHOP_PROJECT_ID,
            clientEmail: process.env.NEST_APP_FIREBASE_SHOP_CLIENT_EMAIL,
            privateKey: process.env.NEST_APP_FIREBASE_SHOP_PRIVATE_KEY.replace(
              /\\n/g,
              '\n',
            ),
          }),
        },
        'shop',
      );
  }

  public verifyIdToken = async (
    idToken: string,
    firebaseApp: FirebaseApp,
  ): Promise<FirebaseUserInfo> => {
    if (process.env.NODE_ENV !== 'production') {
      const result = checkAndCreateTestUserInfo(idToken);
      if (result) return result;
    }
    const decodedToken =
      firebaseApp === FirebaseApp.ADMIN
        ? await this.adminApp.auth().verifyIdToken(idToken)
        : await this.shopApp.auth().verifyIdToken(idToken);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  };
}
