import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import {
  createAudioPlayer,
  setAudioModeAsync,
  setIsAudioActiveAsync,
} from 'expo-audio';

const LOAD_TIMEOUT_MS = 12000;

let audioSessionReady = false;

export async function initializeAlarmAudio() {
  if (audioSessionReady) return;

  await setIsAudioActiveAsync(true);
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'doNotMix',
  });
  audioSessionReady = true;
}

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

function waitForPlayerLoaded(player) {
  return new Promise((resolve, reject) => {
    if (player.isLoaded) {
      resolve();
      return;
    }

    let subscription;
    const timeout = setTimeout(() => {
      subscription?.remove();
      reject(new Error('Alarm sound failed to load'));
    }, LOAD_TIMEOUT_MS);

    subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (status.error) {
        clearTimeout(timeout);
        subscription.remove();
        reject(new Error(status.error));
        return;
      }

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
  audio.volume = 1;
  await audio.play();
  webAudioRef.current = audio;
}

async function playNativeAudio(source, nativePlayerRef, loop) {
  await initializeAlarmAudio();

  const uri = await resolveSourceUri(source);
  const playerSource = uri ?? source;
  const player = createAudioPlayer(playerSource, { downloadFirst: true });

  player.loop = loop;
  player.volume = 1;
  nativePlayerRef.current = player;

  await waitForPlayerLoaded(player);
  player.play();

  if (!player.playing) {
    player.play();
  }
}

export async function playLoopingAlarm(source, nativePlayerRef, webAudioRef) {
  await stopAlarm(nativePlayerRef, webAudioRef);

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    await playWebAudio(source, webAudioRef, true);
    return;
  }

  try {
    await playNativeAudio(source, nativePlayerRef, true);
  } catch (error) {
    const uri = await resolveSourceUri(source);
    if (!uri) throw error;

    const fallbackPlayer = createAudioPlayer({ uri }, { downloadFirst: true });
    fallbackPlayer.loop = true;
    fallbackPlayer.volume = 1;
    nativePlayerRef.current = fallbackPlayer;
    await waitForPlayerLoaded(fallbackPlayer);
    fallbackPlayer.play();
  }
}

export async function previewAlarm(source, nativePlayerRef, webAudioRef) {
  await stopAlarm(nativePlayerRef, webAudioRef);

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    await playWebAudio(source, webAudioRef, false);
    return;
  }

  await playNativeAudio(source, nativePlayerRef, false);
}

export async function stopAlarm(nativePlayerRef, webAudioRef) {
  try {
    if (Platform.OS === 'web' && webAudioRef?.current) {
      webAudioRef.current.pause();
      webAudioRef.current.currentTime = 0;
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
