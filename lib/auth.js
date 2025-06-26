import { getServerSession } from "next-auth";
import authOptions from "@/lib/[...nextauth]";

export { authOptions };

export const getSession = async (req, res) => {
  return await getServerSession(req, res, authOptions);
};
