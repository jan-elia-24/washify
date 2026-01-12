import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Fetch admin by email
    const { data: admin, error: fetchError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !admin) {
      return NextResponse.json(
        { error: "Fel e-post eller lösenord" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Fel e-post eller lösenord" },
        { status: 401 }
      );
    }

    // Return admin data (without password)
    return NextResponse.json({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Något gick fel" },
      { status: 500 }
    );
  }
}