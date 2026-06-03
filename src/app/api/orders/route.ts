import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import nodemailer from "nodemailer"; // <-- NEW: Import Nodemailer

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // Grab the data sent from the checkout page
    const body = await req.json();
    
    // Create and save the new order to MongoDB
    const newOrder = await Order.create(body);

    // ===================================================================
    // 1. SEND WHATSAPP NOTIFICATION VIA WANOTIFIER (Admin)
    // ===================================================================
    try {
      await fetch("https://api.wanotifier.com/v1/messages/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WANOTIFIER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: "923084445261", 
          type: "template",
          template: {
            name: "order_alert", 
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: newOrder._id.toString().slice(-6).toUpperCase() },
                  { type: "text", text: newOrder.total.toLocaleString() }
                ]
              }
            ]
          }
        })
      });
    } catch (waError) {
      console.error("WANotifier WhatsApp Alert Failed:", waError);
    }

    // ===================================================================
    // 2. NEW: SEND CONFIRMATION EMAIL TO CUSTOMER
    // ===================================================================
    try {
      // Configure the email transporter using your business email credentials
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, 
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });

      // Draft the email content
      const mailOptions = {
        from: `"Irtaza Printers" <${process.env.EMAIL_USER}>`, // Looks like: Irtaza Printers <info@irtazaprinters.com>
        to: newOrder.email, // Sends to the customer's email from the checkout form
        subject: `Order Confirmation - #${newOrder._id.toString().slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
            <h2 style="color: #171717;">Thank you for your order, ${newOrder.name}!</h2>
            <p style="color: #525252;">We have successfully received your order and are currently processing it. Here are your order details:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> #${newOrder._id.toString().slice(-6).toUpperCase()}</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> Rs. ${newOrder.total.toLocaleString()}</p>
            </div>
            
            <p style="color: #525252;">We will notify you once your order is ready and shipped.</p>
            <br/>
            <p style="color: #171717; margin-bottom: 0;">Best Regards,</p>
            <p style="color: #171717; font-weight: bold; margin-top: 5px;">Irtaza Printers</p>
          </div>
        `,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email Sending Failed:", emailError);
    }
    // ===================================================================

    // Return a success message with the order ID
    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });

  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}