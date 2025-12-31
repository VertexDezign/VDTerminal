const anyWindow = window as any;

export function toggleWakeLock() {
  if (!navigator.wakeLock) {
    alert(
      "Your device does not support the Wake Lock API. Try on an Android phone or on a device running iOS 16.4 or higher!",
    );
  } else if (anyWindow.currentWakeLock && !anyWindow.currentWakeLock.released) {
    releaseScreen();
  } else {
    lockScreen();
  }
}

export async function lockScreen() {
  try {
    anyWindow.currentWakeLock = await navigator.wakeLock.request();
    alert("Wake Lock enabled");
  } catch (err) {
    alert(err);
  }
}

export async function releaseScreen() {
  anyWindow.currentWakeLock.release();
  alert("Wake Lock released");
}
