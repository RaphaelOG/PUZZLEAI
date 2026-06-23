import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const LOAD_TIMEOUT_MS = 12000;

async function resolveSourceUri(source) {
  if (typeof source === 'string') return source;
  if (typeof source === 'number') {
    const asset = Asset.fromModule(source);
    await asset.downloadAsync();
    return asset.localUri ?? asset.uri;
  }
  if (source?.uri) return source.uri;
  return null;
}

async function configureAudioMode() {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'mixWithOthers',
  });
}

function waitForPlayerLoaded(player) {
  return new Promise((resolve, reject) => {
    if (player.isLoaded) {
      resolve();
      return;
    }

    const timeout = setTimeout(() => {
      subscription?.remove();
      reject(new Error('Alarm sound failed to load'));
    }, LOAD_TIMEOUT_MS);

    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (status.isLoaded) {
        clearTimeout(timeout);
        subscription.remove();
        resolve();
      }
    });
  });
}

async function playWebAudio(source, webAudioRef, loop) {
  const uri = await resolveSourceUri(source);
  if (!uri) throw new Error('Unable to resolve alarm sound');

  const audio = new window.Audio(uri);
  audio.loop = loop;
  await audio.play();
  webAudioRef.current = audio;
}

export async function playLoopingAlarm(source, nativePlayerRef, webAudioRef) {
  await stopAlarm(nativePlayerRef, webAudioRef);

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    await playWebAudio(source, webAudioRef, true);
    return;
  }

  await configureAudioMode();
  const player = createAudioPlayer(source, { downloadFirst: true });
  player.loop = true;
  nativePlayerRef.current = player;
  await waitForPlayerLoaded(player);
  player.play();
}

export async function previewAlarm(source, nativePlayerRef, webAudioRef) {
  await stopAlarm(nativePlayerRef, webAudioRef);

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    await playWebAudio(source, webAudioRef, false);
    return;
  }

  await configureAudioMode();
  const player = createAudioPlayer(source, { downloadFirst: true });
  player.loop = false;
  nativePlayerRef.current = player;
  await waitForPlayerLoaded(player);
  player.play();
}

export async function stopAlarm(nativePlayerRef, webAudioRef) {
  try {
    if (Platform.OS === 'web' && webAudioRef?.current) {
      webAudioRef.current.pause();
      webAudioRef.current = null;
      return;
    }

    if (nativePlayerRef?.current) {
      nativePlayerRef.current.pause();
      nativePlayerRef.current.remove();
      nativePlayerRef.current = null;
    }
  } catch (_) {}
}
