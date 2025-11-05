'use client';

import { DatabaseProvider } from '@/src/context/DatabaseProvider.web';
import { useEffect, useState } from 'react';
import { useDatabase } from '@/src/context/DatabaseProvider.web';

// Define interface for Hymn type
interface Hymn {
  id: number;
  number: number;
  title: string;
  categories?: string | string[];
}

function AppContent() {
  const { executeQuery, loading } = useDatabase();
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHymns, setFilteredHymns] = useState<Hymn[]>([]);

  useEffect(() => {
    if (!loading && executeQuery) {
      loadHymns();
    }
  }, [loading]);

  const loadHymns = async () => {
    try {
      // Select only required columns for better performance
      const results = await executeQuery(
        'SELECT id, number, title, categories FROM songs ORDER BY number LIMIT 50'
      );
      setHymns(results);
      setFilteredHymns(results);
    } catch (err) {
      console.error('Error loading hymns:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredHymns(hymns);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = hymns.filter(
      (hymn) =>
        hymn.title?.toLowerCase().includes(query) ||
        hymn.number?.toString().includes(query)
    );
    setFilteredHymns(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredHymns(hymns);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-josefinBold mb-2">Himnario Adonai</h1>
          <p className="text-primary-100 font-josefin">Himnario digital del grupo cristiano Adonai</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca por número o título..."
              className="w-full px-5 py-4 pr-24 rounded-xl border border-neutral-200 bg-surface-secondary font-josefin text-base text-foreground focus:outline-none focus:border-primary-300 focus:bg-surface transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 text-primary-600 hover:text-primary-700 font-josefinSemibold"
            >
              🔍
            </button>
          </form>
        </div>

        {/* Welcome Message */}
        {filteredHymns.length === hymns.length && (
          <div className="mb-8 p-6 bg-primary-50 rounded-2xl border border-primary-100">
            <h2 className="text-xl font-josefinSemibold text-primary-900 mb-2">
              Bienvenido al Himnario Adonai
            </h2>
            <p className="text-primary-700 font-josefin">
              Explora nuestra colección de {hymns.length} himnos. Usa la barra de búsqueda para encontrar himnos por número o título.
            </p>
          </div>
        )}

        {/* Hymns Grid */}
        {filteredHymns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredHymns.map((hymn) => (
              <div
                key={hymn.id}
                className="bg-surface rounded-xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Card Header */}
                <div className="relative h-28 bg-primary-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-josefinBold opacity-90">
                    {hymn.number}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <p className="font-josefinSemibold text-sm text-primary-600 mb-1">
                    Himno {hymn.number}
                  </p>
                  <h3 className="font-josefin text-base text-foreground mb-2 line-clamp-2 leading-tight">
                    {hymn.title}
                  </h3>
                  {hymn.categories && (
                    <p className="font-josefin text-xs text-foreground-secondary">
                      {Array.isArray(hymn.categories) ? hymn.categories[0] : hymn.categories}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground-secondary font-josefin text-lg">
              No se encontraron himnos con "{searchQuery}"
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface-secondary border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-foreground-secondary font-josefin text-sm">
            © 2024 Himnario Adonai - Grupo Cristiano Adonai
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}
