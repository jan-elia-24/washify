import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { BookingConfirmationEmail } from "@/components/emails/booking-confirmation";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customerEmail,
            customerName,
            bookingNumber,
            serviceName,
            servicePrice,
            bookingDate,
            bookingTime,
            address,
            city,
            postalCode,
            carModel,
            licensePlate,
        } = body;

        const emailHtml = await render(
            BookingConfirmationEmail({
                bookingNumber,
                customerName,
                serviceName,
                servicePrice,
                bookingDate,
                bookingTime,
                address,
                city,
                postalCode,
                carModel,
                licensePlate,
            })
        );

        const { data, error } = await resend.emails.send({
            from: "Washify <onboarding@resend.dev>",
            to: [customerEmail],
            subject: `Bokningsbekräftelse - ${bookingNumber}`,
            html: emailHtml,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (error) {
        console.error("Email send error:", error);
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}