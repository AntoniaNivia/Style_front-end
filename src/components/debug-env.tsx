'use client';

export default function DebugEnv() {
  if (process.env.NEXT_PUBLIC_DEBUG !== 'true') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono z-50">
      <h3 className="font-bold mb-2">🔧 Debug Info:</h3>
      <div>API_URL: {process.env.NEXT_PUBLIC_API_URL || 'undefined'}</div>
      <div>DEBUG: {process.env.NEXT_PUBLIC_DEBUG || 'undefined'}</div>
      <div>NODE_ENV: {process.env.NODE_ENV || 'undefined'}</div>
    </div>
  );
}
