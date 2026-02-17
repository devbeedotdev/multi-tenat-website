export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">
        This is the root app route. Tenant-specific routes are served from <code>/[domain]</code>.
      </p>
    </main>
  );
}

