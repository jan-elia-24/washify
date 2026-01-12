import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Clock, MapPin } from "lucide-react";

export default function Home() {
  const features = [
    { icon: MapPin, title: "Vi kommer till dig", description: "Boka var du vill - hemma eller på jobbet" },
    { icon: Clock, title: "Flexibla tider", description: "Välj den tid som passar dig bäst" },
    { icon: Sparkles, title: "Professionell kvalitet", description: "Erfarna tvättare med premium produkter" },
  ];

  const packages = [
    { name: "Basic", price: "299", features: ["Utvändig tvätt", "Torkning", "Fälgrengöring"], duration: "30 min" },
    { name: "Premium", price: "499", features: ["Allt i Basic", "Invändig dammsugning", "Fönsterputsning"], duration: "60 min", popular: true },
    { name: "Deluxe", price: "799", features: ["Allt i Premium", "Invändig rengöring", "Vaxning"], duration: "90 min" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container relative px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000 hover:scale-105 transition-transform cursor-default">
              Professionell biltvätt direkt till din dörr
            </h1>
            <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Boka enkelt, vi tar hand om resten. Din bil förtjänar det bästa.
            </p>
            <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/book">Boka nu</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="#packages">Se priser</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-y">
        <div className="container px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Välj ditt paket</h2>
            <p className="text-muted-foreground text-lg">Alla priser inkluderar moms</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, i) => (
              <Card key={i} className={`relative ${pkg.popular ? 'border-primary border-2 shadow-xl scale-105' : 'border-2'}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Populärast
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-sm">{pkg.duration}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground"> kr</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={pkg.popular ? "default" : "outline"}>
                    <Link href="/book">Välj {pkg.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}