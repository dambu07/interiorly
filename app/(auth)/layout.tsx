import { AuthProvider } from "@/lib/provider/auth-provider";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
