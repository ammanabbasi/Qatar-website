import { redirect } from "@/i18n/navigation";
import { cookies } from "next/headers";

export default async function LocaleRoot({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const saved = cookieStore.get("abk_audience")?.value;
  const audience = saved === "b2b" ? "b2b" : "b2c";
  redirect({ href: `/${audience}`, locale: locale as "en" | "ar" });
}
