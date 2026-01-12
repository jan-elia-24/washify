export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Washify
          </h1>
          <p className="text-xl text-muted-foreground">
            Professionell biltvätt direkt till din dörr
          </p>
          <div className="mt-12 p-8 border rounded-xl bg-card">
            <p className="text-muted-foreground">
              Välkommen till Washify! Vi bygger din bokningsplattform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}