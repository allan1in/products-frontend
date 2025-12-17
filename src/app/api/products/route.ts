export async function GET(request: Request) {
    const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL
    const token = process.env.API_TOKEN;

    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    const pageSize = searchParams.get("pageSize")
    const searchInput = searchParams.get("search")
    const sortBy = searchParams.get("sortBy")
    const sortOrder = searchParams.get("sortOrder")

    const requestURL = `${baseURL}/api/products?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[name][$containsi]=${searchInput}&sort=${sortBy}:${sortOrder}`;
    console.log("Request URL: ", requestURL);
    const res = await fetch(requestURL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}