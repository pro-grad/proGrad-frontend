import ServiceWorkerRegister from "./sw-register";

export const metadata = {
  title: "Local WASM AI",
  description: "Offline WASM LLM PWA",
  manifest: "/manifest.json",
  icons: {
    icon: "/globe.svg",
    shortcut: "/globe.svg",
    apple: "/globe.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WASM AI",
  },
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
