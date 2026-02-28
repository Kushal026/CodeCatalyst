import { Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Codecatalyst
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Analyze
          </Link>
          <Link
            to="/how-it-works"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/how-it-works" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            How It Works
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
