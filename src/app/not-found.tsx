import { ErrorState } from "@/components/ui/primitives";

export default function NotFound() {
  return <ErrorState title="404. THIS PAGE LEFT THE CHAT." text="The page you're after doesn't exist (or got too cool for us)." />;
}
