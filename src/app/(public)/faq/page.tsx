
import { Metadata } from "next";
import FAQSection from "../_components/faq-section";

export const metadata: Metadata = {
    title: "FAQ",
}
export default function page() {
    return (
        <FAQSection />
    )
}
