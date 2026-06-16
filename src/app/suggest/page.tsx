import type { Metadata } from "next";
import SuggestPage from "./SuggestPage";

export const metadata: Metadata = {
  title: "Suggest a Spot — Where2Eat BLR",
};

export default function Page() {
  return <SuggestPage />;
}
