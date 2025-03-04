import { Params } from "@/types/global";
import { ProfileResponse } from "@/types/profileTypes";
import { optionalAuthHeaders } from "@/utils/auth/optionalAuthHeaders";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers = optionalAuthHeaders(token);

  // 프로필 데이터 가져오기
  const profileResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${slug}`,
    {
      headers,
    }
  ).then((res) => res.json() as Promise<ProfileResponse>);
  const { profile } = profileResponse;

  return {
    title: `${profile.username}의 프로필`,
    description: profile.bio || `${profile.username}의 프로필 페이지입니다.`,
    openGraph: {
      title: `${profile.username}의 프로필`,
      description: profile.bio || `${profile.username}의 프로필 페이지입니다.`,
      images: [
        {
          url: profile.image || "/default-profile.jpg",
          width: 800,
          height: 800,
          alt: profile.username,
        },
      ],
      type: "profile",
      username: profile.username,
    },
    twitter: {
      card: "summary",
      images: [profile.image || "/default-profile.jpg"],
    },
    // 프로필 페이지의 canonical URL 설정
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${slug}`,
    },
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
