import { useQuery } from "@tanstack/react-query"
import { getCategories } from "../../services/subscription"

export const fetchCategories = async () => {
  console.log("Fetching categories...")
  const response = await getCategories()
  console.log(response)
  return response.data
}