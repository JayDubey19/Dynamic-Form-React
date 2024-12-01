import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";

function DynamicForm({ formConfig, onSubmit, defaultValues }) {
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    defaultValues,
  });
  const [progress, setProgress] = useState(0);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  const allFields = watch();

  useEffect(() => {
    const totalFields = formConfig.fields.length;
    const filledFields = formConfig.fields.filter(
      (field) =>
        allFields[field.name] &&
        (!field.required || (field.required && allFields[field.name]))
    ).length;

    const completionPercentage = Math.round((filledFields / totalFields) * 100);
    setProgress(completionPercentage);
  }, [allFields, formConfig.fields]);

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 2 }}>
      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1"></Typography>
        <LinearProgress variant="determinate" value={progress} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          {progress}% 
        </Typography>
      </Box>

      {/* Form Fields */}
      {formConfig.fields.map((field) => (
        <Box key={field.name} sx={{ mb: 2 }}>
          {field.type === "dropdown" ? (
            <Select
              fullWidth
              {...register(field.name, { required: field.required })}
              defaultValue={defaultValues ? defaultValues[field.name] : ""}
            >
              <MenuItem value="" disabled>
                Select {field.label}
              </MenuItem>
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <TextField
              fullWidth
              label={field.label}
              type={field.type}
              {...register(field.name, { required: field.required })}
              error={!!errors[field.name]}
              helperText={errors[field.name] && `${field.label} is required`}
              inputProps={{
                ...(field.type === "text" && { pattern: "[A-Za-z ]+" }), // Ensure only text for 'text' fields
              }}
            />
          )}
        </Box>
      ))}
      
      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary">
        {defaultValues ? "Save Changes" : "Submit"}
      </Button>
    </Box>
  );
}

export default DynamicForm;
