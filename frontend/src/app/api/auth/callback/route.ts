import { NextRequest, NextResponse } from "next/server";

// GitHub OAuth — Step 2: Exchange code for token, fetch user, post back to opener
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return new NextResponse("Missing authorization code", { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse("GitHub OAuth not configured on server", {
      status: 500,
    });
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return new NextResponse(`GitHub OAuth error: ${tokenData.error_description}`, {
        status: 400,
      });
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userRes.ok) {
      return new NextResponse("Failed to fetch GitHub user profile", {
        status: 500,
      });
    }

    const userData = await userRes.json();

    const user = {
      login: userData.login,
      avatar_url: userData.avatar_url,
      name: userData.name,
      html_url: userData.html_url,
      public_repos: userData.public_repos,
      followers: userData.followers,
    };

    // Return an HTML page that posts the user data back to the opener window
    const html = `
<!DOCTYPE html>
<html>
  <head><title>CommitChain — Authenticated</title></head>
  <body>
    <script>
      if (window.opener) {
        window.opener.postMessage(
          { type: "github-auth-success", user: ${JSON.stringify(user)} },
          window.location.origin
        );
        window.close();
      } else {
        // Fallback: redirect to dashboard
        window.location.href = "/dashboard";
      }
    </script>
    <p>Authentication successful. This window should close automatically.</p>
  </body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("GitHub OAuth callback error:", err);
    return new NextResponse("Authentication failed", { status: 500 });
  }
}
