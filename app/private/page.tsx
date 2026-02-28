import { Button } from "@/components/ui/button";
import { logout } from "@/app/login/actions";

export default function PrivatePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Private Area</h1>
      <p className="text-muted-foreground">
        You are logged in. This content is password-protected.
      </p>
      <form action={logout}>
        <Button variant="outline">Logout</Button>
      </form>
    </div>
  );
}
