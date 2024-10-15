import React from "react";
import { Alert, AlertTitle, List, ListItem, Typography } from "@mui/material";
import { ParsedMotifFile } from "@/app/AnnotationsVariants/types";

export type ErrorMessageProps = {
  files: ParsedMotifFile[];
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ files }) =>
  files.length === 0 ? null : (
    <Alert severity="error" sx={{ fontSize: "16px" }}>
      {" "}
      {/* Adjusted font size */}
      <AlertTitle sx={{ fontSize: "18px", fontWeight: "bold" }}>
        {" "}
        {/* Consistent title font size */}
        One or more of your files could not be searched:
      </AlertTitle>
      <List sx={{ paddingLeft: "20px" }}>
        {" "}
        {/* Added padding for bullets */}
        {files.map((x) => (
          <ListItem
            key={x.file.name}
            sx={{
              display: "list-item",
              listStyleType: "disc",
              marginLeft: "20px",
              fontSize: "16px",
            }}
          >
            <Typography>{x.file.name}</Typography>
          </ListItem>
        ))}
      </List>
      <Typography variant="body2" sx={{ mt: 1, fontSize: "16px" }}>
        Please check that these files are in valid MEME format. Note that the
        maximum file size that can be handled is 100 MB.
      </Typography>
    </Alert>
  );

export default ErrorMessage;
