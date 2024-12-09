import axios from "axios";



export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post('http://localhost:8080/', invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error submitting invoice:", error);
  }
}
export const getInvoicePDF = (id) =>
  API.get(`/invoices/${id}/pdf`, { responseType: "blob" });
