"use client"

import React, { useState } from "react";
import FormElement from "./formElement";
import { createInvoice } from "@/services/api";
import Invoice from "./invoice";

const InvoiceForm = () => {

  const [pdfData, setPdfData] = useState(null)

  const [formData, setFormData] = useState({
    sender: { name: "", address: "", gstin: "", contact: "", email: "" },
    receiver: { name: "", address: "", gstin: "", contact: "", email: "" },
    items: [{ name: "", quantity: 1, rate: 0 }], // Start with one row for items
    gstRate: 18.0,
  });

  // Handle input change for sender and receiver
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [name]: value,
      },
    });
  };

  // Handle input change for items
  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = name === "quantity" || name === "rate" ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, items: updatedItems });
  };

  // Add a new row for items
  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, rate: 0 }],
    });
  };

  const removeItemRow = (index) => {
    const newFormData = [...formData.items].filter((_, idx) => idx !== index);
    setFormData({
      ...formData,
      items: [...newFormData]
    })
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createInvoice(formData);
    setPdfData(response);
  };

  return (

    <div className="max-w-screen-xl m-auto">

      <h1 className="text-center font-bold text-4xl">Invoice Generator</h1>

      {pdfData ? <Invoice invoiceData={pdfData} /> : (
        <form onSubmit={handleSubmit}>
          {/* Sender Details */}
          <div className="grid gap-6 mb-6 lg:grid-cols-2">
            <FormElement label="Sender's Name" value={formData.sender.name} placeholder="Tekken Infield" index="sender" name="name" handleInputChange={handleInputChange} />
            <FormElement label="Address" value={formData.sender.address} placeholder="Plot 32, Kheri Village" index="sender" name="address" handleInputChange={handleInputChange} />
            <FormElement label="GSTIN" value={formData.sender.gstin} placeholder="06AFXXXXXXXX" index="sender" name="gstin" handleInputChange={handleInputChange} />
            <FormElement label="Mobile" type="tel" value={formData.sender.contact} placeholder="+91 999XXXXXXX" index="sender" name="contact" handleInputChange={handleInputChange} />
            <FormElement label="Email" type="email" value={formData.sender.email} placeholder="email@gmail.com" index="sender" name="email" handleInputChange={handleInputChange} />
          </div>

          <hr />

          <div className="grid gap-6 my-6 lg:grid-cols-2">
            <FormElement label="Reciever's Name" value={formData.receiver.name} placeholder="ABC Company" index="receiver" name="name" handleInputChange={handleInputChange} />
            <FormElement label="Address" value={formData.receiver.address} placeholder="Plot 32, Kheri Village" index="receiver" name="address" handleInputChange={handleInputChange} />
            <FormElement label="GSTIN" value={formData.receiver.gstin} placeholder="06AFXXXXXXXX" index="receiver" name="gstin" handleInputChange={handleInputChange} />
            <FormElement label="Mobile" type="tel" value={formData.receiver.contact} placeholder="+91 999XXXXXXX" index="receiver" name="contact" handleInputChange={handleInputChange} />
            <FormElement label="Email" type="email" value={formData.receiver.email} placeholder="email@gmail.com" index="receiver" name="email" handleInputChange={handleInputChange} />
          </div>

          <hr />

          <div className="my-6">
            <div className="flex justify-between">
              <h2>Items</h2>
              <button type="button" onClick={addItemRow} className="border-white border-2 px-4 py-2">
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} style={{ marginBottom: "10px" }} className="grid gap-6 my-6 lg:grid-cols-9">
                <FormElement className="col-span-4" label="Product's Name" value={item.name} placeholder="Item Name" name="name" index={index} handleInputChange={handleItemChange} />
                <FormElement className="col-span-2" label="Quantity" type="number" value={item.quantity} placeholder="Quantity" name="quantity" index={index} handleInputChange={handleItemChange} />
                <FormElement className="col-span-2" label="Rate" type="number" value={item.rate} placeholder="Price" name="rate" index={index} handleInputChange={handleItemChange} />
                <button type="button" onClick={() => removeItemRow(index)} className="text-red-500 my-6">Remove</button>
              </div>
            ))}

          </div>


          {/* Submit Button */}
          <button type="submit" className="border-white border-2 px-4 py-2 ml-auto">Generate Invoice</button>
        </form>
      )}


    </div>
  );
};

export default InvoiceForm;
