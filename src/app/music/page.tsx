import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Sidan är inte tillgänglig ännu</h2>
        <p className="text-gray-600 mb-6">Den här vyn är inte klar än eller så har du gått till en ogiltig adress.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Gå till startsidan
        </Link>
      </div>
    </div>
  );
}