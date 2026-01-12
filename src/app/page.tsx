import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Washify</h1>
        <p className="text-lg text-muted-foreground">
          Mobile Car Wash Booking System
        </p>
        <div className="mt-8 p-6 border rounded-lg">
          <p>Test dark mode med knappen uppe till höger!</p>
        </div>
      </div>
    </div>
  );
}