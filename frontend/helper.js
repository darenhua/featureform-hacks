import * as Application from "expo-application";

export async function getVendorId() {
  try {
    const idfv = await Application.getIosIdForVendorAsync();
    if (idfv) {
      console.log("IDFV:", idfv);
    } else {
      console.log("IDFV is not yet available. Try again later.");
    }
  } catch (error) {
    console.error("Error getting IDFV:", error);
  }
}
