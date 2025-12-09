import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// SIGN UP
export const emailSignUp = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// SIGN IN
export const emailSignIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// LOGOUT
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};

// This prevents browser from leaving the app:
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "458063018506-68db7dp34tjugsro9gi6r0uovpi0mc0e.apps.googleusercontent.com",
  });

  async function handleGoogleResponse() {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(auth, credential);
    }
  }

  return { request, response, promptAsync, handleGoogleResponse };
};

export const appleSignIn = async () => {
  try {
    const appleResponse = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: appleResponse.identityToken,
    });

    await signInWithCredential(auth, credential);

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
