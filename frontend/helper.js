import * as Application from "expo-application";

export async function getVendorId() {
  try {
    return await Application.getIosIdForVendorAsync();
  } catch (error) {
    return null;
  }
}
