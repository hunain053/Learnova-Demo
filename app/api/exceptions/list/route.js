import { connectDb } from "@/lib/mongodb";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function GET(request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.split(" ")[1];

    const decodedToken = await verifyFirebaseToken(token);

    if (!decodedToken) {
      return jsonError("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const db = await connectDb();
    const collection = db.collection("exceptions");
    const query = { status: "pending" };

    // Fetch total document count under query
    const total = await collection.countDocuments(query);

    const exceptions = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(total / limit);

    return jsonSuccess({
      exceptions,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    }, 200);
  } catch (error) {
    console.error("Exception fetch error:", error);
    return jsonError("Internal server error", 500);
  }
}
