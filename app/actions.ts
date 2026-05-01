"use server";

import { neon } from '@neondatabase/serverless';

export async function saveResponses(data: any) {
    try {
        const sql = neon(process.env.DATABASE_URL!);
        await sql`
      INSERT INTO survival_responses 
      (name, q1_mental, q2_academic, q3_ticket, q4_summer, q5_crush, reward_choice, meetup_time)
      VALUES 
      (${data.name}, ${data.q1}, ${data.q2}, ${data.q3}, ${data.q4}, ${data.q5}, ${data.reward}, ${data.time})
    `;
        console.log("Responses saved successfully!");
    } catch (error) {
        console.error("Database Error:", error);
    }
}