import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
      <div>
        <div className="text-7xl font-bold">404</div>
        <p className="mt-2 text-muted-foreground">Page not found.</p>
        <Button asChild className="mt-6"><Link to="/">Go home</Link></Button>
      </div>
    </div>
  );
}
