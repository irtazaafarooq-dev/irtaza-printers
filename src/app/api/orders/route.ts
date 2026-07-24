import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const newOrder = await Order.create(body);

    // ===================================================================
    // 1. SEND WHATSAPP NOTIFICATION VIA WANOTIFIER
    // ===================================================================
    try {
      // ⚠️ IMPORTANT: Replace this URL with your unique WANotifier Webhook URL
      await fetch("https://app.wanotifier.com/api/v1/notifications/DjE84i6buK?key=fcypmY3WgaOJlNFN4fVOxINfGpuY9o", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: {
            body_variables: [
              newOrder._id.toString().slice(-6).toUpperCase(), // This replaces {{1}}
              newOrder.total.toLocaleString()                  // This replaces {{2}}
            ]
          },
          recipients: [
            {
              whatsapp_number: "+923218442114" // Formatted exactly like the example
            }
          ]
        })
      });
    } catch (waError) {
      console.error("WANotifier WhatsApp Alert Failed:", waError);
    }

    // ===================================================================
    // 2. SEND CONFIRMATION EMAIL TO CUSTOMER
    // ===================================================================
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, 
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });

      const mailOptions = {
        from: `"Irtaza Printers" <${process.env.EMAIL_USER}>`, 
        // CHANGED: Now successfully targets the email inside the customer object
        to: newOrder.customer.email, 
        subject: `Order Confirmation - #${newOrder._id.toString().slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
            <h2 style="color: #171717;">Thank you for your order, ${newOrder.customer.name}!</h2>
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

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email Sending Failed:", emailError);
    }
    // ===================================================================

    // ===================================================================
    // 3. SEND ORDER NOTIFICATION EMAIL TO YOU (BUSINESS OWNER)
    // ===================================================================
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Irtaza Printers - New Order" <${process.env.EMAIL_USER}>`,
        to: process.env.OWNER_EMAIL, // your personal/local email
        subject: `🛒 New Order Received - #${newOrder._id.toString().slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
            <h2 style="color: #171717;">📦 New Order Received!</h2>

            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> #${newOrder._id.toString().slice(-6).toUpperCase()}</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> Rs. ${newOrder.total.toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${newOrder.customer.name}</p>
              <p style="margin: 5px 0;"><strong>Customer Email:</strong> ${newOrder.customer.email}</p>
              <p style="margin: 5px 0;"><strong>Customer Phone:</strong> ${newOrder.customer.phone || "N/A"}</p>
            </div>

            <p style="color: #525252;">Log in to your admin panel to view full order details and start processing it.</p>
          </div>
        `,
      });
    } catch (ownerEmailError) {
      console.error("Owner Notification Email Failed:", ownerEmailError);
    }
    // ===================================================================

    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });

  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}