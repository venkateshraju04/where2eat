import type { Metadata } from "next";
import SuggestPage from "./SuggestPage";

export const metadata: Metadata = {
  title: "Suggest a Spot — Where2Eat",
  description:
    "Recommend your favorite hidden food gems, restaurants, or aesthetic cafes in Bangalore to help grow Where2Eat.",
  alternates: {
    canonical: "/suggest",
  },
};

export default function Page() {
  return <SuggestPage />;
}
