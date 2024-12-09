import { useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { format } from 'date-fns';

function formatDateWithDateFns(mongoDate) {
    return format(new Date(mongoDate), 'dd-MM-yyyy');
  }

const Invoice = ({invoiceData}) => {
  const {sender, receiver, gstRate, items, subTotal, igst, grandTotal, roundOff, date, _id} = invoiceData
  const formattedDate = formatDateWithDateFns(new Date(date));

  const invoiceRef = useRef();

  const handleDownloadPDF = () => {
    if (!invoiceRef.current) return;

    // Convert the invoice to an image
    toPng(invoiceRef.current, { quality: 1 }).then((dataUrl) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

  return (
    <div className="min-h-screen text-black bg-white flex flex-col items-center py-10">
      {/* Invoice Content */}
      <div
        ref={invoiceRef}
        className="bg-white shadow-lg rounded-md p-6 w-[21cm] max-w-full"
      >
        {/* Header */}
        <div className="text-center border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold">Invoice</h1>
        </div>
        <p className="text-right font-medium">Date: {formattedDate}</p>

        {/* Sender and Receiver Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">From:</h2>
            <p className="uppercase">{sender.name}</p>
            <p>{sender.address}</p>
            <p>GSTIN: {sender.gstin}</p>
            <p>Contact: {sender.contact}</p>
            <p>Email: {sender.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">To:</h2>
            <p className="uppercase">M/s {receiver.name}</p>
            <p>{receiver.address}</p>
            <p>GSTIN: {receiver.gstin}</p>
            <p>Contact: {receiver.contact}</p>
            <p>Email: {receiver.email}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 px-4 py-2">S.No.</th>
                <th className="border border-gray-200 px-4 py-2" colSpan="2">Item</th>
                <th className="border border-gray-200 px-4 py-2">Qty</th>
                <th className="border border-gray-200 px-4 py-2">Rate</th>
                <th className="border border-gray-200 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
            {items?.map((item, index) => (
                <tr key={item._id}>
                    <td className="border border-gray-200 px-4 py-2">{index+1}</td>
                    <td className="border border-gray-200 px-4 py-2" colSpan="2">{item.name}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.quantity}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.rate}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.amount}</td>
                </tr>
            ))}
            </tbody>
            <tfoot>
                <tr className="bg-gray-100">
                    <td colSpan="5" className="border border-gray-200 px-4 py-2 text-right">
                    Total
                    </td>
                    <td className="border border-gray-200 px-4 py-2">₹ {subTotal}</td>
                </tr>
                <tr className="bg-gray-100">
                <td colSpan="5" className="border border-gray-200 px-4 py-2 text-right">
                  IGST (@{gstRate}%)
                </td>
                <td className="border border-gray-200 px-4 py-2">₹ {igst}</td>
              </tr>
              <tr className="bg-gray-100">
                <td colSpan="5" className="border border-gray-200 px-4 py-2 text-right font-bold">
                  Total
                </td>
                <td className="border border-gray-200 px-4 py-2 font-bold">₹ {grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bank Details */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Bank Details:</h2>
          <p>Kotak Mahindra Bank</p>
          <p>Account No.: 7733000100</p>
          <p>IFSC: KKBK0004369</p>
        </div>

        {/* Terms */}
        <div className="mt-6 text-sm">
          <p className="text-gray-600">
            <strong>Terms and Conditions:</strong> If payment is not made within the specified
            period, interest will be applied at a rate of 18% p.a.
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Download PDF
      </button>
    </div>
  );
};

export default Invoice;
