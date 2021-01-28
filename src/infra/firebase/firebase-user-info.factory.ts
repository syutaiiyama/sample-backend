import { FirebaseUserInfo } from './firebase-user-info.interface';

// NOTE: scripts/insert_test_users/insert_test_users_to_local.sh にてテストユーザが挿入されていることが前提
export const checkAndCreateTestUserInfo = (
  idToken: string,
): FirebaseUserInfo => {
  switch (idToken) {
    case 'test-id-token-user':
      return {
        uid: 'RhUidNE3GxgEA3XrP0sT6YEccdA2',
        email: 'test-user@antyba.com',
      };
    case 'test-id-token-admin-user':
      return {
        uid: 'kdeErnFwKgN83yJPlFzT688EdDr2',
        email: 'test-admin-user@antyba.com',
      };
    default:
      return;
  }
};
