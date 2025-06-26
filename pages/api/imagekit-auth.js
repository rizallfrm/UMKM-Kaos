import imagekit from "@/lib/imagekit";

export default function handler(req, res) {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    console.log("Auth Params:", authParams);

    res.status(200).json(authParams);
  } catch (error) {
    console.error("Error generating ImageKit auth params:", error);
    res
      .status(500)
      .json({ message: "Failed to generate ImageKit auth params" });
  }
}
