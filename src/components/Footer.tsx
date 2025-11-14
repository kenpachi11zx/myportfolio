import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { MailIcon, Linkedin, Github, Phone } from "lucide-react";

export default function Footer() {
  // get the current time in IST (Asia/Kolkata)
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      // Display time in IST (Asia/Kolkata)
      setTime(
        date.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          timeZone: "Asia/Kolkata",
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-gradient-to-t from-primary/[1%] to-transparent">
      <div className="container mx-auto py-8">
        {/* Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <a
            href="mailto:sahilislam619@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email sahilislam619@gmail.com"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-muted/30 bg-background/60 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            <MailIcon className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/sahil-islam-b1955825a/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-muted/30 bg-background/60 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/kenpachi11zx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-muted/30 bg-background/60 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="tel:+916003021379"
            aria-label="Call +91 6003021379"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-muted/30 bg-background/60 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            <Phone className="h-5 w-5" />
          </a>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-row items-center justify-between gap-4 pt-4 border-t border-muted/30">
          <p className="text-xs text-muted-foreground">
            Local time: <span className="font-semibold">{time} IST</span>
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025{" "}
            <a
              href="https://github.com/kenpachi11zx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition hover:text-primary"
            >
              Sahil
            </a>
          </p>
        </div>
      </div>
      <div className="h-1 bg-[radial-gradient(closest-side,#8486ff,#42357d,#5d83ff,transparent)] opacity-50" />
    </footer>
  );
}
