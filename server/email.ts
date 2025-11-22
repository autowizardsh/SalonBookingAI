import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    // Use Resend's test sender for testing purposes
    fromEmail: 'onboarding@resend.dev'
  };
}

export interface BookingConfirmationData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  stylistName: string;
  date: string;
  time: string;
  price: number;
  duration: number;
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #667eea; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Booking Confirmed!</h1>
              <p>Your appointment at Elegance Salon has been confirmed</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.customerName},</p>
              
              <p>Thank you for choosing Elegance Salon! We're excited to serve you.</p>
              
              <div class="booking-details">
                <h3 style="margin-top: 0; color: #667eea;">Appointment Details</h3>
                
                <div class="detail-row">
                  <span class="label">Service:</span>
                  <span>${data.serviceName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Stylist:</span>
                  <span>${data.stylistName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span>${formattedDate}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Time:</span>
                  <span>${data.time}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Duration:</span>
                  <span>${data.duration} minutes</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Price:</span>
                  <span>$${data.price}</span>
                </div>
              </div>
              
              <p><strong>Important Reminders:</strong></p>
              <ul>
                <li>Please arrive 5-10 minutes early to check in</li>
                <li>If you need to cancel or reschedule, please contact us at least 24 hours in advance</li>
                <li>Bring any inspiration photos if you have a specific style in mind</li>
              </ul>
              
              <p>We'll send you a reminder the day before your appointment.</p>
              
              <p>Looking forward to seeing you!</p>
              
              <p>Best regards,<br>
              <strong>Elegance Salon Team</strong></p>
            </div>
            
            <div class="footer">
              <p>Elegance Salon | Premium Hair Care Services</p>
              <p>This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: `Booking Confirmed - ${data.serviceName} on ${formattedDate}`,
      html: emailHtml,
    });

    console.log('[EMAIL] Booking confirmation sent:', result);
    return { success: true, result };
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send booking confirmation:', error);
    return { success: false, error };
  }
}

export async function sendAppointmentReminder(data: BookingConfirmationData) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .reminder-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #f5576c; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Appointment Reminder</h1>
              <p>Your appointment is tomorrow!</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.customerName},</p>
              
              <div class="reminder-box">
                <h3 style="margin-top: 0;">⏰ Don't Forget!</h3>
                <p style="margin-bottom: 0;">You have an appointment at Elegance Salon <strong>tomorrow</strong>.</p>
              </div>
              
              <div class="booking-details">
                <h3 style="margin-top: 0; color: #f5576c;">Appointment Details</h3>
                
                <div class="detail-row">
                  <span class="label">Service:</span>
                  <span>${data.serviceName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Stylist:</span>
                  <span>${data.stylistName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span>${formattedDate}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Time:</span>
                  <span>${data.time}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Duration:</span>
                  <span>${data.duration} minutes</span>
                </div>
              </div>
              
              <p><strong>Preparation Tips:</strong></p>
              <ul>
                <li>Please arrive 5-10 minutes early</li>
                <li>Come with clean, dry hair (unless otherwise instructed)</li>
                <li>Bring any inspiration photos</li>
                <li>If you need to cancel, please contact us ASAP</li>
              </ul>
              
              <p>We're looking forward to seeing you tomorrow!</p>
              
              <p>Best regards,<br>
              <strong>Elegance Salon Team</strong></p>
            </div>
            
            <div class="footer">
              <p>Elegance Salon | Premium Hair Care Services</p>
              <p>This is an automated reminder email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: `Reminder: Your Appointment Tomorrow at ${data.time}`,
      html: emailHtml,
    });

    console.log('[EMAIL] Appointment reminder sent:', result);
    return { success: true, result };
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send appointment reminder:', error);
    return { success: false, error };
  }
}
