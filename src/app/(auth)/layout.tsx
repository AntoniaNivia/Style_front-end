import { StyleWiseLogo } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
            <StyleWiseLogo className="h-10 w-auto" />
        </div>
        {children}
      </div>
    </main>
  );
}
