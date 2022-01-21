import { Typography } from "@mui/material";
import type { Variant } from "@mui/material/styles/createTypography";
import ReactMarkdown from "react-markdown";
import theme from "./theme";

interface MarkdownRendererProps {
    text: string,
    variant?: Variant
}

export default function MarkdownRenderer({ text, variant }: MarkdownRendererProps) {
    return (
        <Typography
            variant={variant ?? "body1"}
            component="div"
            sx={{
                "& a": {
                    color: theme.palette.primary.main,
                    "&:hover": {
                        textDecoration: "underline"
                    }
                },
                "& pre": {
                    backgroundColor: theme.palette.background.default,
                    display: "inline-block",
                    padding: "0.5rem",
                    borderRadius: "0.5rem"
                },
                "& code": {
                    backgroundColor: theme.palette.background.paper,
                    padding: "0 0.25rem",
                    borderRadius: "0.25rem"
                },
                lineHeight: 1
            }}
        >
            <ReactMarkdown>{text}</ReactMarkdown>
        </Typography>
    );
}