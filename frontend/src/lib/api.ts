export const fetchLinkedChildren = async () => {
  const response = await fetch("http://localhost:3000/api/children", {
    method: "GET",
    // This allows the browser to send the Better Auth cookies automatically
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch children");
  }
  return response.json();
};
