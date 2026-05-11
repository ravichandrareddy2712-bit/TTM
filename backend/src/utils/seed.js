require("dotenv").config();
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");

const seed = async () => {
  try {
    await supabase.from("tasks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("project_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("users").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const passwordHash = await bcrypt.hash("password123", 10);

    const { data: users, error: userError } = await supabase
      .from("users")
      .insert([
        { name: "Admin User", email: "admin@example.com", password_hash: passwordHash, role: "admin" },
        { name: "Aisha Khan", email: "aisha@example.com", password_hash: passwordHash, role: "member" },
        { name: "Rahul Singh", email: "rahul@example.com", password_hash: passwordHash, role: "member" },
      ])
      .select("id, name, email, role");

    if (userError) throw userError;

    const admin = users.find((u) => u.role === "admin");
    const member1 = users.find((u) => u.email === "aisha@example.com");
    const member2 = users.find((u) => u.email === "rahul@example.com");

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        title: "Website Redesign",
        description: "Refresh the landing page and dashboard experience",
        admin_id: admin.id,
      })
      .select("id")
      .single();

    if (projectError) throw projectError;

    const { error: memberError } = await supabase.from("project_members").insert([
      { project_id: project.id, user_id: admin.id },
      { project_id: project.id, user_id: member1.id },
      { project_id: project.id, user_id: member2.id },
    ]);
    if (memberError) throw memberError;

    const { error: taskError } = await supabase.from("tasks").insert([
      {
        title: "Design hero section",
        description: "Create dark premium hero with CTA",
        due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        priority: "High",
        status: "To Do",
        assigned_to: member1.id,
        project: project.id,
        created_by: admin.id,
      },
      {
        title: "Build API integration",
        description: "Connect frontend dashboard with backend stats",
        due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
        priority: "Medium",
        status: "In Progress",
        assigned_to: member2.id,
        project: project.id,
        created_by: admin.id,
      },
    ]);

    if (taskError) throw taskError;

    console.log("Seed complete");
    console.log("Admin login: admin@example.com / password123");
    process.exit(0);
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
};

seed();
