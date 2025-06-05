
import { Metadata } from "next";
import ContactUsForm from "../_components/contact-us-form";

export const metadata: Metadata = {
    title: "Contact Us",
}
export default function page() {
    return (
        <ContactUsForm />
    )
}
