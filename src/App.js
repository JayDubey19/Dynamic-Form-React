import React, { useState } from "react";
import { Container, Box, Typography, Select, MenuItem, Button, Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "./components/DynamicForm";
import { motion } from "framer-motion";

const formConfigs = {
  userInfo: {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
  },
  addressInfo: {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      { 
        name: "state", 
        type: "dropdown", 
        label: "State", 
        options: ["Maharashtra", "Kerala", "Tamilnadu"], 
        required: true 
      },
      { name: "zipCode", type: "number", label: "Zip Code", required: false },
    ],
  },
  paymentInfo: {
    fields: [
      { name: "cardNumber", type: "number", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
    ],
  },
};

function App() {
  const [formType, setFormType] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [editData, setEditData] = useState(null);

  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
  };

  const handleFormSubmit = (formData) => {
    if (editData) {
      // Edit existing data
      const updatedData = submittedData.map((data, index) =>
        index === editData.index ? formData : data
      );
      setSubmittedData(updatedData);
      toast.success("Changes saved successfully!");
    } else {
      // Add new data
      setSubmittedData([...submittedData, { ...formData, formType }]);
      toast.success("Form submitted successfully!");
    }

    // Reset after submission
    setEditData(null);
    setFormType("");
  };

  const handleDelete = (index) => {
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
    toast.info("Entry deleted successfully!");
  };

  const handleEdit = (index) => {
    const entry = submittedData[index];
    setEditData({ index, data: entry });
    setFormType(entry.formType); // Set form type to the one of the entry being edited
  };

  // Ensure formConfig exists before passing it to DynamicForm
  const currentFormConfig = formConfigs[formType];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 3, color: "primary.main" }}>
          Dynamic Form Assignment
        </Typography>

        {/* Select form type for new submission */}
        {!editData && (
          <Select
            value={formType}
            onChange={handleFormTypeChange}
            displayEmpty
            fullWidth
            sx={{ mb: 3 }}
          >
            <MenuItem value="" disabled>
              Select Form Type
            </MenuItem>
            <MenuItem value="userInfo">User Information</MenuItem>
            <MenuItem value="addressInfo">Address Information</MenuItem>
            <MenuItem value="paymentInfo">Payment Information</MenuItem>
          </Select>
        )}

        {/* Show form only if formConfig exists */}
        {currentFormConfig && (
          <DynamicForm
            formConfig={currentFormConfig}
            onSubmit={handleFormSubmit}
            defaultValues={editData ? editData.data : {}}
          />
        )}

        {/* Submitted Data Table */}
        {submittedData.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Submitted Data
            </Typography>
            <Grid container spacing={2}>
              {submittedData.map((data, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                    <Typography>
                      {Object.keys(data).map((key) => (
                        <span key={key}>
                          <strong>{key}: </strong>
                          {data[key]}{" "}
                        </span>
                      ))}
                    </Typography>
                    <div>
                      <Button variant="contained" color="primary" onClick={() => handleEdit(index)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleDelete(index)}>
                        Delete
                      </Button>
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      <ToastContainer />
    </Container>
  );
}

export default App;
