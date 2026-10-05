

export async function apiFetch(url, options = {}, Email) {
    let accessToken = localStorage.getItem("AccessToken");

    // Add access token
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`
    };

    let response = await fetch(url, options);

    // Access token expired/invalid
    if (response.status === 401) {

        // Call refresh endpoint
        const refreshToken = localStorage.getItem("RefreshToken");

        const refreshResponse = await fetch(
            "https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Auth/refresh",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken: refreshToken,
                    email : Email
                })
            }
        );

        if (!refreshResponse.ok) {
            // Refresh token is also invalid/expired
            // → logout the user
            throw new Error("Session expired");
        }

        const data = await refreshResponse.json();

        // Save new access token
        localStorage.setItem("AccessToken", data.accessToken);
        localStorage.setItem("RefreshToken", data.refreshToken);

        // Retry original request with new token
        options.headers.Authorization =
            `Bearer ${data.AccessToken}`;

        response = await fetch(url, options);
    }

    return response;
}