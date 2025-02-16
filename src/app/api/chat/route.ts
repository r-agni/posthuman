export async function POST(req: any) {
  try {
    const { input, history } = await req.json();

    const response = await fetch("http://localhost:7325/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, history }),
    });

    const data = await response.json();

    return new Response(JSON.stringify({ response: data.message }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ response: "Error processing request" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
