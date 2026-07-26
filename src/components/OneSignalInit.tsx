"use client";

import Script from "next/script";

export default function OneSignalInit() {
  return (
    <>
      <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}",
              notifyButton: { enable: false },
            });
            OneSignal.Slidedown.promptPush();
          });
        `}
      </Script>
    </>
  );
}