import { AuthInitializer } from "@/features/auth/components/AuthInitializer";
import { LogOutBtn } from "@/features/auth/components/LogOutBtn";

export default function mainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthInitializer>{children}</AuthInitializer>
      <LogOutBtn />
    </>
  );
}
