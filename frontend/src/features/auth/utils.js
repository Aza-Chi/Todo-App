export async function getStatus() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/status`,
        { credentials: "include" }
      );
      if (res.ok) {
        const authData = await res.json();
        return authData;
      }
      throw new Error("Unexpected status code.");
    } catch (error) {
      return { logged_in: false, id: null, email_address: null, auth_method: null };
    }
  }