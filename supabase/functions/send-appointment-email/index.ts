import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not configured in Supabase Edge Functions.");
    }

    const fromEmail = Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev";
    
    // Create Supabase Client using service role to read appointment details safely
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const bodyJson = await req.json();
    const { appointmentId, action } = bodyJson;

    if (!appointmentId || !action) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing appointmentId or action parameter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Fetch appointment record
    const { data: appt, error: apptError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (apptError || !appt) {
      return new Response(
        JSON.stringify({ success: false, error: "Appointment not found: " + (apptError?.message ?? "") }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    const name = appt.name;
    const email = appt.email;
    const phone = appt.phone;
    const date = appt.appointment_date;
    const time = appt.time_slot;
    const purpose = appt.purpose;

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "User email address is missing in the appointment record." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    let subject = "";
    let htmlContent = "";

    const logoUrl = "https://raw.githubusercontent.com/ujwalx23/Namami/main/src/assets/maa-vindhyavasini.png";

    // Style elements matching temple branding (OKLCH maps to these rich fallbacks)
    const primaryColor = "#6B1D2F"; // Saffron Maroon
    const secondaryColor = "#FF9933"; // Saffron Orange
    const accentColor = "#D4AF37"; // Metallic Gold
    const bgColor = "#FFFDF9"; // Soft Cream

    const emailHeaderHtml = `
      <div style="background-color: ${bgColor}; padding: 30px 15px; font-family: 'Georgia', 'Times New Roman', serif; color: #2C2C2C; max-width: 600px; margin: 0 auto; border: 2px solid ${accentColor}; border-radius: 12px; box-shadow: 0 4px 15px rgba(107,29,47,0.15);">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="${logoUrl}" alt="Maa Vindhyavasini Logo" style="max-height: 110px; width: auto; display: inline-block;" />
          <div style="color: ${primaryColor}; font-size: 24px; font-weight: bold; margin-top: 10px; letter-spacing: 1px; font-family: 'Times New Roman', serif;">
            Namami Vindhyavasini Sansthan
          </div>
          <div style="font-size: 11px; color: ${secondaryColor}; letter-spacing: 2px; text-transform: uppercase; font-weight: bold; margin-top: 4px;">
            Vindhyachal Dham • Trust
          </div>
          <div style="width: 80px; height: 2px; background: linear-gradient(90deg, transparent, ${accentColor}, transparent); margin: 15px auto 0;"></div>
        </div>
    `;

    const emailFooterHtml = `
        <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #ECECEC; text-align: center; font-size: 11px; color: #777777;">
          <p style="margin: 0 0 5px 0; font-weight: bold; color: ${primaryColor};">Namami Vindhyavasini Sansthan Trust</p>
          <p style="margin: 0 0 10px 0;">Vindhyachal Dham, Mirzapur, Uttar Pradesh 231307</p>
          <p style="margin: 0; font-size: 10px; color: #999999; font-style: italic;">
            This is an automated appointment notification email. Please do not reply directly to this address.
          </p>
        </div>
      </div>
    `;

    if (action === "approve") {
      subject = "🙏 Appointment Approved – Namami Vindhyavasini Sansthan";
      htmlContent = `
        ${emailHeaderHtml}
        <div style="line-height: 1.6; font-size: 14px; color: #333333; padding: 0 10px;">
          <p style="font-size: 16px; font-weight: bold; color: ${primaryColor}; margin-top: 0;">Namaste ${name},</p>
          <p style="font-size: 15px; font-weight: bold; color: ${secondaryColor};">Jai Maa Vindhyavasini 🙏</p>
          <p>We are delighted to inform you that your appointment request has been successfully approved by Namami Vindhyavasini Sansthan.</p>
          <p>Your appointment has been confirmed and scheduled as per the details below.</p>
          
          <div style="background: linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%); border: 1px solid ${accentColor}; border-radius: 8px; padding: 20px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <h4 style="margin: 0 0 15px 0; color: ${primaryColor}; border-bottom: 2px solid ${secondaryColor}; padding-bottom: 5px; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">Appointment Details</h4>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="border-bottom: 1px solid #F3F3F3;">
                <td style="padding: 8px 0; font-weight: bold; color: #555555; width: 120px;">Appointment ID:</td>
                <td style="padding: 8px 0; color: #222222; font-family: monospace; font-size: 12px;">${appointmentId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F3F3F3;">
                <td style="padding: 8px 0; font-weight: bold; color: #555555;">Name:</td>
                <td style="padding: 8px 0; color: #222222; font-weight: bold;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F3F3F3;">
                <td style="padding: 8px 0; font-weight: bold; color: #555555;">Email:</td>
                <td style="padding: 8px 0; color: #222222;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F3F3F3;">
                <td style="padding: 8px 0; font-weight: bold; color: #555555;">Phone Number:</td>
                <td style="padding: 8px 0; color: #222222;">${phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F3F3F3;">
                <td style="padding: 8px 0; font-weight: bold; color: #555555;">Date:</td>
                <td style="padding: 8px 0; color: ${primaryColor}; font-weight: bold;">${date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F3F3F3;">
                <td style="padding: 8px 0; font-weight: bold; color: #555555;">Time:</td>
                <td style="padding: 8px 0; color: ${primaryColor}; font-weight: bold;">${time}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F3F3F3;">
                <td style="padding: 8px 0; font-weight: bold; color: #555555;">Purpose:</td>
                <td style="padding: 8px 0; color: #222222; font-style: italic;">"${purpose}"</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555555;">Status:</td>
                <td style="padding: 8px 0; color: #10B981; font-weight: bold; font-size: 14px;">Approved ✅</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #FFF9F2; border-left: 4px solid ${secondaryColor}; padding: 12px 15px; margin-bottom: 20px; font-size: 13px;">
            <ul style="margin: 0; padding-left: 15px; color: #666666;">
              <li style="margin-bottom: 5px;">Please arrive <strong>10–15 minutes</strong> before your scheduled appointment time.</li>
              <li style="margin-bottom: 5px;">Kindly carry any necessary documents or information related to your visit.</li>
              <li>If you are unable to attend, please inform the administration in advance.</li>
            </ul>
          </div>

          <p>We sincerely thank you for your trust and look forward to welcoming you.</p>
          <p>May Maa Vindhyavasini bless you and your family with happiness, prosperity, good health, wisdom, and success.</p>
          
          <p style="text-align: center; font-size: 15px; font-weight: bold; color: ${primaryColor}; margin: 25px 0;">
            🌺 May the divine blessings of Maa Vindhyavasini guide your path and fill your life with peace, strength, and positivity. 🌺
          </p>

          <div style="margin-top: 25px; line-height: 1.5;">
            <p style="margin: 0; font-weight: bold; color: #444444;">With Blessings,</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; color: ${primaryColor};">🙏 Namami Vindhyavasini Sansthan</p>
            <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: bold; color: ${secondaryColor};">🌺 Jai Maa Vindhyavasini 🌺</p>
          </div>
        </div>
        ${emailFooterHtml}
      `;
    } else if (action === "reject") {
      subject = "Appointment Request Update – Namami Vindhyavasini Sansthan";
      htmlContent = `
        ${emailHeaderHtml}
        <div style="line-height: 1.6; font-size: 14px; color: #333333; padding: 0 10px;">
          <p style="font-size: 16px; font-weight: bold; color: ${primaryColor}; margin-top: 0;">Namaste ${name},</p>
          <p style="font-size: 15px; font-weight: bold; color: ${secondaryColor};">Jai Maa Vindhyavasini 🙏</p>
          <p>Thank you for submitting your appointment request to Namami Vindhyavasini Sansthan.</p>
          <p>After reviewing your request, we regret to inform you that we are unable to approve the appointment at this time.</p>
          
          <div style="background-color: #FDF4F5; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; font-size: 13.5px; color: #555555;">
            This may be due to scheduling limitations, availability constraints, or administrative considerations. We sincerely apologize for any inconvenience this may cause.
          </div>

          <p>You are welcome to submit a new appointment request for another available date and time by visiting our website.</p>
          <p>We pray that Maa Vindhyavasini blesses you and your family with happiness, health, prosperity, and success.</p>
          <p>Thank you for your understanding and continued faith.</p>

          <div style="margin-top: 30px; line-height: 1.5;">
            <p style="margin: 0; font-weight: bold; color: #444444;">With Regards,</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; color: ${primaryColor};">🙏 Namami Vindhyavasini Sansthan</p>
            <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: bold; color: ${secondaryColor};">🌺 Jai Maa Vindhyavasini 🌺</p>
          </div>
        </div>
        ${emailFooterHtml}
      `;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid action value. Must be 'approve' or 'reject'" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Call Resend API to deliver the email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const resJson = await res.json();

    if (!res.ok) {
      console.error("Resend API returned error:", resJson);
      throw new Error(resJson.message || "Failed to send email via Resend API.");
    }

    return new Response(
      JSON.stringify({ success: true, messageId: resJson.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error sending appointment email:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
