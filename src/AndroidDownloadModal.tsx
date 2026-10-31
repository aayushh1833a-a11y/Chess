import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { usePWAInstall } from './usePWAInstall';

interface AndroidDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidDownloadModal: React.FC<AndroidDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, isOnline, install } = usePWAInstall();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'install' | 'qr' | 'apk' | 'offline'>('install');
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://wizard-chess.app';
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wizard-chess.app';

  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(currentUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: '#080a0f',
        light: '#f5d76e',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation failed:', err));
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    setInstallStatus('Opening Android APK Installer...');
    const result = await install();
    if (result === 'accepted') {
      setInstallStatus('Installed successfully! Look for Wizard Chess on your home screen & app drawer.');
      setTimeout(() => {
        onClose();
      }, 2500);
    } else if (result === 'dismissed') {
      setInstallStatus('Installation was dismissed.');
    } else {
      setInstallStatus('Tap the browser menu ⋮ and select "Install App" or "Add to Home screen".');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadManifest = () => {
    setDownloadingZip(true);
    const manifestData = {
      id: '/',
      name: 'Wizard Chess 3D — Sanctum Edition',
      short_name: 'Wizard Chess',
      description: 'Interactive 3D Gothic Cathedral Wizard Chess with sculpted stone pieces, cinematic melee captures, and AI.',
      theme_color: '#080a0f',
      background_color: '#080a0f',
      display: 'standalone',
      orientation: 'any',
      start_url: originUrl,
      scope: originUrl + '/',
      categories: ['games', 'entertainment', 'board'],
      package_name: 'com.wizardchess.sanctum',
      version: '1.0.0',
      icons: [
        { src: originUrl + '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: originUrl + '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: originUrl + '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    };
    const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wizard-chess-android-manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadingZip(false), 800);
  };

  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(originUrl)}`;

  return (
    <div className="apk-modal-backdrop" onClick={onClose}>
      <div
        className="apk-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apk-modal-title"
      >
        {/* Modal Header */}
        <div className="apk-modal-header">
          <div className="apk-modal-brand">
            <div className="apk-android-badge">
              <svg viewBox="0 0 24 24" className="apk-android-icon" fill="currentColor">
                <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
              </svg>
            </div>
            <div>
              <h2 id="apk-modal-title" className="apk-modal-heading">
                Download Android App &amp; APK
              </h2>
              <p className="apk-modal-sub">
                Install as a full native APK on your Android device • Works offline
              </p>
            </div>
          </div>
          <button
            type="button"
            className="apk-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="apk-tabs">
          <button
            type="button"
            className={`apk-tab-btn ${activeTab === 'install' ? 'active' : ''}`}
            onClick={() => setActiveTab('install')}
          >
            ⚡ 1-Tap WebAPK
          </button>
          <button
            type="button"
            className={`apk-tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            📱 Scan QR Code
          </button>
          <button
            type="button"
            className={`apk-tab-btn ${activeTab === 'apk' ? 'active' : ''}`}
            onClick={() => setActiveTab('apk')}
          >
            📦 Direct .APK Builder
          </button>
          <button
            type="button"
            className={`apk-tab-btn ${activeTab === 'offline' ? 'active' : ''}`}
            onClick={() => setActiveTab('offline')}
          >
            🛡️ Offline &amp; Storage
          </button>
        </div>

        {/* Tab 1: 1-Tap WebAPK Install */}
        {activeTab === 'install' && (
          <div className="apk-tab-content">
            <div className="apk-feature-box">
              <div className="apk-feature-lead">
                <span className="apk-gold-badge">Official Android Standard</span>
                <h3>Direct Native WebAPK Installation</h3>
                <p>
                  Android turns Wizard Chess into a real native APK installed directly into your
                  phone&apos;s app drawer and home screen. Launches full-screen without Chrome address bars,
                  with hardware accelerated 3D graphics and full offline capability!
                </p>
              </div>

              {isInstalled ? (
                <div className="apk-success-banner">
                  <span className="apk-icon-check">✓</span>
                  <div>
                    <strong>Wizard Chess is already installed as an Android App!</strong>
                    <p>You can launch it directly from your device home screen or app launcher.</p>
                  </div>
                </div>
              ) : (
                <div className="apk-install-actions">
                  <button
                    type="button"
                    className="apk-cta-btn primary glow"
                    onClick={handleNativeInstall}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    Install Wizard Chess on Android (WebAPK)
                  </button>

                  {installStatus && (
                    <div className="apk-status-msg">{installStatus}</div>
                  )}
                </div>
              )}

              {/* Step-by-step instructions */}
              <div className="apk-steps-grid">
                <div className="apk-step-card">
                  <div className="apk-step-num">1</div>
                  <h4>Open in Android Chrome</h4>
                  <p>Open this URL on your Android phone using Chrome, Samsung Internet, or Brave.</p>
                </div>
                <div className="apk-step-card">
                  <div className="apk-step-num">2</div>
                  <h4>Tap &quot;Install App&quot;</h4>
                  <p>Click the install button or tap browser menu <strong>(⋮)</strong> and select <strong>&quot;Install app&quot;</strong>.</p>
                </div>
                <div className="apk-step-card">
                  <div className="apk-step-num">3</div>
                  <h4>Android Compiles APK</h4>
                  <p>Google Play Services creates and signs your standalone APK package automatically.</p>
                </div>
                <div className="apk-step-card">
                  <div className="apk-step-num">4</div>
                  <h4>Play Anytime Offline</h4>
                  <p>Access Wizard Chess from your launcher. Works even in Airplane mode without WiFi!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Mobile QR Code */}
        {activeTab === 'qr' && (
          <div className="apk-tab-content">
            <div className="apk-qr-layout">
              <div className="apk-qr-image-wrap">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Scan QR Code to open Wizard Chess on Android" className="apk-qr-img" />
                ) : (
                  <div className="apk-qr-placeholder">Generating QR code...</div>
                )}
                <div className="apk-qr-caption">Scan with Android Camera</div>
              </div>

              <div className="apk-qr-details">
                <h3>Open Instantly on your Mobile Phone</h3>
                <p>
                  Point your Android smartphone camera or QR scanner at the golden QR code on the left.
                  Your phone will prompt you to open the Sanctum in Chrome, where you can tap &quot;Install App&quot; with one touch.
                </p>

                <div className="apk-url-box">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="apk-url-input"
                    aria-label="Application URL"
                  />
                  <button
                    type="button"
                    className="apk-copy-btn"
                    onClick={handleCopyLink}
                  >
                    {copied ? 'Copied! ✓' : 'Copy Link'}
                  </button>
                </div>

                <div className="apk-tip">
                  💡 <strong>Pro Tip:</strong> Once loaded on your phone, tap the three dots <strong>(⋮)</strong> at the top right of Chrome and select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong> to get the APK.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Direct APK Builder */}
        {activeTab === 'apk' && (
          <div className="apk-tab-content">
            <div className="apk-feature-box">
              <div className="apk-feature-lead">
                <span className="apk-gold-badge">Sideloading &amp; Distribution</span>
                <h3>Direct .APK Sideload Package &amp; Build Tools</h3>
                <p>
                  If you need a standalone <code>.apk</code> file to sideload via USB/Bluetooth, distribute to testers, or publish to Google Play Store, use these ready-to-go tools:
                </p>
              </div>

              <div className="apk-build-grid">
                {/* Method 1: GitHub Actions Automated CI/CD */}
                <div className="apk-build-card">
                  <div className="apk-build-tag" style={{ color: '#4caf50', background: 'rgba(76, 175, 80, 0.15)' }}>
                    Automated GitHub Actions CI/CD (.github/workflows/build-apk.yml)
                  </div>
                  <h4>GitHub Actions build-apk.yml</h4>
                  <p>
                    Every push and manual trigger automatically compiles a fresh <code>WizardChess3D-debug.apk</code> and <code>WizardChess3D-release.apk</code> in Ubuntu runners using the native Android SDK and Gradle.
                  </p>
                  <div className="apk-code-block">
                    <code>
                      Workflow: .github/workflows/build-apk.yml<br />
                      Trigger: push to main/master, PRs, or Actions &gt; Run workflow<br />
                      Artifact: WizardChess3D-Android-APK (downloadable zip)
                    </code>
                  </div>
                </div>

                {/* Method 2: PWABuilder */}
                <div className="apk-build-card">
                  <div className="apk-build-tag">Recommended for Beginners</div>
                  <h4>1-Click APK with PWABuilder</h4>
                  <p>
                    PWABuilder (maintained by Microsoft &amp; Google) packages this live URL and manifest into a signed, ready-to-install Android APK file in under 60 seconds.
                  </p>
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apk-cta-btn secondary"
                  >
                    Open PWABuilder APK Generator ↗
                  </a>
                </div>

                {/* Method 3: Bubblewrap CLI */}
                <div className="apk-build-card">
                  <div className="apk-build-tag">Official Google TWA Tool</div>
                  <h4>Google Bubblewrap CLI</h4>
                  <p>
                    Official Google CLI that compiles Trusted Web Activity (TWA) Android Studio Gradle projects and builds signed APKs / AABs.
                  </p>
                  <div className="apk-code-block">
                    <code>
                      npm i -g @bubblewrap/cli<br />
                      bubblewrap init --manifest={originUrl}/manifest.webmanifest<br />
                      bubblewrap build
                    </code>
                  </div>
                </div>

                {/* Method 4: Manifest download */}
                <div className="apk-build-card">
                  <div className="apk-build-tag">App Metadata</div>
                  <h4>Export Android Manifest &amp; Config</h4>
                  <p>
                    Download the preconfigured Android application manifest specification for Android Studio, Capacitor, or Cordova.
                  </p>
                  <button
                    type="button"
                    className="apk-cta-btn secondary"
                    onClick={handleDownloadManifest}
                    disabled={downloadingZip}
                  >
                    {downloadingZip ? 'Exporting...' : 'Download Android Manifest (.json)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Offline Status */}
        {activeTab === 'offline' && (
          <div className="apk-tab-content">
            <div className="apk-feature-box">
              <div className="apk-feature-lead">
                <span className="apk-gold-badge">Zero Lag Offline Engine</span>
                <h3>Service Worker &amp; Offline Storage</h3>
                <p>
                  Wizard Chess caches all cathedral architecture, sculpted marble pieces, audio, and the chess AI engine directly into your phone&apos;s local storage.
                </p>
              </div>

              <div className="apk-offline-grid">
                <div className="apk-offline-item">
                  <div className="apk-offline-label">Network Connection</div>
                  <div className="apk-offline-value">
                    <span className={`apk-dot ${isOnline ? 'online' : 'offline'}`}></span>
                    {isOnline ? 'Online (Ready to sync / cache)' : 'Offline (Playing from local cache)'}
                  </div>
                </div>

                <div className="apk-offline-item">
                  <div className="apk-offline-label">3D Cathedral &amp; Sculptures</div>
                  <div className="apk-offline-value">
                    <span className="apk-dot online"></span>
                    High-res GLB models precached via Workbox
                  </div>
                </div>

                <div className="apk-offline-item">
                  <div className="apk-offline-label">Chess Engine &amp; AI</div>
                  <div className="apk-offline-value">
                    <span className="apk-dot online"></span>
                    Embedded Client AI (Alpha-Beta / Minimax)
                  </div>
                </div>

                <div className="apk-offline-item">
                  <div className="apk-offline-label">Android Display Mode</div>
                  <div className="apk-offline-value">
                    {isInstalled ? 'Standalone Native App (Fullscreen)' : 'Browser Mode (Install to unlock Standalone)'}
                  </div>
                </div>
              </div>

              <div className="apk-offline-note">
                ⚡ <strong>Offline Guarantee:</strong> Once installed on your phone, you can turn on Airplane Mode and launch Wizard Chess anywhere — on flights, subways, or without any mobile data connection!
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="apk-modal-footer">
          <div className="apk-footer-info">
            Compatible with Android 8.0+ • Google Chrome, Samsung Internet, Edge, Brave &amp; TWA
          </div>
          <button type="button" className="apk-footer-close" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
