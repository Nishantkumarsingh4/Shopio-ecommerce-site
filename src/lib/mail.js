import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendOrderEmails(orderDetails) {
    const { orderId, name, address, phone, pin, items, totalPrice, userEmail, paymentMethod } = orderDetails;

    const itemsList = items.map(item => `- ${item.name} (${item.quantity}x) - ₹${Number(item.price).toFixed(2)}`).join('\n');

    // 1. Email to Admin
    const adminMailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 New Order Received! #ORD-${orderId}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                <h2 style="color: #6366f1;">New Order Alert!</h2>
                <p>Bhai, a new order has been placed on the website.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <h3 style="margin-top: 0;">Order Details:</h3>
                <p><strong>Order ID:</strong> #ORD-${orderId}</p>
                <p><strong>Customer:</strong> ${name}</p>
                <p><strong>Contact:</strong> ${phone}</p>
                <p><strong>Payment:</strong> ${paymentMethod}</p>
                <p><strong>Total Amount:</strong> ₹${Number(totalPrice).toFixed(2)}</p>
                
                <h3>Items:</h3>
                <p style="white-space: pre-line;">${itemsList}</p>

                <h3>Delivery Address:</h3>
                <p>${address}, ${pin}</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">Check the Admin Dashboard for more details.</p>
            </div>
        `
    };

    // 2. Email to User
    const userMailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: `✨ Order Confirmed! #ORD-${orderId}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 30px; background-color: #fcfcfc;">
                <h1 style="color: #6366f1; margin-top: 0;">Order Confirmed!</h1>
                <p>Hello ${name}, thank you for shopping with us! Your order has been successfully placed.</p>
                
                <div style="background-color: #fff; padding: 20px; border-radius: 20px; border: 1px solid #f0f0f0; margin: 25px 0;">
                    <h3 style="margin-top: 0; color: #444;">Order Summary #ORD-${orderId}</h3>
                    <p style="white-space: pre-line; color: #666;">${itemsList}</p>
                    <hr style="border: 0; border-top: 1px solid #f0f0f0;">
                    <p style="font-size: 18px; font-weight: bold;">Total Paid: ₹${Number(totalPrice).toFixed(2)}</p>
                </div>

                <div style="background-color: #f5f3ff; padding: 20px; border-radius: 20px; color: #5b21b6;">
                    <p style="margin: 0;"><strong>Need Help?</strong> Contact the seller at: <strong>7461810973</strong></p>
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #888; text-align: center;">
                    We are getting your order ready for shipment. Stay tuned!
                </p>
            </div>
        `
    };

    try {
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);
        console.log("Emails sent successfully");
        return true;
    } catch (error) {
        console.error("Failed to send emails:", error);
        return false;
    }
}

export async function sendOrderStatusUpdateEmail(orderDetails) {
    const { orderId, name, userEmail, status, productName } = orderDetails;

    const isCancelled = status === 'CANCELLED';
    const isDelivered = status === 'DELIVERED';

    const subject = isCancelled
        ? `🔴 Order Cancelled #ORD-${orderId}`
        : `✅ Order Delivered! #ORD-${orderId}`;

    const adminSubject = isCancelled
        ? `⚠️ Order Cancelled by User #ORD-${orderId}`
        : `📦 Order Marked as Delivered #ORD-${orderId}`;

    const userHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 30px; background-color: #fcfcfc;">
            <h1 style="color: ${isCancelled ? '#ef4444' : '#10b981'}; margin-top: 0;">
                Order ${isCancelled ? 'Cancelled' : 'Delivered!'}
            </h1>
            <p>Hello ${name}, your order for <strong>${productName}</strong> has been ${isCancelled ? 'successfully cancelled' : 'delivered'}.</p>
            
            <div style="background-color: #fff; padding: 20px; border-radius: 20px; border: 1px solid #f0f0f0; margin: 25px 0;">
                <p><strong>Order ID:</strong> #ORD-${orderId}</p>
                <p><strong>Status:</strong> <span style="color: ${isCancelled ? '#ef4444' : '#10b981'}; font-weight: bold;">${status}</span></p>
            </div>

            <div style="background-color: #f5f3ff; padding: 20px; border-radius: 20px; color: #5b21b6;">
                <p style="margin: 0;"><strong>Need Help?</strong> Contact us at: <strong>7461810973</strong></p>
            </div>
        </div>
    `;

    const adminHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
            <h2 style="color: #6366f1;">Order Update</h2>
            <p>Order #ORD-${orderId} has been updated to: <strong>${status}</strong></p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p><strong>Customer:</strong> ${name}</p>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Status:</strong> ${status}</p>
        </div>
    `;

    try {
        await Promise.all([
            transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: process.env.ADMIN_EMAIL,
                subject: adminSubject,
                html: adminHtml
            }),
            transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: userEmail,
                subject: subject,
                html: userHtml
            })
        ]);
        return true;
    } catch (error) {
        console.error("Failed to send status update emails:", error);
        return false;
    }
}
