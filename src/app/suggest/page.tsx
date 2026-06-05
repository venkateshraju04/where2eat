import type { Metadata } from "next";
import SuggestPage from "./SuggestPage";

export const metadata: Metadata = {
  title: "Suggest a Spot — SpinBite",
};

export default function Page() {
  return <SuggestPage />;
}
